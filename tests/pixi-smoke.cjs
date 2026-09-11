const fs=require('fs'),assert=require('assert');

const read=file=>fs.readFileSync(file,'utf8');
const index=read('index.html');
const app=read('js/app.js');
const reaction=read('js/reactions.js');
const config=read('js/pixi/pets/nuotuan/config.js');
const scripts=['vendor/pixi.min.js','js/pixi/pets/nuotuan/config.js','js/pixi/scene.js','js/pixi/spriteManager.js','js/pixi/animation.js','js/pixi/app.js'];

let last=-1;
for(const script of scripts){
  const at=index.indexOf(`./${script}`);
  assert(at>last,`${script} is missing or loaded out of order`);
  last=at;
  assert(fs.statSync(script).size>0,`${script} is empty`);
}

for(const pose of ['idle','blink','sleep','happy','pet']){
  const path=`assets/pets/nuotuan/${pose}.webp`;
  assert(fs.statSync(path).size>20_000,`${path} is missing or unexpectedly small`);
  assert(config.includes(`${pose}.webp`),`${path} is not replaceable through config`);
}

assert(app.includes('data-pixi-pet="nutuan"'),'home lineup does not mount Nuotuan Pixi canvas');
for(const key of ['mood','energy','hunger','relationship','lastAction','recentActions'])assert(reaction.includes(key),`reaction state misses ${key}`);
for(const area of ['head','earLeft','earRight','belly'])assert(config.includes(area),`hit area ${area} is missing`);
assert(read('js/pixi/animation.js').includes('3+Math.random()*5'),'blink interval is not randomized to 3–8 seconds');

console.log('PASS: PixiJS vendor, scene modules, five replaceable poses, hit areas and reaction state');
