/*
 * @Author: vspirit803
 * @Date: 2020-09-24 16:31:12
 * @Description:
 * @LastEditTime: 2021-05-31 13:40:33
 * @LastEditors: vspirit803
 */
import { UUID } from '@core/Common';

import { EventData } from './EventData';

export class EventListener<T extends EventData = EventData> {
  eventType: T['type'];
  priority: number;
  filters: Array<string>;
  callback: (eventData: T) => Promise<any>;
  timestamp: number;
  once: boolean;

  constructor({
    eventType,
    priority,
    filters,
    callback,
    once = false,
  }: {
    eventType: T['type'];
    priority: number;
    filters: Array<string>;
    callback: (eventData: T) => Promise<any>;
    once?: boolean;
  }) {
    this.eventType = eventType;
    this.priority = priority;
    this.filters = filters;
    this.callback = callback;

    this.timestamp = Date.now();
    this.once = once;
  }
}

export class EventCenter {
  private static instance: EventCenter;
  static getInstance(): EventCenter {
    if (!EventCenter.instance) {
      EventCenter.instance = new EventCenter();
    }
    return EventCenter.instance;
  }

  listeners: Array<EventListener>;

  public constructor() {
    this.listeners = [];
  }

  listen<T extends EventData>({
    eventType,
    priority = 5,
    filter,
    callback,
    once,
  }: {
    eventType: T['type'];
    priority?: number;
    filter?: UUID | Array<UUID>;
    callback: (eventData: T) => Promise<void>;
    once?: boolean;
  }): EventListener<T> {
    let filters: Array<string>;
    if (filter === undefined) {
      filters = [];
    } else if (!Array.isArray(filter)) {
      filters = [filter.uuid];
    } else {
      filters = filter.map((each) => each.uuid);
    }

    const listener = new EventListener({ eventType, priority, filters, callback, once });
    this.listeners.push(listener as unknown as EventListener);
    return listener;
  }

  cancelListen(listener: EventListener): void {
    this.listeners = this.listeners.filter((eachListener) => eachListener !== listener);
  }

  async trigger<T extends EventData>(source: UUID, eventData: T): Promise<void> {
    const eventType = eventData.eventType;
    const reachableListeners = this.listeners
      .filter((eachListener) => eachListener.eventType === eventType)
      //listener不过滤或过滤器包含当前发布者
      .filter((eachListener) => eachListener.filters.length === 0 || eachListener.filters.includes(source.uuid));

    const sortedListeners = reachableListeners.sort((a, b) =>
      a.priority !== b.priority ? b.priority - a.priority : a.timestamp - b.timestamp,
    );

    for (let i = 0; i < sortedListeners.length; i++) {
      const eachListener = sortedListeners[i];
      if (!this.listeners.includes(eachListener)) {
        // canceled
        continue;
      }
      if (eachListener.once) {
        this.cancelListen(eachListener);
      }
      await eachListener.callback(eventData);
    }
  }
}
