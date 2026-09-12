# 绒绒星球 v4.1.1 — PixiJS 糯团生命感升级

这是一款五角色同屏的轻养成网页游戏。本版本完整保留金币、等级、亲密度、台词、存档、商店、图鉴、任务和探索系统，只升级家园中糯团的 PixiJS 8.20.1 角色表现。

## 本地运行

在仓库根目录运行：

```bash
python -m http.server 8765
```

然后打开 <http://127.0.0.1:8765/>。

## PixiJS 架构

- `js/pixi/app.js`：挂载入口、状态桥接和调试接口。
- `js/pixi/scene.js`：透明画布、场景根节点和响应式布局。
- `js/pixi/spriteManager.js`：素材加载、显示层级与头部/耳朵/腹部点击区域。
- `js/pixi/animation.js`：呼吸、耳朵摆动、随机眨眼、粒子、连续触摸反应和低频主动行为。
- `js/pixi/pets/nuotuan/state.js`：根据精力、饥饿、亲密关系和最近互动推导视觉状态。
- `js/pixi/pets/nuotuan/config.js`：数据驱动的状态帧数组、尺寸和 Pixi hitArea。
- `assets/pets/nuotuan/`：`idle.webp`、`blink.webp`、`sleep.webp`、`happy.webp`、`pet.webp`。

糯团支持 `idle`、`happy`、`sleep`、`pet`、`eat`、`sad`、`excited` 七种状态。素材角色由配置中的 `frames` 数组决定，不在动画代码中绑定文件名；未来加入 `walk_01.webp`、`walk_02.webp` 时只需登记帧路径和 fps。

以后替换 WebP 素材不需要改业务逻辑。要接入桃可、牙牙啾、麦朵或树果，可复制糯团的状态配置和状态机适配器，提供相同语义的状态素材，再由 Pixi 挂载层按角色 ID 选择配置。金币、亲密度和存档层不需要修改。

## 验证

```bash
node tests/smoke.cjs
node tests/pixi-smoke.cjs
```

项目为纯静态站点，入口是仓库根目录的 `index.html`，全部资源使用相对路径，兼容 GitHub Pages 项目路径部署。
