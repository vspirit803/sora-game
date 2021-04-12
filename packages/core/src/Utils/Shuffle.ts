/*
 * @Author: vspirit803
 * @Date: 2021-03-30 09:30:26
 * @Description:
 * @LastEditTime: 2021-03-30 09:35:24
 * @LastEditors: vspirit803
 */

import { RandomGenerator, RandomUtil } from './RandomUtil';

export function shuffle<T>(
  arr: Array<T>,
  randomGenerator: RandomGenerator = RandomUtil.getRandomGenerator(),
): Array<T> {
  const arr2 = [...arr];

  for (let i = arr2.length; i >= 0; i--) {
    const j = randomGenerator.getInt(i);
    [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
  }

  return arr2;
}
