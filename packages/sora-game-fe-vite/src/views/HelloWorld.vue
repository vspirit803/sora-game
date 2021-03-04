<template>
  <div class="flex-row">
    <div id="banners" style="position: absolute; z-index: 500;">
      <AutoBanners />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, Ref } from "vue";
import Test from '@/components/Test.vue'
import AutoBanners from '@/components/AutoBanners.vue'

export default defineComponent({
  name: "HelloWorld",
  components: { Test, AutoBanners },
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup() {
    const count: Ref<number> = ref(0);
    const str = ref("");
    return { count, str };
  },
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
