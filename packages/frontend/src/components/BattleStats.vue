<!--
 * @Author: vspirit803
 * @Date: 2021-03-26 17:05:53
 * @Description:
 * @LastEditTime: 2021-06-24 10:24:17
 * @LastEditors: vspirit803
-->
<template>
  <q-fab icon="mdi-chevron-down" vertical-actions-align="right" direction="down">
    <div class="battle-stats">
      <v-chart :option="option" />
    </div>
  </q-fab>
</template>

<script lang="ts">
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { debounce } from 'quasar';
import { Battle, CharacterBattle, EventDataDamaging, EventListenerBuilder } from 'sora-game-core';
import { defineComponent, PropType, ref } from 'vue';
import ECharts from 'vue-echarts';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, PieChart, TitleComponent, LegendComponent]);

interface StatsItem {
  actualDamage: number;
  finalDamage: number;
  actualTreat: number;
  finalTreat: number;
}
export default defineComponent({
  name: 'BattleStats',
  components: { 'v-chart': ECharts },
  props: {
    battle: {
      required: true,
      type: Object as PropType<Battle>,
    },
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { battle } = props;
    const statsMap = ref(new Map<string, StatsItem>());

    const members: Array<CharacterBattle> = battle.factions[0].teams[0].members;

    new EventListenerBuilder()
      .setEventCenter(battle.eventCenter)
      .setEventType('Damaged')
      .setPriority(0)
      .setCallback(async (eventData: EventDataDamaging) => {
        const { source, finalDamage } = eventData;
        if (!members.includes(source)) {
          return;
        }

        if (!statsMap.value.get(source.name)) {
          statsMap.value.set(source.name, { actualDamage: 0, finalDamage: 0, actualTreat: 0, finalTreat: 0 });
        }

        statsMap.value.get(source.name)!.finalDamage += finalDamage!;

        updateOption();
      })
      .apply();

    new EventListenerBuilder()
      .setEventCenter(battle.eventCenter)
      .setEventType('Treated')
      .setPriority(0)
      .setCallback(async (eventData: EventDataDamaging) => {
        const { source, finalDamage } = eventData;
        if (!members.includes(source)) {
          return;
        }

        if (!statsMap.value.get(source.name)) {
          statsMap.value.set(source.name, { actualDamage: 0, finalDamage: 0, actualTreat: 0, finalTreat: 0 });
        }

        statsMap.value.get(source.name)!.finalTreat += finalDamage!;

        updateOption();
      })
      .apply();

    const updateOption = debounce(() => {
      console.log('updateOption');

      option.value.series = [
        {
          name: '伤害',
          type: 'bar',
          data: Array.from(statsMap.value.entries()).map(([name, stats]) => ({ name, value: stats.finalDamage })),
        },
        {
          name: '治疗',
          type: 'bar',
          data: Array.from(statsMap.value.entries()).map(([name, stats]) => ({ name, value: stats.finalTreat })),
        },
      ];
    }, 500);

    const option = ref({
      legend: {
        left: 'left',
        data: ['伤害', '治疗'],
      },
      grid: { left: '15%' },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: members.map((each) => each.name),
      },
      series: [
        {
          name: '伤害',
          type: 'bar',
          data: members.map((each) => ({ name: each.name, value: 0 })),
        },
        {
          name: '治疗',
          type: 'bar',
          data: members.map((each) => ({ name: each.name, value: 0 })),
        },
      ],
    });

    return { option };
  },
});
</script>

<style>
.battle-stats {
  width: 400px;
  height: 300px;
  z-index: 999;
}
</style>
