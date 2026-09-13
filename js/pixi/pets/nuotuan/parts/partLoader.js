(function(){
'use strict';
const ORDER=['tail','body','arms','head','ear_left','ear_right','eyes_open','eyes_close','mouth','accessories'];
function container(name){const node=new PIXI.Container();node.label=`nuotuan-${name}`;node.eventMode='none';return node}
function crop(texture,frame){const partTexture=new PIXI.Texture({source:texture.source,frame:new PIXI.Rectangle(frame.x,frame.y,frame.width,frame.height)}),sprite=new PIXI.Sprite(partTexture);sprite.anchor.set(.5);sprite.position.set(-320+frame.x+frame.width/2,-320+frame.y+frame.height/2);return sprite}
function full(texture){const sprite=new PIXI.Sprite(texture);sprite.anchor.set(.5);return sprite}
function usable(texture){return texture&&texture.width>2&&texture.height>2}
async function load(config,stateTextures){
  const manifest=window.NuotuanPartManifest||{},paths=Object.values(manifest),loaded=paths.length?await PIXI.Assets.load(paths):{},parts=Object.fromEntries(ORDER.map(name=>[name,container(name)])),petContainer=new PIXI.Container();
  petContainer.label='nuotuan-pet-container';petContainer.sortableChildren=true;ORDER.forEach((name,index)=>{parts[name].zIndex=index;petContainer.addChild(parts[name])});
  const idle=stateTextures.idle[0],blink=stateTextures.blink?.[0]||idle,asset=name=>loaded[manifest[name]],body=full(usable(asset('body'))?asset('body'):idle);
  body.label='nuotuan-body-sprite';parts.body.addChild(body);
  const fallbacks={ear_left:['earLeft',idle],ear_right:['earRight',idle],tail:['tail',idle],eyes_open:['eyes',idle],eyes_close:['eyes',blink]};
  for(const[name,[frameName,texture]]of Object.entries(fallbacks)){const external=usable(asset(name)),sprite=external?full(asset(name)):crop(texture,config.partFrames[frameName]);sprite.label=`nuotuan-${name}-sprite`;if(!external){parts[name].position.copyFrom(sprite.position);sprite.position.set(0,0)}parts[name].homeX=parts[name].x;parts[name].homeY=parts[name].y;parts[name].addChild(sprite)}
  for(const name of ['head','mouth','arms','accessories'])if(usable(asset(name)))parts[name].addChild(full(asset(name)));
  parts.eyes_open.visible=false;parts.eyes_close.visible=false;
  return{petContainer,parts,body,assets:loaded,usesExternalParts:Object.fromEntries(ORDER.map(name=>[name,usable(asset(name))]))}
}
window.NuotuanPartLoader={load,ORDER};
})();
