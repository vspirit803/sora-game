<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description: 
 * @LastEditTime: 2021-03-11 17:35:50
 * @LastEditors: vspirit803
-->
<template>
  <div>
    <v-btn @click="nextRound">nextRound</v-btn>{{ t.toFixed(3) }}s
    <div class="container" :style="{ width: `${totalLength * lengthRatio + 64}px` }">
      <div
        v-for="(each, index) of persons"
        :ref="(ref) => (imgs[index] = ref)"
        :key="each.name"
        class="person"
        :style="{ left: each.position * lengthRatio + 'px', zIndex: Math.floor(each.position * 1000) }"
      >
        {{ each.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue';

interface Person {
  name: string;
  speed: number;
  position: number;
}

export default defineComponent({
  name: 'Test',
  setup() {
    const totalLength = ref(300);
    const t = ref(0);
    const lengthRatio = ref(4);
    const persons = ref<Array<Person>>([
      { name: '晴明', speed: 128, position: 0 },
      { name: '山兔', speed: 273, position: 0 },
      { name: '烬天玉藻前', speed: 125, position: 0 },
      { name: '鬼使黑', speed: 105, position: 0 },
      { name: '惠比寿', speed: 90, position: 0 },
    ]);
    const imgs = ref<Array<unknown>>([]);

    function getRects(doms: Array<HTMLElement>) {
      return doms.map((dom) => {
        const rect = dom.getBoundingClientRect();
        const { left, top } = rect;
        return { left, top };
      });
    }

    function nextRound() {
      const temp = [...persons.value];
      temp.forEach((each) => {
        if (each.position >= totalLength.value) {
          each.position -= totalLength.value;
        }
      });

      setTimeout(() => {
        const prevPositions = getRects(imgs.value as Array<HTMLElement>);

        const deltaT = Math.min(...temp.map((each) => (totalLength.value - each.position) / each.speed));
        temp.forEach((each) => {
          each.position += deltaT * each.speed;
        });
        t.value += deltaT;

        nextTick(() => {
          const currentPositions = getRects(imgs.value as Array<HTMLElement>);

          (imgs.value as Array<HTMLElement>).forEach((imgRef, index) => {
            const currentPosition = currentPositions[index];
            const prevPosition = prevPositions[index];

            // 倒置后的位置，虽然图片移动到最新位置了，但你先给我回去，等着我来让你做动画。
            const invert = {
              left: prevPosition.left - currentPosition.left,
              top: prevPosition.top - currentPosition.top,
            };

            const keyframes = [
              // 初始位置是倒置后的位置
              {
                transform: `translate(${invert.left}px, ${invert.top}px)`,
              },
              // 图片更新后本来应该在的位置
              { transform: 'translate(0)' },
            ];

            const options = {
              duration: Math.max(100, Math.round(deltaT * 300)),
              easing: 'cubic-bezier(0,0,0.32,1)',
            };

            // 开始运动！
            imgRef.animate(keyframes, options);
          });

          setTimeout(() => {
            nextRound();
          }, Math.max(100, Math.round(deltaT * 300)) + 500);
        });
      });
    }

    return { persons, nextRound, t, totalLength, imgs, lengthRatio };
  },
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 360px;
  background-color: aquamarine;

  .person {
    position: absolute;
    border: 1px red solid;

    background-color: aqua;

    width: 64px;
    height: 64px;
  }
}
</style>
