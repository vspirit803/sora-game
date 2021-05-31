/*
 * @Author: vspirit803
 * @Date: 2020-09-27 11:25:31
 * @Description: 技能类别
 * @LastEditTime: 2021-05-31 14:35:29
 * @LastEditors: vspirit803
 */

/**
 * 技能类别
 */
export type SkillType =
  /**普通攻击技能 */
  | 'attack'
  /**攻击性技能 */
  | 'skill_attack'
  /**被动技能 */
  | 'passive'
  /**治疗技能 */
  | 'skill_treat';
