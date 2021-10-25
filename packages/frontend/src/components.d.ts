/*
 * @Author: vspirit803
 * @Date: 2021-10-07 09:34:12
 * @Description:
 * @LastEditTime: 2021-10-07 09:36:41
 * @LastEditors: vspirit803
 */
// components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink'];
    RouterView: typeof import('vue-router')['RouterView'];
    HomeButton: typeof import('@/components/HomeButton.vue')['default'];
  }
}

export {};
