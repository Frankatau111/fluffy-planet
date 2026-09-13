(function(){
'use strict';
function hitRect(spec,label,onTap){const g=new PIXI.Graphics().rect(spec.x,spec.y,spec.width,spec.height).fill({color:0xffffff,alpha:.001});g.eventMode='static';g.cursor='pointer';g.label=label;g.on('pointertap',onTap);return g}
async function createSpriteManager(scene,config,onInteract){
  const paths=[...new Set(Object.values(config.states).flatMap(state=>state.frames||[]))],loaded=await PIXI.Assets.load(paths),textures={};
  for(const[name,definition]of Object.entries(config.states))textures[name]=(definition.frames||[]).map(path=>loaded[path]).filter(Boolean);
  const resolveState=name=>{const seen=new Set();let key=name;while(!textures[key]?.length&&!seen.has(key)){seen.add(key);key=config.states[key]?.fallback||'idle'}return textures[key]?.length?key:'idle'};
  const rig=await window.NuotuanPartLoader.load(config,textures),{petContainer,parts,body}=rig;
  scene.character.addChild(petContainer);
  const layers={tail:parts.tail,body,head:parts.head,eyesOpen:parts.eyes_open,eyesClose:parts.eyes_close,earLeft:parts.ear_left,earRight:parts.ear_right,arms:parts.arms,accessories:parts.accessories};
  const regions={
    head:hitRect(config.hitAreas.head,'nuotuan-head',()=>onInteract('petHead')),
    eyes:hitRect(config.hitAreas.eyes,'nuotuan-eyes',()=>onInteract('petEyes')),
    earLeft:hitRect(config.hitAreas.earLeft,'nuotuan-ear-left',()=>onInteract('petSpecial')),
    earRight:hitRect(config.hitAreas.earRight,'nuotuan-ear-right',()=>onInteract('petSpecial')),
    belly:hitRect(config.hitAreas.belly,'nuotuan-belly',()=>onInteract('petBelly')),
    tail:hitRect(config.hitAreas.tail,'nuotuan-tail',()=>onInteract('petTail'))
  };
  Object.values(regions).forEach(region=>scene.character.addChild(region));
  let current='idle',frame=0;
  function setFrame(name,index=0){current=resolveState(name);const frames=textures[current];frame=index%frames.length;body.texture=frames[frame]}
  function showEyes(closed=false){parts.eyes_open.visible=false;parts.eyes_close.visible=closed}
  function pose(name,index=0){setFrame(name,index);const layered=current==='idle'||current==='blink';parts.ear_left.visible=layered;parts.ear_right.visible=layered;parts.tail.visible=layered;showEyes(current==='blink');body.scale.set(1);body.position.set(0,0);scene.character.rotation=0}
  return{textures,layers,parts,regions,pose,setFrame,showEyes,character:scene.character,petContainer,resolveState,partSources:rig.usesExternalParts,frameCount:name=>textures[resolveState(name)].length,fps:name=>Number(config.states[name]?.fps||config.states[resolveState(name)]?.fps||1),get current(){return current},get frame(){return frame}};
}
window.FluffyPixiSprites={createSpriteManager};
})();
