/*
 * @Author: vspirit803
 * @Date: 2020-09-24 09:39:44
 * @Description: 稀有度
 * @LastEditTime: 2021-04-14 14:31:51
 * @LastEditors: vspirit803
 */
const Common = 'Common'; //普通
const Rare = 'Rare'; //稀有
const Mythical = 'Mythical'; //神话
const Legendary = 'Legendary'; //传说
const Ancient = 'Ancient'; //远古
const Immortal = 'Immortal'; //不朽

const Rarities = [Common, Rare, Mythical, Legendary, Ancient, Immortal];
type Rarity = typeof Common | typeof Rare | typeof Mythical | typeof Legendary | typeof Ancient | typeof Immortal;

export { Ancient, Common, Immortal, Legendary, Mythical, Rare, Rarities, Rarity };
