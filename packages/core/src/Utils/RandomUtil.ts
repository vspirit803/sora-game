/*
 * @Author: vspirit803
 * @Date: 2021-03-29 16:11:25
 * @Description:
 * @LastEditTime: 2021-04-13 13:10:35
 * @LastEditors: vspirit803
 */

import { UUID } from '@core/Common';
import { alea } from 'seedrandom';

import PRD_TABLE from './prdTable';

type Prng = ReturnType<typeof alea>;

export class RandomUtil {
  static getRandomGenerator(seed?: string): RandomGenerator {
    return new RandomGenerator(seed ?? Date.now().toString());
  }

  static getRandomDecider(randomGenerator: RandomGenerator): RandomDecider;
  static getRandomDecider(seed?: string): RandomDecider;
  static getRandomDecider(seed?: string | RandomGenerator): RandomDecider {
    if (seed instanceof RandomGenerator) {
      return new RandomDecider(seed);
    }

    return new RandomDecider(seed ?? Date.now().toString());
  }
}

export class RandomGenerator {
  seed: string;
  seedRandom: Prng;
  count: number;

  constructor(seed: string) {
    this.seed = seed;
    this.seedRandom = alea(seed);
    this.count = 0;
  }

  private range(min: number, max: number) {
    this.count++;
    return min + (max - min) * this.seedRandom.quick();
  }

  get(): number;
  get(max: number): number;
  get(min: number, max: number): number;
  get(min?: number, max?: number): number {
    if (min === undefined) {
      [min, max] = [0, 1];
    } else if (max === undefined) {
      [min, max] = [0, min];
    }

    return this.range(min, max);
  }

  getInt(min: number, max?: number): number {
    if (max === undefined) {
      [min, max] = [0, min];
    }

    min = Math.ceil(min);
    max = Math.floor(max);

    return min + (Math.round(this.get(Number.MAX_SAFE_INTEGER)) % (max - min + 1));
  }

  selectOneRandomly<T>(list: Array<T>): T {
    return list[this.getInt(list.length - 1)];
  }
}

export class RandomDecider {
  seed: string;
  randomGenerator: RandomGenerator;
  prdMap: WeakMap<UUID, PRD>;

  constructor(seed: string);
  constructor(randomGenerator: RandomGenerator);
  constructor(p: string | RandomGenerator) {
    if (typeof p === 'string') {
      const seed = p;
      this.seed = seed;
      this.randomGenerator = new RandomGenerator(seed);
    } else {
      const randomGenerator = p;
      this.randomGenerator = randomGenerator;
      this.seed = randomGenerator.seed;
    }

    this.prdMap = new WeakMap();
  }

  normalDecider(probability: number): boolean {
    return this.randomGenerator.get(1) < probability;
  }

  prdDecider(uuid: UUID, probability: number): boolean {
    if (!this.prdMap.has(uuid)) {
      //todo 新建一个prd发生器
      this.prdMap.set(uuid, new PRD(probability, this.randomGenerator));
    }

    const prd = this.prdMap.get(uuid)!;
    return prd.decide();
  }
}

class PRD {
  probability: number;
  baseProbability: number;
  currProbability: number;
  randomGenerator: RandomGenerator;

  constructor(probability: number, randomGenerator: RandomGenerator) {
    this.probability = probability;
    this.baseProbability = findBaseProbability(probability);
    this.currProbability = this.baseProbability;
    this.randomGenerator = randomGenerator;
  }

  decide(): boolean {
    const result = this.randomGenerator.get(1) < this.currProbability;

    if (result) {
      this.currProbability = this.baseProbability;
    } else {
      this.currProbability += this.baseProbability;
    }

    return result;
  }
}

function findBaseProbability(p: number, left = 0, right = PRD_TABLE.length): number {
  if (left >= right) {
    return left / 10000;
  }

  const middle = Math.floor((left + right) / 2);
  if (Math.abs(PRD_TABLE[middle] - p) < 1e-5) {
    return middle / 10000;
  }

  return p < PRD_TABLE[middle] ? findBaseProbability(p, left, middle - 1) : findBaseProbability(p, middle + 1, right);
}
