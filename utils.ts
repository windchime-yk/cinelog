import { createDefine } from "fresh";

export type AppState = { title?: string };
export const define = createDefine<AppState>();
