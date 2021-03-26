<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description: 
 * @LastEditTime: 2021-03-11 10:34:09
 * @LastEditors: vspirit803
-->
<template>
  <div class="content-container d-flex blue lighten-4 text-center">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.content-container {
  position: relative;

  > *:only-child {
    width: 100%;
    height: 100%;
  }
}

/**宽高比小于16/9, 按宽度决定 */
@media screen and (max-aspect-ratio: 16/9) {
  .content-container {
    margin: auto;
    height: calc((100vw) / 16 * 9);
    width: calc(100vw);
  }
}
/**宽高比大于16/9, 按高度决定 */
@media screen and (min-aspect-ratio: 16/9) {
  .content-container {
    margin: auto;
    height: calc(100vh);
    width: calc((100vh) / 9 * 16);
  }
}
</style>
