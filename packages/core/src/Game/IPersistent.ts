/**
 * 可持久化的对象必须实现该接口
 */
export interface IPersistent<T> {
  /**
   * 载入存档
   * @param saveData 存档数据
   */
  loadSave(saveData: T): void;

  /**
   * 生成存档
   * @returns 存档数据
   */
  generateSave(): T;
}
