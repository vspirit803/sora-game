<template>
  <transition-group name="list">
    <v-banner
      v-for="each of banners"
      :key="each.key"
      transition-show="slide-down"
      transition-hide="slide-up"
      inline-actions
      class="bg-primary text-white mb-2 list-item"
      style="width: 600px"
    >
      {{ each.content }}
      <template #actions>
        <v-btn @click="onClose(each)">关闭</v-btn>
      </template>
    </v-banner>
  </transition-group>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

interface Banner {
  key: string;
  content: string;
}

const banners = ref<Array<Banner>>([
  { key: '00001', content: 'Unfortunately, the credit card did not go through, please try again.' },
]);

function addBanner() {
  const key = Date.now().toString();
  const newBanner = { key, content: new Date().toISOString() };
  const delay = Math.random() * 4000 + 1000;
  banners.value.push(newBanner);

  setTimeout(() => {
    onClose(newBanner);
  }, delay);
}

function onClose(banner: Banner) {
  banners.value = banners.value.filter((each) => each.key !== banner.key);
}

onMounted(() => {
  setInterval(addBanner, 2500);
});
</script>

<style scoped>
.list-item {
  display: block;
  margin-right: 10px;
  position: relative;
  transition: all 0.8s ease;
}
.list-enter-active,
.list-leave-active {
  position: absolute;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
.list-move {
  transition: transform 0.8s ease;
}
</style>
