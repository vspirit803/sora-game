/*
 * @Author: vspirit803
 * @Date: 2021-04-12 17:45:26
 * @Description:
 * @LastEditTime: 2021-04-12 17:48:32
 * @LastEditors: vspirit803
 */

import { RandomUtil } from '@core/Utils';

const a = { uuid: '0001' };
const b = { uuid: '0002' };

const randomDecider = RandomUtil.getRandomDecider();

let countA = 0,
  countB = 0,
  countC = 0;

for (let i = 0; i < 1000000; i++) {
  if (randomDecider.prdDecider(a, 0.3)) {
    countA++;
  }

  if (randomDecider.prdDecider(b, 0.8)) {
    countB++;
  }

  if (randomDecider.normalDecider(0.95)) {
    countC++;
  }
}

console.log(countA, countB, countC);
