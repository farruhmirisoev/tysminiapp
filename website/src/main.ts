import { createApp } from "vue";

import App from "@/App.vue";
import pinia from "@/store";
import router from "@/router";
import maska from "maska";
import "@/styles/index.scss";
import i18n from "./i18n";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(maska);
app.use(i18n);
app.mount("#app");
