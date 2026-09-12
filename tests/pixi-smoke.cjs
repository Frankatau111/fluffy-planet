const fs=require('fs'),assert=require('assert');

const read=file=>fs.readFileSync(file,'utf8');
const index=read('index.html');
const app=read('js/app.js');
const reaction=read('js/reactions.js');
const config=read('js/pixi/pets/nuotuan/config.js');
const state=read('js/pixi/pets/nuotuan/state.js');
const personality=read('js/pixi/pets/personality/nuotuan.js');
const personalityCore=read('js/pixi/pets/personality/core.js');
const animation=read('js/pixi/animation.js');
const scripts=['vendor/pixi.min.js','js/pixi/pets/personality/core.js','js/pixi/pets/personality/nuotuan.js','js/pixi/pets/personality/taoke.js','js/pixi/pets/personality/yayaya.js','js/pixi/pets/personality/maiduo.js','js/pixi/pets/personality/shuguo.js','js/pixi/pets/nuotuan/config.js','js/pixi/pets/nuotuan/state.js','js/pixi/scene.js','js/pixi/spriteManager.js','js/pixi/animation.js','js/pixi/app.js'];

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
for(const mode of ['idle','happy','sleep','pet','eat','sad','excited'])assert(state.includes(`'${mode}'`),`NuotuanState misses ${mode}`);
assert(animation.includes('3+Math.random()*5'),'blink interval is not randomized to 3–8 seconds');
for(const trait of ['clinginess:90','curiosity:70','mischief:40','reserve:20'])assert(personality.includes(trait),`personality trait ${trait} is missing`);
for(const behavior of ['approach','explore','sneakToy','lookWindow','findTreasure','groom','wait'])assert(personality.includes(`${behavior}:`),`personality behavior ${behavior} is missing`);
for(const memory of ['lastSeen','lastInteraction','lastFeed'])assert(personalityCore.includes(memory),`memory field ${memory} is missing`);
assert(personalityCore.includes("timeZone:'Asia/Shanghai'"),'personality dialogue is not based on China time');
assert(personality.includes("fluffy_nuotuan_memory_v1"),'personality memory must use its own storage key');
assert(!personality.includes('fluffy_planet_v4'),'personality layer must not write the existing game save');
assert(config.includes('frames:'),'asset states do not support frame arrays');

console.log('PASS: PixiJS state machine, personality, memory, contextual dialogue and active behavior');
