import { App } from "vue";
import Menu from "./src/index.vue";

export default {
    install(app: App) {
        app.component("mMenu", Menu);
    },
};
