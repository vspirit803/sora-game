/*
 * @Author: vspirit803
 * @Date: 2021-06-11 10:54:04
 * @Description:
 * @LastEditTime: 2021-06-11 11:00:05
 * @LastEditors: vspirit803
 */
import { reactive, ToRefs, toRefs } from 'vue';

const settings = reactive({ showImage: false });

export function useSettings(): ToRefs<typeof settings> {
  return toRefs(settings);
}
