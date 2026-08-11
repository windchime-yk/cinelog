import { type ComponentChildren, type VNode } from "preact";

interface MainProps {
  // 条件付きレンダリングの結果を受け取れるよう、VNode以外も許容する
  children: ComponentChildren;
}

export const Main = ({ children }: MainProps): VNode => (
  <main class="max-w-screen-xl w-full mx-auto mt-6 px-9">
    {children}
  </main>
);
