/*
 * @Author: vspirit803
 * @Date: 2021-05-20 15:11:14
 * @Description:
 * @LastEditTime: 2021-05-31 15:01:36
 * @LastEditors: vspirit803
 */
export function useLabel(el: HTMLElement): (number: number, color: string, isCrit?: boolean) => void {
  let lastTime = 0;

  function addLabel(damage: number, color: string, isCrit = false) {
    const newSpan = document.createElement('span');
    newSpan.innerText = damage.toString();
    newSpan.setAttribute('class', 'damage-span');
    newSpan.style.color = color;
    newSpan.style.fontWeight = isCrit ? 'bold' : 'normal';
    newSpan.style.fontSize = isCrit ? '2.5rem' : '1.5rem';

    const keyframes = [
      { bottom: '20px', opacity: 1 },
      { bottom: '80%', opacity: 0.5 },
    ];
    const options = {
      duration: 800,
      easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
    };

    function addElement() {
      el.appendChild(newSpan);
      newSpan.animate(keyframes, options).onfinish = () => {
        newSpan.remove();
      };
    }

    const now = Date.now();
    if (now - lastTime > 80) {
      lastTime = now;
      addElement();
    } else {
      lastTime = lastTime + 80;
      setTimeout(addElement, lastTime - now);
    }
  }

  return addLabel;
}
