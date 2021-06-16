<!--
 * @Author: vspirit803
 * @Date: 2021-03-04 09:50:15
 * @Description:
 * @LastEditTime: 2021-06-16 17:32:01
 * @LastEditors: vspirit803
-->
<template>
  <div id="container" class="container">
    <svg class="g-svg" width="900" height="900" xmlns="http://www.w3.org/2000/svg">
      <path
        v-for="each of metroLine1.edges"
        :id="each.id"
        :key="each.id"
        :d="getEdgePath(each)"
        :stroke="'type' in each && each.type === 'crossover' ? 'orange' : 'grey'"
        fill="transparent"
      />
      <!-- <path :d="getPath(line1.downLine)" stroke="grey" fill="transparent" />
      <path :d="getPath(line1.upLine)" stroke="grey" fill="transparent" />
      <path
        v-for="(each, i) of line1.crossovers"
        :key="i"
        :d="getCrossoverPath(each)"
        stroke="grey"
        fill="transparent"
      /> -->
      <circle
        v-for="each of getStations(line1.upStations)"
        :key="each.x + '-' + each.y"
        :cx="each.x"
        :cy="each.y"
        r="2"
        fill="black"
      />
      <circle
        v-for="each of getStations(line1.downStations)"
        :key="each.x + '-' + each.y"
        :cx="each.x"
        :cy="each.y"
        r="2"
        fill="black"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

type LineType = 'main' | 'cross' | 'crossover';

interface Node {
  x: number;
  y: number;
}

interface Station extends Node {
  name: string;
}

interface Straight {
  id: string;
  start: Node;
  end: Node;
}

interface Curve {
  id: string;
  start: Node;
  c1: Node;
  c2: Node;
  end: Node;
  type: LineType;
}

interface Line {
  upLine: Array<Node>;
  downLine: Array<Node>;
  crossovers: Array<Crossover>;
  upStations: Array<Station>;
  downStations: Array<Station>;
}

interface Crossover {
  start: Node;
  end: Node;
}

