import { type VNode } from "preact";
import { Button } from "../atoms/Button.tsx";

interface InputProps {
  className?: string;
  rounded?: "right" | "left" | "both" | "none";
  type?: "text" | "number" | "password" | "date" | "time";
  id?: string;
  label?: string;
  name: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
}

export const Input = (
  {
    className = "",
    rounded,
    type = "text",
    id,
    label,
    name,
    value,
    placeholder,
    required,
  }: InputProps,
): VNode => {
  let round: string;
  switch (rounded) {
    case "right":
      round = "rounded-r-lg";
      break;

    case "left":
      round = "rounded-l-lg";
      break;

    case "both":
      round = "rounded-lg";
      break;

    case "none":
      round = "";
      break;

    default:
      round = "";
      break;
  }

  return (
    <div class={`inline-flex flex-col ${className}`}>
      {label && (
        <label
          for={id}
          class="inline-block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        class={`bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${round}`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export const SearchField = (
  { className = "", id, label, value }: Omit<InputProps, "name">,
): VNode => {
  return (
    <div class={className}>
      <Input
        rounded="left"
        id={id}
        name="search"
        label={label}
        value={value}
        required
      />
      <Button className="rounded-r-lg border border-blue-700" type="submit">
        検索
      </Button>
    </div>
  );
};

export const Checkbox = (
  { className = "", label, name, required }: InputProps,
) => {
  return (
    <div class={`flex items-center ${className}`}>
      <input
        id={name}
        type="checkbox"
        name={name}
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        required={required}
      />
      <label
        for={name}
        class="pl-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
    </div>
  );
};

interface SelectProps extends InputProps {
  children: VNode[];
}

export const Select = (
  { className = "", label, name, required, children }: SelectProps,
) => {
  return (
    <div class={className}>
      <label
        for={name}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required={required}
      >
        {children}
      </select>
    </div>
  );
};

export const Textarea = (
  { className = "", label, name, required, placeholder }: InputProps,
) => {
  return (
    <div class={className}>
      <label
        for={name}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <textarea
        id={name}
        class="block p-2.5 w-full h-24 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        name={name}
        placeholder={placeholder}
        required={required}
      >
      </textarea>
    </div>
  );
};
