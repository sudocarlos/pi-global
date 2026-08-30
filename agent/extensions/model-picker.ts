import type { Api, Model } from "@earendil-works/pi-ai";
import {
	type ExtensionAPI,
	type ExtensionContext,
	ModelSelectorComponent,
	type ModelRuntime,
} from "@earendil-works/pi-coding-agent";

function createModelSelectorRuntime(ctx: ExtensionContext): ModelRuntime {
	const modelSelectorRuntime = {
		getAvailableSnapshot: () => ctx.modelRegistry.getAvailable(),
		getModel: (provider: string, modelId: string) => ctx.modelRegistry.find(provider, modelId),
		getError: () => ctx.modelRegistry.getError(),
		refresh: (options?: Parameters<ModelRuntime["refresh"]>[0]) => ctx.modelRegistry.refresh(options),
	} satisfies Pick<ModelRuntime, "getAvailableSnapshot" | "getModel" | "getError" | "refresh">;

	return modelSelectorRuntime as unknown as ModelRuntime;
}

// Survives /new: the extension factory is cached per cwd, so module state
// persists across session replacement while extension instances are rebound.
let lastSelectedModel: { provider: string; id: string } | undefined;

async function chooseModel(pi: ExtensionAPI, ctx: ExtensionContext): Promise<void> {
	const selectedModel = await ctx.ui.custom<Model<Api> | undefined>((tui, _theme, _keybindings, done) =>
		new ModelSelectorComponent(
			tui,
			ctx.model,
			createModelSelectorRuntime(ctx),
			ctx.scopedModels,
			done,
			() => done(undefined),
		),
	);

	if (!selectedModel) return;

	if (!(await pi.setModel(selectedModel))) {
		ctx.ui.notify(`No credentials are available for ${selectedModel.provider}/${selectedModel.id}`, "error");
		return;
	}

	lastSelectedModel = { provider: selectedModel.provider, id: selectedModel.id };
}

export default function modelPicker(pi: ExtensionAPI) {
	pi.on("model_select", (event) => {
		lastSelectedModel = { provider: event.model.provider, id: event.model.id };
	});

	pi.on("session_start", async (event, ctx) => {
		if (event.reason === "startup") {
			if (ctx.mode !== "tui") return;
			await chooseModel(pi, ctx);
			return;
		}

		if (event.reason !== "new" || !lastSelectedModel) return;

		const model = ctx.modelRegistry.find(lastSelectedModel.provider, lastSelectedModel.id);
		if (!model) return;

		if (!(await pi.setModel(model))) {
			ctx.ui.notify(`No credentials are available for ${model.provider}/${model.id}`, "error");
		}
	});
}
