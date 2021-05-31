/*
 * @Author: vspirit803
 * @Date: 2021-05-20 16:12:45
 * @Description:
 * @LastEditTime: 2021-05-31 12:17:44
 * @LastEditors: vspirit803
 */

import { UUID } from '@core/Common';

import { EventCenter, EventListener } from './EventCenter';
import { EventData } from './EventData';
import { EventTypes } from './EventTypes';

/**
 * EventListenerBuilder
 */
export class EventListenerBuilder {
  eventType?: EventTypes;
  priority?: number;
  filter?: UUID | Array<UUID>;
  callback?: (eventData: EventData) => Promise<void>;
  once?: boolean;
  eventCenter?: EventCenter;

  constructor() {
    this.priority = 5;
    this.once = false;
    this.filter = undefined;
  }

  setEventType(eventType: EventTypes): EventListenerBuilder {
    this.eventType = eventType;
    return this;
  }

  setPriority(priority: number): EventListenerBuilder {
    this.priority = priority;
    return this;
  }

  setFilter(filter: UUID | Array<UUID>): EventListenerBuilder {
    this.filter = filter;
    return this;
  }

  setCallback(callback: (eventData: EventData) => Promise<void>): EventListenerBuilder {
    this.callback = callback;
    return this;
  }

  setOnce(once: boolean): EventListenerBuilder {
    this.once = once;
    return this;
  }

  setEventCenter(eventCenter: EventCenter): EventListenerBuilder {
    this.eventCenter = eventCenter;
    return this;
  }

  apply(): EventListener {
    if (this.eventType === undefined) {
      throw new Error('eventType can not be undefined');
    }

    if (this.callback === undefined) {
      throw new Error('callback can not be undefined');
    }

    const eventCenter = this.eventCenter ?? EventCenter.getInstance();

    return eventCenter.listen({
      eventType: this.eventType,
      priority: this.priority,
      filter: this.filter,
      callback: this.callback,
      once: this.once,
    });
  }
}
