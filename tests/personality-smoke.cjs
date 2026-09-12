const fs=require('fs'),vm=require('vm'),assert=require('assert');

const data=new Map([['fluffy_nuotuan_memory_v1',JSON.stringify({lastSeen:Date.now()-25*60*60*1000})]]);
const localStorage={getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
const document={visibilityState:'visible',addEventListener(){},removeEventListener(){}};
const window={addEventListener(){},removeEventListener(){}};
const context={window,document,localStorage,Intl,Date,Math,JSON,Object,Number,Set,console};
for(const file of ['js/pixi/pets/personality/core.js','js/pixi/pets/personality/nuotuan.js','js/pixi/pets/personality/taoke.js','js/pixi/pets/personality/yayaya.js','js/pixi/pets/personality/maiduo.js','js/pixi/pets/personality/shuguo.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);

const ids=['nutuan','taoke','yayajiu','maiduo','shuguo'];
assert.strictEqual(window.FluffyPersonalities.all().map(p=>p.id).join(','),ids.join(','));
for(const id of ids){const config=window.FluffyPersonalities.get(id);assert.strictEqual(Object.values(config.dialogue).flat().length,50);assert(config.activeHours.length>=2);assert(config.likedInteractions.length>=2);assert(config.dislikedInteractions.length>=1);assert(Object.keys(config.behaviorWeights).length>=4);assert(config.representativeAction)}
const firstLines=ids.map(id=>window.FluffyPersonalities.dialogue(id,{action:'petSpecial',relationship:'friend'},[]).text);
assert.strictEqual(new Set(firstLines).size,5,'characters did not produce independent dialogue');

const personality=new window.NuotuanPersonality.NuotuanPersonality();
assert.deepStrictEqual({...personality.traits},{clinginess:90,curiosity:70,mischief:40,reserve:20});
assert(personality.awayMs>=24*60*60*1000,'time away was not restored from memory');
assert(personality.openingEvent(true).text.includes('昨天没有来看我'),'one-day return dialogue is missing');

personality.recordInteraction('feed');
assert(personality.memory.lastInteraction>0,'recent interaction was not recorded');
assert(personality.memory.lastFeed>0,'recent feeding was not recorded');
assert.deepStrictEqual([...data.keys()],['fluffy_nuotuan_memory_v1'],'personality wrote outside its isolated memory key');

personality.sessionStarted=Date.now()-36_000;
personality.sessionApproachCount=0;
const behaviors=[personality.chooseBehavior({state:'idle'})];
for(let i=0;i<4;i++)behaviors.push(personality.chooseBehavior({state:'idle'}));
assert.strictEqual(behaviors[0],'approach','a clingy Nuotuan did not proactively approach');
assert.strictEqual(new Set(behaviors).size,5,'the first five active behaviors were not varied');
const dialogueIds=behaviors.map(behavior=>personality.dialogue({state:'idle',behavior}).id);
assert.strictEqual(new Set(dialogueIds).size,5,'personality dialogue repeated during varied behaviors');

personality.destroy();
console.log('PASS: Nuotuan traits, contextual dialogue, active behavior and isolated memory');
