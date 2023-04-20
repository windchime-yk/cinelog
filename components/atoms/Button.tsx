import { type VNode } from "preact";

interface ButtonProps {
  className?: string;
  type: "button" | "submit";
  children: VNode | VNode[] | string;
}

export const Button = (
  { className = "", type, children }: ButtonProps,
): VNode => {
  return (
    <button
      type={type}
      class={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ${className}`}
    >
      {children}
    </button>
  );
};
