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
</style>

<style scoped>
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
    height: calc(100vh - 84px);
    width: calc((100vh - 84px) / 9 * 16);
  }
}
</style>
