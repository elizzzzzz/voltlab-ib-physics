# 伏特实验室 VoltLab · IB 物理互动电学 / Interactive IB Physics Electricity

面向 IB Physics(2023 大纲)电学部分的互动教学应用:7 个章节 ×「考点精讲 + 实时动画模拟 + 随堂快测」。
中英双语界面(默认英文,侧栏可切换中文),纯前端单页应用(原生 Canvas,无构建步骤)。

**Live:** https://voltlab-ib-physics.pages.dev/ (Cloudflare Pages)

## 运行 / Run locally

```bash
cd app
npm run dev        # http://127.0.0.1:7100/,支持 -- --port 8000 换端口
```

macOS 上也可直接双击 `index.html` 打开。语言偏好保存在浏览器 localStorage。

## 章节

| # | 章节 | 互动内容 |
|---|------|----------|
| 01 | 库仑定律 | 拖动电荷改变距离,F–r 曲线实时定位 |
| 02 | 电场与电场线 | 自由摆放电荷;场强矢量 / 电场线 / 试探电荷轨迹三模式 |
| 03 | 电势与等势面 | 电势热力图 + 等势线 + 可拖动探针 |
| 04 | 电流与漂移速度 | 晶格中电子漂移动画,I = nAve,V–I 特性 |
| 05 | 串并联电路 | 电路搭建、电子流动画、电流表/电压表实时读数 |
| 06 | 电动势与内阻 | V = E − Ir,路端电压–电流图,功率分配 |
| 07 | 电功率 | P = VI = I²R = V²/R,灯泡亮度联动 |

## 技术

- 原生 ES Module + Canvas 2D,无框架、无构建;`scripts/dev-server.mjs` 是零依赖静态服务器
- 测验进度保存在浏览器 localStorage
- 设计参考:PhET Interactive Simulations(CU Boulder)与 PhysicsHub 的交互范式(见 CREDITS.md)

## 结构

```
app/
  index.html            入口
  src/style.css         主题与布局
  src/app.js            章节数据 + 导航 + 测验引擎
  src/i18n.js           中英双语字典与切换
  src/util.js           共享工具(画布、滑杆、矢量箭头)
  src/sim-*.js          七个互动模拟
  scripts/dev-server.mjs 开发服务器
```
