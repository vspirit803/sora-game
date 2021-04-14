/*
 * @Author: vspirit803
 * @Date: 2020-09-25 14:06:27
 * @Description: 监听事件的装饰器
 * @LastEditTime: 2021-04-14 15:02:08
 * @LastEditors: vspirit803
 */
import 'reflect-metadata';

import { Battle } from '@core/Battle';
import { UUID } from '@core/Common';

import { EventListener } from './EventCenter';
import { EventData } from './EventData';
import { EventTypes } from './EventTypes';

interface ListenOptions<T> {
  /**
   * 事件类型
   */
  eventType: T;
  /**
   * 默认取当前对象(若实现了UUID接口)
   * this绑定至当前对象
   * 需用(this as XXX) 强转this类型
   * */
  filterFunction?: () => UUID | Array<UUID> | undefined;
  /**
   * 优先级
   */
  priority?: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type MyMethodDecorator<T> = (
  target: Record<string, any>,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => void | TypedPropertyDescriptor<T>;

export function Listen<T extends EventData>({
  eventType,
  priority,
  filterFunction,
}: ListenOptions<T['eventType']> & ThisType<any>): MyMethodDecorator<(eventData: T) => Promise<void>> {
  return (target, key, descriptor: TypedPropertyDescriptor<(eventData: T) => Promise<void>>) => {
    if (typeof descriptor.value !== 'function') {
      throw Error('Listen装饰器只能用于方法');
    }

    const existed = Reflect.getMetadata(eventType, target) ?? [];
    Reflect.defineMetadata(eventType, [...existed, { callback: descriptor.value, priority, filterFunction }], target);
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Listener<T extends { new (...args: any[]): { battle: Battle } }>() {
  function classDecorator(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        const eventNames: Array<EventTypes> = Reflect.getMetadataKeys(this);
        const listenerList: Array<EventListener> = [];

        for (const eachEvent of eventNames) {
          const listeners: Array<{
            callback: (eventData: EventData) => Promise<void>;
            priority?: number;
            filterFunction?: () => UUID | Array<UUID>;
          }> = Reflect.getMetadata(eachEvent, this);

          for (const eachListener of listeners) {
            const { priority, filterFunction, callback } = eachListener;
            let filter: UUID | Array<UUID> | undefined;

            if (filterFunction) {
              filter = filterFunction.call(this);
            } else if (Reflect.ownKeys(this).includes('uuid')) {
              filter = (this as unknown) as UUID;
            }

            const listener = this.battle.eventCenter.listen({
              eventType: eachEvent,
              priority,
              filter,
              callback: callback.bind(this),
            });
            listenerList.push(listener);
          }
        }

        Reflect.defineMetadata('listenerList', listenerList, this);
      }
    };
  }

  return classDecorator;
}

export function RemoveAllListeners(
  target: unknown,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
): TypedPropertyDescriptor<(...args: any[]) => any> {
  const method = descriptor.value!;
  descriptor.value = function (...args: any[]) {
    const result = method.apply(this, args);
    // 注销监听器
    const listenerList: Array<EventListener> = Reflect.getMetadata('listenerList', this);
    listenerList.forEach((eachListener) => {
      (this as { battle: Battle }).battle.eventCenter.cancelListen(eachListener);
    });

    return result;
  };

  return descriptor;
}
