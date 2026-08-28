import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { DynamicBorder, getSelectListTheme } from "@earendil-works/pi-coding-agent";
import { Container, type SelectItem, SelectList, Text } from "@earendil-works/pi-tui";

function modelReference(provider: string, modelId: string): string {
	return `${provider}/${modelId}`;
}

async function chooseModel(pi: ExtensionAPI, ctx: ExtensionContext): Promise<void> {
	const models = (
		ctx.scopedModels.length > 0
			? ctx.scopedModels.map(({ model }) => model)
			: ctx.modelRegistry.getAvailable()
	).sort((left, right) =>
		modelReference(left.provider, left.id).localeCompare(modelReference(right.provider, right.id)),
	);

	if (models.length === 0) {
		ctx.ui.notify("No authenticated models are available to select", "warning");
		return;
	}

	const currentReference = ctx.model ? modelReference(ctx.model.provider, ctx.model.id) : undefined;
	const items: SelectItem[] = models.map((model) => {
		const reference = modelReference(model.provider, model.id);
		return {
			value: reference,
			label: reference === currentReference ? `${reference} (current)` : reference,
			description: model.name === model.id ? undefined : model.name,
		};
	});

	const selectedReference = await ctx.ui.custom<string | undefined>((tui, theme, _keybindings, done) => {
		const container = new Container();
		container.addChild(new DynamicBorder((text: string) => theme.fg("accent", text)));
		container.addChild(new Text(theme.fg("accent", theme.bold("Choose a model")), 1, 0));

		const selectList = new SelectList(items, Math.min(items.length, 15), getSelectListTheme());
		const currentIndex = items.findIndex(({ value }) => value === currentReference);
		if (currentIndex >= 0) selectList.setSelectedIndex(currentIndex);
		selectList.onSelect = ({ value }) => done(value);
		selectList.onCancel = () => done(undefined);
		container.addChild(selectList);
		container.addChild(
			new Text(theme.fg("dim", "type to filter • ↑↓ navigate • enter select • esc cancel"), 1, 0),
		);
		container.addChild(new DynamicBorder((text: string) => theme.fg("accent", text)));

		return {
			render: (width: number) => container.render(width),
			invalidate: () => container.invalidate(),
			handleInput: (data: string) => {
				selectList.handleInput(data);
				tui.requestRender();
			},
		};
	});

	if (!selectedReference) return;

	const selectedModel = models.find(
		(model) => modelReference(model.provider, model.id) === selectedReference,
	);
	if (!selectedModel) return;

	if (!(await pi.setModel(selectedModel))) {
		ctx.ui.notify(`No credentials are available for ${selectedReference}`, "error");
	}
}

export default function modelPicker(pi: ExtensionAPI) {
	pi.on("session_start", async (event, ctx) => {
		if (event.reason !== "startup" || ctx.mode !== "tui") return;
		await chooseModel(pi, ctx);
	});
}
