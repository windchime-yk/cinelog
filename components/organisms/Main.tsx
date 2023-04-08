import { type VNode } from "preact";

interface MainProps {
  children: VNode | VNode[];
}

export const Main = ({ children }: MainProps): VNode => (
  <main class="px-9">
    {children}
  </main>
);
