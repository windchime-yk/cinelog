import { createDefine } from "fresh";
import type { PickMovie } from "~/db/model.ts";
import type { Theater } from "~/db/model.ts";

export interface State {
  title?: string;
  movies?: Array<PickMovie>;
  theaters?: Array<Theater>;
  search?: string | null;
}

export const define = createDefine<State>();
