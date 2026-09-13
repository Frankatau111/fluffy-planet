const fs=require('fs'),vm=require('vm'),assert=require('assert');

const stableMath=Object.create(Math);stableMath.random=()=>.5;
const context={window:{},Math:stableMath,Number,Object,Array};
vm.runInNewContext(fs.readFileSync('js/pixi/lifeScheduler.js','utf8'),context,{filename:'js/pixi/lifeScheduler.js'});

const emitted=[],scheduler=new context.window.FluffyLifeScheduler.LifeScheduler({readContext:()=>({energy:76,clinginess:90}),onBehavior:name=>emitted.push(name)});
assert(scheduler.nextAt>=10&&scheduler.nextAt<=30,'initial schedule is outside 10–30 seconds');
const fiveMinutes=scheduler.simulate(300,.5);
assert(fiveMinutes.length>=10,'five-minute simulation did not produce enough autonomous behaviors');
assert.strictEqual(fiveMinutes[0],'look_player','high-clinginess Nuotuan did not look at the player first');
assert(fiveMinutes.includes('look_player'),'five-minute simulation never looked at the player');
assert.strictEqual(JSON.stringify(emitted),JSON.stringify(fiveMinutes),'scheduled behaviors were not dispatched');
assert(context.window.FluffyLifeScheduler.BEHAVIORS.every(name=>['look_player','stretch','clean','curious','sleep'].includes(name)),'scheduler exposed an unexpected behavior');

console.log(`PASS: five-minute life simulation emitted ${fiveMinutes.length} behaviors including look_player`);
