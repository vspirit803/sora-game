<!--
 * @Author: vspirit803
 * @Date: 2021-05-31 15:38:49
 * @Description:
 * @LastEditTime: 2021-05-31 16:37:22
 * @LastEditors: vspirit803
-->

<template>
  <div class="cog-container" :style="{ fontSize: `${size}px`, width: '1em', height: '1em' }" @click.stop="onSwitch">
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
    size: { type: Number, required: false, default: 64 },
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

  .status-text {
    font-size: 0.2em;
  }

  .cog-small {
    font-size: 0.5em;

    &.animation-enabled {
      animation: cog-rotate-small 2s linear infinite;
    }
  }

  .cog-big {
    font-size: 0.75em;

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
