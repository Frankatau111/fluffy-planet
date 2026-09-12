(function(){
'use strict';
function crop(texture,frame){const t=new PIXI.Texture({source:texture.source,frame:new PIXI.Rectangle(frame.x,frame.y,frame.width,frame.height)}),s=new PIXI.Sprite(t);s.anchor.set(.5);s.position.set(-320+frame.x+frame.width/2,-320+frame.y+frame.height/2);return s}
function hitRect(spec,label,onTap){const g=new PIXI.Graphics().rect(spec.x,spec.y,spec.width,spec.height).fill({color:0xffffff,alpha:.001});g.eventMode='static';g.cursor='pointer';g.label=label;g.on('pointertap',onTap);return g}
async function createSpriteManager(scene,config,onInteract){
  const paths=[...new Set(Object.values(config.states).flatMap(x=>x.frames||[]))],loaded=await PIXI.Assets.load(paths),textures={};
  for(const[name,def]of Object.entries(config.states))textures[name]=(def.frames||[]).map(path=>loaded[path]).filter(Boolean);
  const resolveState=name=>{const seen=new Set();let key=name;while(!textures[key]?.length&&!seen.has(key)){seen.add(key);key=config.states[key]?.fallback||'idle'}return textures[key]?.length?key:'idle'};
  const idleTexture=textures[resolveState('idle')][0],body=new PIXI.Sprite(idleTexture);body.anchor.set(.5);body.label='nuotuan-body';
  const layers={tail:crop(idleTexture,config.layerFrames.tail),body,earLeft:crop(idleTexture,config.layerFrames.earLeft),earRight:crop(idleTexture,config.layerFrames.earRight)};
  scene.character.addChild(layers.tail,body,layers.earLeft,layers.earRight);
  const regions={head:hitRect(config.hitAreas.head,'nuotuan-head',()=>onInteract('petHead')),earLeft:hitRect(config.hitAreas.earLeft,'nuotuan-ear-left',()=>onInteract('petSpecial')),earRight:hitRect(config.hitAreas.earRight,'nuotuan-ear-right',()=>onInteract('petSpecial')),belly:hitRect(config.hitAreas.belly,'nuotuan-belly',()=>onInteract('petBelly'))};
  scene.character.addChild(regions.head,regions.earLeft,regions.earRight,regions.belly);
  let current='idle',frame=0;
  function setFrame(name,index=0){current=resolveState(name);const frames=textures[current];frame=index%frames.length;body.texture=frames[frame]}
  function pose(name,index=0){setFrame(name,index);const layered=current==='idle'||current==='blink';layers.earLeft.visible=layered;layers.earRight.visible=layered;layers.tail.visible=layered;body.scale.set(1);body.position.set(0,0);scene.character.rotation=0}
  return{textures,layers,regions,pose,setFrame,character:scene.character,resolveState,frameCount:name=>textures[resolveState(name)].length,fps:name=>Number(config.states[name]?.fps||config.states[resolveState(name)]?.fps||1),get current(){return current},get frame(){return frame}};
}
window.FluffyPixiSprites={createSpriteManager};
})();
