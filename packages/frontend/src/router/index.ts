/*
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-06-28 17:30:04
 * @LastEditors: vspirit803
 */
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Main.vue'),
  },
  {
    path: '/battle',
    name: 'Battle',
    component: () => import('@/views/Battle.vue'),
  },
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('@/views/Teams.vue'),
  },
  {
    path: '/items',
    name: 'Items',
    component: () => import('@/views/Items.vue'),
  },
  {
    path: '/characters',
    name: 'Characters',
    component: () => import('@/views/Characters.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
