<!--
 * @Author: vspirit803
 * @Date: 2021-05-31 15:38:49
 * @Description:
 * @LastEditTime: 2021-05-31 16:46:41
 * @LastEditors: vspirit803
-->

<template>
  <div class="cog-container" @click.stop="onSwitch">
    <span class="status-text absolute-top-right">{{ enabled ? '自动' : '手动' }}</span>
    <q-icon name="mdi-cog" class="cog-small absolute-top-left" :class="{ 'animation-enabled': enabled }"></q-icon>
    <q-icon name="mdi-cog" class="cog-big absolute-bottom-right" :class="{ 'animation-enabled': enabled }"></q-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BattleAutoModeSwitch',
  props: {
    enabled: { type: Boolean, required: false, default: false },
  },
  emits: ['update:enabled'],
  setup(props, { emit }) {
    function onSwitch() {
      emit('update:enabled', !props.enabled);
    }

    return { onSwitch };
  },
});
</script>

<style lang="scss">
.cog-container {
  overflow: hidden;
  width: 8rem;
  height: 8rem;

  .status-text {
    font-size: 1.5rem;
  }

  .cog-small {
    font-size: 4rem;

    &.animation-enabled {
      animation: cog-rotate-small 2s linear infinite;
    }
  }

  .cog-big {
    font-size: 6rem;

    &.animation-enabled {
      animation: cog-rotate-big 2s linear infinite;
    }
  }
}

@keyframes cog-rotate-big {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes cog-rotate-small {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(-360deg);
  }
}
</style>
