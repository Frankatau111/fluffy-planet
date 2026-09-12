(function(){
'use strict';
let runtime=null,mountPromise=null,onInteract=null;
async function mount(options={}){onInteract=options.onInteract||onInteract;if(runtime)return runtime;if(mountPromise)return mountPromise;const host=document.querySelector('[data-pixi-pet="nutuan"]');if(!host)return null;
  mountPromise=(async()=>{const scene=await window.FluffyPixiScene.createScene(host),sprites=await window.FluffyPixiSprites.createSpriteManager(scene,window.NuotuanPixiConfig,action=>onInteract?.(action)),stateMachine=new window.NuotuanState.NuotuanState(()=>window.FluffyState?.pet('nutuan')),animation=new window.FluffyPixiAnimation.NuotuanAnimation(scene,sprites,stateMachine);runtime={scene,sprites,stateMachine,animation};host.classList.add('pixi-ready');host.dataset.renderer=scene.app.renderer.type===1?'webgl':'pixi';return runtime})().catch(error=>{host.classList.add('pixi-failed');host.textContent='糯团暂时躲起来了';console.error('糯团 PixiJS 初始化失败',error);throw error});return mountPromise
}
function react(action,result){return runtime?.animation.react(action,result)}function passive(name){return runtime?.animation.considerPassive(name)}
function debugTap(region){const action={head:'petHead',ear:'petSpecial',belly:'petBelly'}[region];if(action)onInteract?.(action)}
function getDebugState(){if(!runtime)return{mounted:false};return{mounted:true,renderer:runtime.scene.app.renderer.type,layers:Object.keys(runtime.sprites.layers),regions:Object.keys(runtime.sprites.regions),resolvedAssets:Object.fromEntries(Object.keys(window.NuotuanPixiConfig.states).map(s=>[s,runtime.sprites.resolveState(s)])),...runtime.animation.debug()}}
window.FluffyPixi={mount,react,passive,debugTap,getDebugState};
})();