interface MetroLine {
  edges: Array<Curve | Straight>;
  nodes: Array<Node>;
  platforms: Array<[Node, Node]>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function setIntervalImmediately(f: Function, interval: number) {
  f();
  return setInterval(f, interval);
}

export default defineComponent({
  name: 'Test2',
  setup() {
    const distanceScale = 15;
    const timeScale = 120;
    const line1: Line = {
      downLine: [
        { x: 5000, y: 500 },
        { x: 5000, y: 700 },
        { x: 5000, y: 2700 },
        { x: 5000, y: 6000 },
        { x: 5000, y: 10000 },
        { x: 5000, y: 11000 },
      ],
      upLine: [
        { x: 5100, y: 500 },
        { x: 5100, y: 700 },
        { x: 5100, y: 2700 },
        { x: 5100, y: 6000 },
        { x: 5100, y: 10000 },
        { x: 5100, y: 11000 },
      ],
      crossovers: [
        { start: { x: 5000, y: 1000 }, end: { x: 5100, y: 1500 } },
        { start: { x: 5100, y: 1000 }, end: { x: 5000, y: 1500 } },
        { start: { x: 5000, y: 3000 }, end: { x: 5100, y: 3500 } },
        { start: { x: 5000, y: 6300 }, end: { x: 5100, y: 6800 } },
        { start: { x: 5000, y: 10300 }, end: { x: 5100, y: 10800 } },
      ],
      upStations: [
        { x: 5000, y: 700, name: '世纪城' },
        { x: 5000, y: 2700, name: '天府三街' },
        { x: 5000, y: 6000, name: '天府五街' },
        { x: 5000, y: 10000, name: '华府大道' },
      ],
      downStations: [
        { x: 5100, y: 700, name: '世纪城' },
        { x: 5100, y: 2700, name: '天府三街' },
        { x: 5100, y: 6000, name: '天府五街' },
        { x: 5100, y: 10000, name: '华府大道' },
      ],
    };

    function getPath(nodes: Array<Node>) {
      let line = '';
      for (let i = 0; i < nodes.length; i++) {
        const { x, y } = nodes[i];
        const pointX = x / distanceScale,
          pointY = y / distanceScale;
        if (i === 0) {
          line += `M ${pointX} ${pointY}`;
        } else {
          line += ` L ${pointX} ${pointY}`;
        }
      }
      return line;
    }

    function getCrossoverPath(crossover: Crossover) {
      const { start, end } = crossover;
      const startX = start.x / distanceScale;
      const startY = start.y / distanceScale;
      const endX = end.x / distanceScale;
      const endY = end.y / distanceScale;

      return `M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${
        (startY + endY) / 2
      }, ${endX} ${endY}`;
    }

    function getStations(nodes: Array<Node>) {
      return nodes.map(({ x, y }) => ({ x: x / distanceScale, y: y / distanceScale }));
    }

    const path1 =
      'M 510 1000 L 510 600 L 510 270 L 510 150 C 510 125, 500 125, 500 100 L 500 70 L 500 270 L 500 600 L 500 1020 L 500 1030 C 500 1055, 510 1055, 510 1080 L 510 1000';
    const path2 =
      'M 500 270 L 500 600 L 500 630 C 500 655, 510 655, 510 680 L 510 600 L 510 350 C 510 325, 500 325, 500 300 L 500 270';

    false &&
      onMounted(() => {
        setIntervalImmediately(() => {
          const newBall = document.createElement('div');
          newBall.className = 'ball ball-0';
          document.getElementById('container')!.appendChild(newBall);

          (newBall.style as any).offsetPath = `path('${path1}')`;
          newBall.style.backgroundColor = 'red';
          newBall.animate(
            [
              { offset: 0, offsetDistance: 0 },
              { offset: 1, offsetDistance: '100%' },
            ],
            { duration: 8000 },
          ).onfinish = () => newBall.remove();
        }, 2000);

        setIntervalImmediately(() => {
          const newBall = document.createElement('div');
          newBall.className = 'ball ball-0';
          document.getElementById('container')!.appendChild(newBall);

          (newBall.style as any).offsetPath = `path('${path2}')`;
          newBall.style.backgroundColor = 'blue';
          newBall.animate(
            [
              { offset: 0, offsetDistance: 0 },
              { offset: 1, offsetDistance: '100%' },
            ],
            { duration: 3000 },
          ).onfinish = () => newBall.remove();
        }, 3000);
      });

    const C = 0.552284749831;
    const metroLine1: MetroLine = {
      edges: [
        { id: '00100001', start: { x: 5000, y: 500 }, end: { x: 5000, y: 700 } },
        { id: '00100002', start: { x: 5000, y: 700 }, end: { x: 5000, y: 1000 } },
        { id: '00100021', start: { x: 5000, y: 1000 }, end: { x: 5000, y: 1500 } },
        { id: '00100022', start: { x: 5000, y: 1500 }, end: { x: 5000, y: 2700 } },
        { id: '00100003', start: { x: 5000, y: 2700 }, end: { x: 5000, y: 6000 } },
        { id: '00100004', start: { x: 5000, y: 6000 }, end: { x: 5000, y: 6300 } },
        { id: '00100019', start: { x: 5000, y: 6300 }, end: { x: 5000, y: 10000 } },
        { id: '00100005', start: { x: 5000, y: 10000 }, end: { x: 5000, y: 10300 } },
        { id: '00100006', start: { x: 5000, y: 10300 }, end: { x: 5000, y: 11000 } },
        { id: '00100007', start: { x: 5100, y: 11000 }, end: { x: 5100, y: 10800 } },
        { id: '00100025', start: { x: 5100, y: 10800 }, end: { x: 5100, y: 10000 } },
        { id: '00100008', start: { x: 5100, y: 10000 }, end: { x: 5100, y: 6800 } },
        { id: '00100020', start: { x: 5100, y: 6800 }, end: { x: 5100, y: 6000 } },
        { id: '00100009', start: { x: 5100, y: 6000 }, end: { x: 5100, y: 3500 } },
        { id: '00100026', start: { x: 5100, y: 3500 }, end: { x: 5100, y: 2700 } },
        { id: '00100023', start: { x: 5100, y: 2700 }, end: { x: 5100, y: 1500 } },
        { id: '00100024', start: { x: 5100, y: 1500 }, end: { x: 5100, y: 1000 } },
        { id: '00100010', start: { x: 5100, y: 1000 }, end: { x: 5100, y: 700 } },
        { id: '00100011', start: { x: 5100, y: 700 }, end: { x: 5100, y: 500 } },
        {
          id: '00100012',
          start: { x: 5000, y: 1500 },
          c1: { x: 5000, y: 1250 },
          c2: { x: 5100, y: 1250 },
          end: { x: 5100, y: 1000 },
          type: 'crossover',
        },
        {
          id: '00100013',
          start: { x: 5100, y: 1500 },
          c1: { x: 5100, y: 1250 },
          c2: { x: 5000, y: 1250 },
          end: { x: 5000, y: 1000 },
          type: 'crossover',
        },
        {
          id: '00100014',
          start: { x: 5000, y: 11000 },
          c1: { x: 5000, y: 11000 + 400 * C },
          c2: { x: 5400 - 400 * C, y: 11400 },
          end: { x: 5400, y: 11400 },
          type: 'main',
        },
        {
          id: '00100015',
          start: { x: 5100, y: 11000 },
          c1: { x: 5100, y: 11000 + 300 * C },
          c2: { x: 5400 - 300 * C, y: 11300 },
          end: { x: 5400, y: 11300 },
          type: 'main',
        },
        {
          id: '00100016',
          start: { x: 5000, y: 3000 },
          c1: { x: 5000, y: 3250 },
          c2: { x: 5100, y: 3250 },
          end: { x: 5100, y: 3500 },
          type: 'crossover',
        },
        {
          id: '00100017',
          start: { x: 5000, y: 6300 },
          c1: { x: 5000, y: 6550 },
          c2: { x: 5100, y: 6550 },
          end: { x: 5100, y: 6800 },
          type: 'crossover',
        },
        {
          id: '00100018',
          start: { x: 5000, y: 10300 },
          c1: { x: 5000, y: 10550 },
          c2: { x: 5100, y: 10550 },
          end: { x: 5100, y: 10800 },
          type: 'crossover',
        },
      ],
      nodes: [
        { x: 5000, y: 700 },
        { x: 5000, y: 2700 },
        { x: 5000, y: 6000 },
        { x: 5000, y: 10000 },
        { x: 5100, y: 700 },
        { x: 5100, y: 2700 },
        { x: 5100, y: 6000 },
        { x: 5100, y: 10000 },
      ],
      platforms: [],
    };

    function getEdgePath(edge: Curve | Straight) {
      if ('c1' in edge) {
        const { start, end, c1, c2 } = edge;
        return `M ${start.x / distanceScale} ${start.y / distanceScale} C ${c1.x / distanceScale} ${
          c1.y / distanceScale
        }, ${c2.x / distanceScale} ${c2.y / distanceScale}, ${end.x / distanceScale} ${end.y / distanceScale}`;
      } else {
        const { start, end } = edge;
        return `M ${start.x / distanceScale} ${start.y / distanceScale} L ${end.x / distanceScale} ${
          end.y / distanceScale
        }`;
      }
    }

    const timeTable = {
      lines: [
        '00100002',
        '00100021',
        '00100022',
        '00100003',
        '00100004',
        '00100019',
        '00100005',
        '00100018',
        '00100025',
        '00100008',
        '00100020',
        '00100009',
        '00100026',
        '00100023',
        '00100013',
        '00100002',
      ],
      // times: [-1, -1, -1, -1, -1],
    };

    function getLine(id: string) {
      return metroLine1.edges.find((each) => each.id === id);
    }

    function getLineAnimation(timeTable: { lines: Array<string> }) {
      const { lines } = timeTable;
      const startNode = getLine(lines[0])!.start;
      let currNode = startNode;
      let path = '';
      let totalTime = 0;
      let totalLength = 0;
      const arr: Array<{ position: number; time: number }> = [{ position: totalLength, time: totalTime }];

      for (let i = 0; i < lines.length; i++) {
        const currLine = getLine(lines[i]);
        if (currLine === undefined) {
          throw new Error(`不存在边 ${lines[i]}`);
        }

        let realCurrLine;
        if (metroLine1.nodes.find((each) => each.x === currNode.x && each.y === currNode.y)) {
          totalTime += 30;
          arr.push({ position: totalLength, time: totalTime });
        }

        if (currNode.x === currLine.start.x && currNode.y === currLine.start.y) {
          realCurrLine = currLine;
        } else {
          let reverseLine: Straight | Curve;
          if ('c1' in currLine) {
            reverseLine = {
              start: currLine.end,
              c1: currLine.c2,
              c2: currLine.c1,
              end: currLine.start,
              id: currLine.id,
              type: currLine.type,
            };
          } else {
            reverseLine = { start: currLine.end, end: currLine.start, id: currLine.id };
          }

          if (currNode.x === reverseLine.start.x && currNode.y === reverseLine.start.y) {
            realCurrLine = reverseLine;
          } else {
            throw new Error(`边 ${lines[i]} 与上一条不相连`);
          }
        }

        const currPath = document.getElementById(realCurrLine.id) as unknown as SVGPathElement;
        const currLength = Math.round(currPath.getTotalLength() * distanceScale * 100) / 100;
        totalTime += currLength / 10;
        totalLength += currLength;
        arr.push({ position: totalLength, time: totalTime });
        path += getEdgePath(realCurrLine);
        currNode = realCurrLine.end;
      }

      if (!(currNode.x === startNode.x && currNode.y === startNode.y)) {
        arr.push({ position: totalLength, time: (totalTime += 60) });
      }

      const keyframes = arr.map(({ position, time }) => ({
        offset: time / totalTime,
        offsetDistance: (position / totalLength) * 100 + '%',
      }));

      return { path, keyframes, totalTime };
    }

    onMounted(() => {
      const { path, keyframes, totalTime } = getLineAnimation(timeTable);

      for (let i = 0; i < Math.floor(totalTime / 180); i++) {
        const newBall = document.createElement('div');
        newBall.className = 'ball ball-0';
        document.getElementById('container')!.appendChild(newBall);

        (newBall.style as any).offsetPath = `path('${path}')`;
        newBall.style.backgroundColor = 'red';
        newBall.animate(keyframes, {
          duration: (totalTime * 1000) / timeScale,
          iterations: Infinity,
          delay: -(i * 180 * 1000) / timeScale,
        });
      }
    });

    return { getPath, line1, getStations, getCrossoverPath, getEdgePath, metroLine1 };
  },
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 900px !important;
  height: 900px !important;
  background-color: lavenderblush;
}

.g-svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
<style lang="scss">
.container {
  .ball-0 {
    width: 15px;
    height: 4px;
  }

  .ball {
    position: absolute;
    top: 0;
    background-color: red;
    offset-anchor: center left;
  }
}
</style>
