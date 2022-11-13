/** @jsx h */
import { h, VNode } from "../../deps.ts";

interface MainProps {
  children: VNode | VNode[];
}

export const Main = ({ children }: MainProps): VNode => (
  <main class="px-9">
    {children}
  </main>
);
