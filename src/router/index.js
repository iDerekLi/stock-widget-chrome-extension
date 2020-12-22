import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/index.html"
  },
  {
    path: "/index.html",
    name: "index",
    component: () => import("../views/index.vue")
  },
  {
    path: "/popup.html",
    name: "popup",
    component: () => import("../views/popup.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
