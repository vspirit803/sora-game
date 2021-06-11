/*
 * @Author: vspirit803
 * @Date: 2021-02-22 15:24:27
 * @Description:
 * @LastEditTime: 2021-06-11 17:27:00
 * @LastEditors: vspirit803
 */
import { CharacterBattle } from '@core/Character';
import { CharacterPropertyType } from '@core/Character/CharacterPropertyType';
import { EventData, EventListener } from '@core/Event';
import { ObjectId } from 'bson';

import { AbstractBuffItem } from './AbstractBuffItem';

/**能否驱散 */
type Dispellable =
  | 'NEVER' //无法驱散
  | 'DEATH_DISPEL' //死亡驱散
  | 'STRONG_DISPEL' //强驱散
  | 'BASIC_DISPEL'; //基础驱散

/**叠加方式 */
type OverlayType =
  | 'NONE' //不可叠加
  | 'REFRESH' //刷新叠加
  | 'INDENPENDENT'; //独立叠加

type OnStartFunction = (buff: Buff, character: CharacterBattle) => boolean | void;
type BuffProperty = { name: CharacterPropertyType; percent: number; value: number };

/**
 * 状态
 */
export class Buff {
  static readonly FOREVER = 'forever';

  /**buff 配置ID*/
  id: string;
  uuid: string;
  /**buff名称 */
  name: string;
  /**状态的来源角色 */
  source: CharacterBattle;
  /**状态的目标角色 */
  target: CharacterBattle;
  /**持续时间 */
  duration: number | typeof Buff.FOREVER;
  /**可驱散性 */
  dispellable: Dispellable;
  /**子Buff数组 */
  buffItems: Array<AbstractBuffItem>;
  /**是否可见 */
  visible: boolean;

  onBuffStart?: OnStartFunction;

  roundCounter: EventListener<EventData>;

  overlayTimes: number; // 叠加层数
  maxOverlayTimes: number; // 最大叠加层数
  overlayType: OverlayType; // 叠加类型
  properties: Array<BuffProperty>;

  constructor({
    id,
    name,
    source,
    target,
    duration = Buff.FOREVER,
    dispellable = 'DEATH_DISPEL',
    buffs = [],
    visible = true,
    onBuffStart,
    properties,
    maxOverlayTimes,
    overlayType,
  }: {
    id: string;
    name: string;
    source: CharacterBattle;
    target: CharacterBattle;
    duration?: number | typeof Buff.FOREVER;
    dispellable?: Dispellable;
    buffs?: Array<AbstractBuffItem>;
    visible?: boolean;
    onBuffStart?: OnStartFunction;
    properties: Array<BuffProperty>;
    maxOverlayTimes: number;
    overlayType: OverlayType;
  }) {
    this.id = id;
    this.uuid = new ObjectId().toHexString();
    this.name = name;
    this.source = source;
    this.target = target;
    this.duration = duration;
    this.dispellable = dispellable;
    this.buffItems = buffs;
    this.visible = visible;
    this.onBuffStart = onBuffStart;
    this.properties = properties;
    this.overlayTimes = 1;
    this.maxOverlayTimes = maxOverlayTimes;
    this.overlayType = overlayType;

    this.roundCounter = target.battle.eventCenter.listen({
      eventType: 'ActionEnd',
      callback: async () => this.afterRound(),
      filter: target,
      priority: 1,
    });
  }

  addBuffs(...buffs: Array<AbstractBuffItem>): void {
    this.buffItems.push(...buffs);
  }

  start(): void {
    const existedBuff = this.target.buffs.find((each) => each.id === this.id);

    if (existedBuff) {
      if (this.overlayType === 'NONE') {
        return;
      }

      if (this.overlayType === 'REFRESH') {
        existedBuff.addOverlayTimes();
        existedBuff.duration = this.duration;
        return;
      }
    }

    this.target.buffs.push(this);
    this.buffItems.forEach((each) => each.start());
    this.addPropertyEffects();
  }

  addOverlayTimes(): void {
    if (this.overlayTimes >= this.maxOverlayTimes) {
      return;
    }

    this.removePropertyEffects();
    this.overlayTimes++;
    this.addPropertyEffects();
  }

  addPropertyEffects(): void {
    this.properties.forEach(({ name, percent, value }) => {
      this.target.properties[name].extraPercent += percent * this.overlayTimes;
      this.target.properties[name].extraValue += value * this.overlayTimes;
    });
  }

  removePropertyEffects(): void {
    this.properties.forEach(({ name, percent, value }) => {
      this.target.properties[name].extraPercent -= percent * this.overlayTimes;
      this.target.properties[name].extraValue -= value * this.overlayTimes;
    });
  }

  destroy(): void {
    this.buffItems.forEach((eachBuff) => eachBuff.destroy());
    this.target.battle.eventCenter.cancelListen(this.roundCounter);
    this.target.buffs = this.target.buffs.filter((each) => each !== this);
  }

  afterRound(): void {
    if (this.duration !== Buff.FOREVER) {
      this.duration--;
      if (this.duration === 0) {
        // todo
        // buff到期
        this.destroy();
      }
    }
  }
}
