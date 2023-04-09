import { type VNode } from "preact";

interface HeadingProps {
  className?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: string | VNode;
}

export const Heading = (
  { level, children, className }: HeadingProps,
): VNode => {
  switch (level) {
    case 1:
      return <h1 class={`text-4xl font-bold ${className}`}>{children}</h1>;
    case 2:
      return <h2 class={`text-3xl font-bold ${className}`}>{children}</h2>;
    case 3:
      return <h3 class={`text-2xl font-bold ${className}`}>{children}</h3>;
    case 4:
      return <h4 class={`text-1xl font-bold ${className}`}>{children}</h4>;
    case 5:
      return <h5 class={`text-4xl font-bold ${className}`}>{children}</h5>;
    case 6:
      return <h6 class={`text-4xl font-bold ${className}`}>{children}</h6>;
    default:
      return <span>{children}</span>;
  }
};
