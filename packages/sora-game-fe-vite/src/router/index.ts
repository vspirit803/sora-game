import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/views/HelloWorld.vue") },
  { path: "/battle", component: () => import("@/views/Battle.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
