/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:44
 * @Description: 稀有度
 * @LastEditTime: 2021-06-23 16:19:31
 * @LastEditors: vspirit803
 */
const Normal = 'Normal'; //普通
const Rare = 'Rare'; //稀有
const Mythical = 'Mythical'; //神话
const Legendary = 'Legendary'; //传说
const Ancient = 'Ancient'; //远古
const Immortal = 'Immortal'; //不朽

const Rarities = [Normal, Rare, Mythical, Legendary, Ancient, Immortal];
type Rarity = typeof Normal | typeof Rare | typeof Mythical | typeof Legendary | typeof Ancient | typeof Immortal;

export { Ancient, Immortal, Legendary, Mythical, Normal, Rare, Rarities, Rarity };
