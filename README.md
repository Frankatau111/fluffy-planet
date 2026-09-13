# 绒绒星球 v4.4 — 糯团生命化升级

五角色同屏轻养成网页游戏。本版本保留金币、等级、亲密度、饥饿/精力、人格、台词、存档、商店、图鉴、任务和成就系统，只升级糯团的 PixiJS 渲染层。

## 本地运行

```bash
python -m http.server 8765
```

打开 <http://127.0.0.1:8765/>。

## 糯团生命化架构

- `js/pixi/pets/nuotuan/parts/manifest.js`：未来真实 PNG 分件的固定路径。
- `js/pixi/pets/nuotuan/parts/partLoader.js`：构建 `PetContainer`，包含 body、head、eyes、ears、arms、tail、accessories；当前透明占位分件会自动回退到现有 WebP。
- `assets/pets/nuotuan/parts/`：可直接替换的同名 PNG 占位文件。
- `js/pixi/lifeScheduler.js`：每 10–30 秒安排一次主动行为，并用糯团的粘人度和精力调整概率。
- `js/pixi/animation.js`：分件呼吸、100–200ms 眨眼、±5° 随机耳动、粘人型摆尾、主动行为和 0.5 秒状态混合。
- `js/pixi/spriteManager.js`：创建 PetContainer、分件层级和 head、eyes、ears、belly、tail 点击区域。
- `js/pixi/pets/nuotuan/state.js`：继续从现有养成状态推导 idle、happy、sleep、pet、eat、sad、excited。

Life Scheduler 支持 `look_player`、`stretch`、`clean`、`curious`、`sleep`。连续摸头会依次表现开心、更亲近和撒娇；眼睛、肚子、尾巴也有独立反应。

`fluffy_planet_v4` 的 schema 和字段没有变化。人格记忆继续保存在独立的 `fluffy_nuotuan_memory_v1` 中。

## 验证

```bash
node tests/smoke.cjs
node tests/pixi-smoke.cjs
node tests/personality-smoke.cjs
node tests/life-smoke.cjs
```

项目是纯静态站点，入口为根目录 `index.html`，资源使用相对路径，兼容 GitHub Pages 项目路径部署。
