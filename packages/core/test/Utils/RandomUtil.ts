/*
 * @Author: vspirit803
 * @Date: 2021-04-12 17:45:26
 * @Description:
 * @LastEditTime: 2021-06-01 15:32:34
 * @LastEditors: vspirit803
 */

import { RandomUtil } from '@core/Utils';

const randomDecider = RandomUtil.getRandomDecider();

const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

for (let i = 0; i < 1000000; i++) {
  count[randomDecider.randomGenerator.selectOneRandomly([0, 1, 2, 3])]++;
}
console.log(count);
