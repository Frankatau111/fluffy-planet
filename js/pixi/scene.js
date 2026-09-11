(function(){
async function createScene(host){
  if(!window.PIXI)throw new Error('PixiJS 未加载');
  const app=new PIXI.Application();
  await app.init({resizeTo:host,backgroundAlpha:0,antialias:true,autoDensity:true,resolution:Math.min(window.devicePixelRatio||1,2),preference:'webgl'});
  app.canvas.className='pixi-pet-canvas';app.canvas.setAttribute('aria-label','糯团 PixiJS 互动角色');host.replaceChildren(app.canvas);
  const stage=new PIXI.Container(),character=new PIXI.Container();stage.addChild(character);app.stage.addChild(stage);
  const layout=()=>{const w=app.screen.width,h=app.screen.height,scale=Math.min(w/620,h/620)*1.08;stage.position.set(w/2,h/2+4);stage.scale.set(scale)};
  layout();const observer=new ResizeObserver(layout);observer.observe(host);
  return{app,stage,character,layout,destroy(){observer.disconnect();app.destroy(true,{children:true,texture:false})}};
}
window.FluffyPixiScene={createScene};
})();
