/*
 * @Author: vspirit803
 * @Date: 2021-02-22 15:24:27
 * @Description:
 * @LastEditTime: 2021-06-18 14:16:56
 * @LastEditors: vspirit803
 */
import { CharacterBattle, CharacterPropertyType } from '@core/Character';
import { EventData, EventListener, EventTypes } from '@core/Event';
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
  | 'REPLACE' //覆盖作用
  | 'REFRESH' //叠加并刷新持续时间
  | 'INDENPENDENT'; //独立作用

interface BuffProperty {
  name: CharacterPropertyType;
  percent: number;
  value: number;
}

type BuffListener = {
  eventType: EventTypes; // 事件类型
  callback: ((data: EventData) => Promise<void>) & ThisType<Buff>; //事件的回调函数
  priority: number; // 优先级
};

/**
 * 状态
 */
export class Buff {
  id: string; // buff配置ID
  uuid: string;
  name: string; // buff名称
  source: CharacterBattle; // 状态的来源角色
  target: CharacterBattle; // 状态的目标角色
  duration: number; // 持续时间
  dispellable: Dispellable; // 可驱散性
  buffItems: Array<AbstractBuffItem>; // 子Buff数组
  visible: boolean; // 是否可见

  roundCounter?: EventListener<EventData>; // 回合计时器
  overlayTimes: number; // 叠加层数
  maxOverlayTimes: number; // 最大叠加层数
  overlayType: OverlayType; // 叠加类型
  properties: Array<BuffProperty>; // 属性加成
  listeners: Array<BuffListener>; // 监听配置
  data: Record<string, any>; //buff的自定义数据

  private eventListeners: Array<EventListener>; // 生成的监听器

  constructor({
    id,
    name,
    source,
    target,
    duration = Infinity,
    dispellable = 'DEATH_DISPEL',
    buffs = [],
    visible = true,
    properties = [],
    listeners = [],
    maxOverlayTimes = 1,
    overlayType = 'REFRESH',
    data = {},
  }: {
    id: string;
    name: string;
    source: CharacterBattle;
    target: CharacterBattle;
    duration?: number;
    dispellable?: Dispellable;
    buffs?: Array<AbstractBuffItem>;
    visible?: boolean;
    properties?: Array<BuffProperty>;
    listeners?: Array<BuffListener>;
    maxOverlayTimes?: number;
    overlayType?: OverlayType;
    data?: Record<string, unknown>;
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
    this.properties = properties;
    this.listeners = listeners;
    this.overlayTimes = 1;
    this.maxOverlayTimes = maxOverlayTimes;
    this.overlayType = overlayType;
    this.data = data;
    this.eventListeners = [];

    if (duration !== Infinity) {
      this.roundCounter = target.battle.eventCenter.listen({
        eventType: 'ActionEnd',
        callback: async () => this.afterRound(),
        filter: target,
        priority: 1,
      });
    }
  }

  addBuffs(...buffs: Array<AbstractBuffItem>): void {
    this.buffItems.push(...buffs);
  }

  async start(): Promise<void> {
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

      if (this.overlayType === 'REPLACE') {
        existedBuff.destroy();
      }
    }

    this.target.buffs.push(this);
    this.buffItems.forEach((each) => each.start());
    this.addPropertyEffects();
    this.addListeners();
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

  addListeners(): void {
    this.listeners.forEach(({ callback, eventType, priority }) => {
      this.eventListeners.push(
        this.source.battle.eventCenter.listen({
          callback: callback.bind(this),
          priority,
          eventType,
          filter: this.source,
        }),
      );
    });
  }

  removeListeners(): void {
    this.eventListeners.forEach((each) => this.source.battle.eventCenter.cancelListen(each));
    this.eventListeners = [];
  }

  async destroy(): Promise<void> {
    this.buffItems.forEach((eachBuff) => eachBuff.destroy());
    this.roundCounter && this.target.battle.eventCenter.cancelListen(this.roundCounter);
    this.target.buffs = this.target.buffs.filter((each) => each !== this);

    this.removePropertyEffects();
    this.removeListeners();
  }

  async afterRound(): Promise<void> {
    this.duration--;
    if (this.duration === 0) {
      // todo
      // buff到期
      await this.destroy();
    }
  }
}
