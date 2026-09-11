# 绒绒星球 v4.1 — PixiJS 糯团技术验证

这是一款五角色同屏的轻养成网页游戏。本版本保留金币、等级、亲密度、台词、存档、商店、图鉴、任务和探索系统，只把家园中的糯团升级为 PixiJS 8.20.1 驱动的透明素材角色。

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
- `js/pixi/animation.js`：呼吸、分层浮动、随机眨眼、互动反应、靠近与睡眠。
- `js/pixi/pets/nuotuan/config.js`：糯团素材路径、尺寸和交互热区。
- `assets/pets/nuotuan/`：`idle.webp`、`blink.webp`、`sleep.webp`、`happy.webp`、`pet.webp`。

以后替换同名 WebP 素材不需要改业务逻辑。要接入其他角色，可复制糯团配置、提供同一组状态素材，并在 Pixi 挂载层注册角色。

## 验证

```bash
node tests/smoke.cjs
node tests/pixi-smoke.cjs
```

项目为纯静态站点，入口是仓库根目录的 `index.html`，全部资源使用相对路径，兼容 GitHub Pages 项目路径部署。
