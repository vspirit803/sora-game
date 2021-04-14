/*
 * @Author: vspirit803
 * @Date: 2021-03-26 16:34:31
 * @Description: 条件
 * @LastEditTime: 2021-04-14 15:05:25
 * @LastEditors: vspirit803
 */
import { ConditionItem } from './ConditionItem';

const And = 'And'; // 逻辑与
const Or = 'Or'; // 逻辑或

type LogicOperator = typeof And | typeof Or;

/**
 * 条件类
 */
class Condition {
  /**各个条件项的关系 */
  logicOperator: LogicOperator;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conditionItems: Array<ConditionItem<any> | Condition>;

  constructor({
    logicOperator = And,
    conditionItems = [],
  }: {
    logicOperator?: LogicOperator;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conditionItems?: Array<ConditionItem<any> | Condition>;
  } = {}) {
    this.logicOperator = logicOperator;
    this.conditionItems = conditionItems;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addConditionItem(...items: Array<ConditionItem<any> | Condition>): void {
    this.conditionItems.push(...items);
  }

  getFormatedDescription(indentation = 0): string {
    const innterStr = `  ${this.logicOperator === And ? '且' : '或'}\n`;
    return this.conditionItems
      .map((eachConditionItem) => eachConditionItem.getFormatedDescription(indentation + 1))
      .join(innterStr);
  }

  //是否完成
  get isCompleted(): boolean {
    if (this.logicOperator === And) {
      //与的关系
      return this.conditionItems.every((eachConditionItem) => eachConditionItem.isCompleted);
    } else {
      //或的关系
      return this.conditionItems.some((eachConditionItem) => eachConditionItem.isCompleted);
    }
  }
}

export { And, Condition, LogicOperator, Or };
