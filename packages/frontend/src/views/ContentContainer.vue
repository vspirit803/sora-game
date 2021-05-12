<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-05-12 17:04:45
 * @LastEditors: vspirit803
-->
<template>
  <div class="content-container bg-light-blue-3 row">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.content-container {
  margin: auto;
  aspect-ratio: 16 / 9;
  max-height: 100vh;
  max-width: 100vw;
  position: relative;

  > *:only-child {
    width: 100%;
    height: 100%;
  }
}
</style>
