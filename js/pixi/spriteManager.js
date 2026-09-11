(function(){
function crop(texture,frame){const t=new PIXI.Texture({source:texture.source,frame:new PIXI.Rectangle(frame.x,frame.y,frame.width,frame.height)}),s=new PIXI.Sprite(t);s.anchor.set(.5);s.position.set(-320+frame.x+frame.width/2,-320+frame.y+frame.height/2);return s}
function hitRect(spec,label,onTap){const g=new PIXI.Graphics().rect(spec.x,spec.y,spec.width,spec.height).fill({color:0xffffff,alpha:.001});g.eventMode='static';g.cursor='pointer';g.label=label;g.on('pointertap',onTap);return g}
async function createSpriteManager(scene,config,onInteract){
  const paths=Object.values(config.assets),loaded=await PIXI.Assets.load(paths),textures={};Object.entries(config.assets).forEach(([name,path])=>textures[name]=loaded[path]);
  const body=new PIXI.Sprite(textures.idle);body.anchor.set(.5);body.label='nuotuan-body';
  const layers={tail:crop(textures.idle,config.layerFrames.tail),body,earLeft:crop(textures.idle,config.layerFrames.earLeft),earRight:crop(textures.idle,config.layerFrames.earRight)};
  scene.character.addChild(layers.tail,body,layers.earLeft,layers.earRight);
  const regions={head:hitRect(config.hitAreas.head,'nuotuan-head',()=>onInteract('petHead')),earLeft:hitRect(config.hitAreas.earLeft,'nuotuan-ear-left',()=>onInteract('petSpecial')),earRight:hitRect(config.hitAreas.earRight,'nuotuan-ear-right',()=>onInteract('petSpecial')),belly:hitRect(config.hitAreas.belly,'nuotuan-belly',()=>onInteract('petBelly'))};
  scene.character.addChild(regions.head,regions.earLeft,regions.earRight,regions.belly);
  function pose(name){body.texture=textures[name]||textures.idle;const layered=name==='idle'||name==='blink';layers.earLeft.visible=layered;layers.earRight.visible=layered;layers.tail.visible=layered;body.scale.set(1);body.position.set(0,0);scene.character.rotation=0}
  return{textures,layers,regions,pose,character:scene.character};
}
window.FluffyPixiSprites={createSpriteManager};
})();
