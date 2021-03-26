/*
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-03-11 16:20:05
 * @LastEditors: vspirit803
 */
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HelloWorld.vue'),
  },
  {
    path: '/battle',
    name: 'Battle',
    component: () => import('@/views/Battle.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
