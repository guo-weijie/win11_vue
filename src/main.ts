import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { createPinia } from "pinia";

import "normalize.css/normalize.css";
import "@/style/index.css";

import { myDirective } from "@/directive/index";

const app = createApp(App);
myDirective(app);
app.use(createPinia()).use(router).mount("#app");
