/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:24
 * @Description: 装备类型
 * @LastEditTime: 2021-04-14 14:31:15
 * @LastEditors: vspirit803
 */
const System = 'System'; //系统物品,如金币,经验值等
const Equipment = 'Equipment'; //装备
const Consumable = 'Consumable'; //消耗品
const Task = 'Task'; //任务物品
const Material = 'Material'; //材料

const ItemTypes = [System, Equipment, Consumable, Task, Material];
type ItemType = typeof System | typeof Equipment | typeof Consumable | typeof Task | typeof Material;

export { Consumable, Equipment, ItemType, ItemTypes, Material, System, Task };
