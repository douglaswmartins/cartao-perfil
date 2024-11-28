import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHistory,
  faArrowRight,
  faEye,
  faEyeSlash,
  faBan,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { ContentLoader } from "vue-content-loader";

library.add(faHistory, faArrowRight, faEye, faEyeSlash, faBan, faMoon, faSun);

const app = createApp(App);

app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("content-loader", ContentLoader);

app.mount("#app");
