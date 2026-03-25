# Cylindro Blocks

一个基于 Three.js 的圆柱表面俄罗斯方块网页游戏原型。

玩法特点：

- 方块沿圆柱表面下落
- 圆柱可以旋转观察
- 围满圆柱一整圈即可消除
- 支持键盘与鼠标交互

## 在线试玩

部署 GitHub Pages 后，试玩地址将会是：

- <https://nutting.github.io/cylindro-blocks/>

## 本地开发

```bash
npm install
npm run dev
```

## 本地预览生产构建

```bash
npm run build
npm run preview
```

## 当前操作

- `A / D`：方块左右移动
- `W`：旋转方块
- `S`：加速下落
- `Space`：直接落到底
- `← / →`：旋转圆柱视角
- 鼠标拖拽：旋转圆柱
- `R`：重新开始

## 技术栈

- Vite
- TypeScript
- Three.js

## 说明

这是一个可玩的原型版本，重点在核心玩法验证与视觉方向探索。
