# 绒绒星球 v4.2 — 糯团人格升级

这是一款五角色同屏的轻养成网页游戏。本版本完整保留金币、等级、亲密度、原有存档、商店、图鉴、任务和探索系统，只为家园中的 PixiJS 糯团增加人格、记忆、主动事件和情境对话。

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
- `js/pixi/pets/nuotuan/personality.js`：糯团人格特质、主动行为权重、北京时间情境对话和独立陪伴记忆。
- `js/pixi/pets/nuotuan/config.js`：数据驱动的状态帧数组、尺寸和 Pixi hitArea。
- `assets/pets/nuotuan/`：`idle.webp`、`blink.webp`、`sleep.webp`、`happy.webp`、`pet.webp`。

糯团支持 `idle`、`happy`、`sleep`、`pet`、`eat`、`sad`、`excited` 七种状态。素材角色由配置中的 `frames` 数组决定，不在动画代码中绑定文件名；未来加入 `walk_01.webp`、`walk_02.webp` 时只需登记帧路径和 fps。

糯团的人格参数为粘人 90、好奇 70、淘气 40、慢热 20。主动行为会按这些特质加权，并在单次陪伴期间保证出现主动靠近。对话不再对糯团随机抽句，而是根据状态、互动、主动行为、人格阈值和中国本地时间确定性轮换。最近见面、最近互动和最近喂食记录在独立的 `fluffy_nuotuan_memory_v1` 中，不修改游戏原有 `fluffy_planet_v4` 存档结构，也不会产生离线惩罚。

以后替换 WebP 素材不需要改业务逻辑。要接入桃可、牙牙啾、麦朵或树果，可复制糯团的状态配置和状态机适配器，提供相同语义的状态素材，再由 Pixi 挂载层按角色 ID 选择配置。金币、亲密度和存档层不需要修改。

## 验证

```bash
node tests/smoke.cjs
node tests/pixi-smoke.cjs
node tests/personality-smoke.cjs
```

项目为纯静态站点，入口是仓库根目录的 `index.html`，全部资源使用相对路径，兼容 GitHub Pages 项目路径部署。
