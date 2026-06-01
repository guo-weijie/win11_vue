import type { App } from "vue";
import { drag } from "./drag";

const directiveObj = {
  drag,
};

export function myDirective(app: App<Element>) {
  for (const key in directiveObj) {
    app.directive(key, directiveObj[key as keyof typeof directiveObj]);
  }
}
