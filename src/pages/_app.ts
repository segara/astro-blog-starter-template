import type { App } from "vue";
import Vue3Toasity, { type ToastContainerOptions } from "vue3-toastify";

export default (app: App) => {
  app.use(Vue3Toasity, {
    autoClose: 3000,
    theme: "colored",
  } as ToastContainerOptions);
};
