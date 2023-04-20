import { type VNode } from "preact";

interface MainProps {
  children: VNode | VNode[];
}

export const Main = ({ children }: MainProps): VNode => (
  <main class="max-w-screen-xl w-full mx-auto mt-6 px-9">
    {children}
  </main>
);
