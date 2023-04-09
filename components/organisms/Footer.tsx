import { type VNode } from "preact";

export const Footer = (): VNode => (
  <footer class="pt-6 pb-3">
    <p class="text-center">
      <small>&copy; 2022-{new Date().getFullYear()} WhyK</small>
    </p>
  </footer>
);
