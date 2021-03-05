<template>
  <div class="flex-row">
    <div id="banners" style="position: absolute; z-index: 500;">
      <AutoBanners />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Test from '@/components/Test.vue'
import AutoBanners from '@/components/AutoBanners.vue'

export default defineComponent({
  name: "HelloWorld",
  components: { Test, AutoBanners },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
