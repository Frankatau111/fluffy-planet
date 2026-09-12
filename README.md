# 绒绒星球 v4.3 — 五角色独立人格

这是一款五角色同屏的轻养成网页游戏。本版本完整保留金币、等级、亲密度、原有存档、商店、图鉴、任务和探索系统，为糯团、桃可、牙牙啾、麦朵和树果建立相互独立的人格、行为权重与情境台词。

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
- `js/pixi/pets/personality/core.js`：人格注册、北京时间、关系/状态/事件对话决策和行为加权共享层。
- `js/pixi/pets/personality/nuotuan.js`：糯团人格、主动事件与独立陪伴记忆。
- `js/pixi/pets/personality/taoke.js`：桃可的探索、观察家具、偷偷玩玩具等高好奇/高淘气行为。
- `js/pixi/pets/personality/yayaya.js`：牙牙啾的冲刺、比赛、觅食等高活跃行为。
- `js/pixi/pets/personality/maiduo.js`：麦朵的整理、检查与照看伙伴行为。
- `js/pixi/pets/personality/shuguo.js`：树果的睡觉、看窗外和慢动作低活跃行为。
- `js/pixi/pets/nuotuan/config.js`：数据驱动的状态帧数组、尺寸和 Pixi hitArea。
- `assets/pets/nuotuan/`：`idle.webp`、`blink.webp`、`sleep.webp`、`happy.webp`、`pet.webp`。

糯团支持 `idle`、`happy`、`sleep`、`pet`、`eat`、`sad`、`excited` 七种状态。素材角色由配置中的 `frames` 数组决定，不在动画代码中绑定文件名；未来加入 `walk_01.webp`、`walk_02.webp` 时只需登记帧路径和 fps。

每个角色配置粘人、好奇、淘气、慢热程度，活跃时段，喜欢/不喜欢的互动，主动行为权重、代表动作和独立的 50 条基础台词。台词根据中国本地时间、状态、关系等级、互动和主动事件确定性轮换，不随机抽句。糯团最近见面、互动和喂食仍记录在独立的 `fluffy_nuotuan_memory_v1` 中，不修改游戏原有 `fluffy_planet_v4` 存档结构。

以后替换 WebP 素材不需要改业务逻辑。要接入桃可、牙牙啾、麦朵或树果，可复制糯团的状态配置和状态机适配器，提供相同语义的状态素材，再由 Pixi 挂载层按角色 ID 选择配置。金币、亲密度和存档层不需要修改。

## 验证

```bash
node tests/smoke.cjs
node tests/pixi-smoke.cjs
node tests/personality-smoke.cjs
```

项目为纯静态站点，入口是仓库根目录的 `index.html`，全部资源使用相对路径，兼容 GitHub Pages 项目路径部署。
