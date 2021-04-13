/**
 * 条件项
 */
export class ConditionItem<T> {
  testInstance?: T;
  testFunction: (testInstance: T) => boolean;
  description: string;
  constructor({
    testInstance,
    testFunction,
    description,
  }: {
    testInstance?: T;
    testFunction: (testInstance: T) => boolean;
    description: string;
  }) {
    this.testInstance = testInstance;
    this.testFunction = testFunction;
    this.description = description;
  }

  setTestInstance(testInstance: T): void {
    this.testInstance = testInstance;
  }

  getFormatedDescription(indentation = 0): string {
    return (this.isCompleted ? '√ ' : '').padStart(4 * indentation - 2) + this.description;
  }

  get isCompleted(): boolean {
    if (this.testInstance === undefined) {
      throw new Error('未设定实例就尝试获取条件状态');
    }
    return this.testFunction(this.testInstance);
  }
}
