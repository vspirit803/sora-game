<template>
  <div>这是一个测试组件</div>
  <button @click="count++">count:{{ count }}</button>
  <div>======结束=====</div>
  <input type="color" v-model="color" />
</template>

<script lang="ts" setup>
ref: count = 0;
ref: color = '#FF0000'

</script>

<style>
</style>