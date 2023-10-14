// This code tells TypeScript that any file that ends with .vue is a
// Vue component, and it exports a DefineComponent from 'vue' module.

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
