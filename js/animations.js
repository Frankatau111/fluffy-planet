(function(){
let stage,api,walkTimer,idleTimer,behaviorTimer,running=false;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function cls(name){stage.className=`pet-stage ${name}`}
function action(name,duration=900){if(!stage)return;cls(`action-${name}`);setTimeout(()=>{if(stage&&!stage.classList.contains('walking'))cls('idle')},duration)}
function moveTo(left,bottom=18,speed=2200){
 if(!stage||!api.canAct())return Promise.resolve(false);running=true;
 const now=parseFloat(stage.style.left)||50;stage.className=`pet-stage walking ${left<now?'face-left':''}`;stage.style.transitionDuration=`${speed}ms`;stage.style.left=`${Math.max(22,Math.min(78,left))}%`;stage.style.bottom=`${Math.max(12,Math.min(88,bottom))}px`;
 return wait(speed).then(()=>{running=false;cls('idle');return true});
}
async function forceBehavior(name){
 if(!api.canAct())return false;
 const targets={plant:[73,72],bed:[23,48],toys:[71,32],front:[50,5],search:[35,32]};
 if(name==='play-ball'){await moveTo(68,26,1100);action('jump');}
 else if(name==='smell-plant'){await moveTo(...targets.plant,1500);action('stretch',1200);}
 else if(name==='sleep-bed'){await moveTo(...targets.bed,1600);action('sleep',4000);}
 else if(name==='run-owner'){await moveTo(...targets.front,900);action('love');}
 else if(name==='find'){await moveTo(...targets.search,1300);cls('look');setTimeout(()=>cls('idle'),1200);}
 else if(name==='spin')action('spin');
 else if(name==='happy-jump')action('jump');
 else if(name==='sit')action('sit',1900);
 else if(name==='lie')action('lie',2200);
 else if(name==='stretch')action('stretch',1300);
 else if(name==='yawn')action('yawn',1400);
 api.onBehavior(name);return true;
}
function chooseBehavior(){
 const s=api.getState(),pet=window.FluffyPets.PETS.find(p=>p.id===s.petId),bag=['sit','find','happy-jump','spin','smell-plant'];
 if(s.energy<30)bag.push('sleep-bed','sleep-bed','yawn');
 if(s.fun<35)bag.push('play-ball','play-ball');
 if(pet.traits.includes('active'))bag.push('play-ball','happy-jump','spin','run-owner');
 if(pet.traits.includes('sleepy'))bag.push('sleep-bed','lie','yawn');
 if(pet.traits.includes('clingy'))bag.push('run-owner','run-owner');
 if(pet.traits.includes('foodie'))bag.push('find','find','smell-plant');
 if(pet.traits.includes('gentle'))bag.push('sit','lie');
 return bag[Math.floor(Math.random()*bag.length)];
}
function scheduleWalk(){clearTimeout(walkTimer);walkTimer=setTimeout(async()=>{if(api.canAct()&&!running)await moveTo(25+Math.random()*50,12+Math.random()*38,1700+Math.random()*1200);scheduleWalk()},7000+Math.random()*9000)}
function scheduleIdle(){clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(api.canAct()&&!running){const x=Math.random();if(x<.34){cls('look');setTimeout(()=>cls('idle'),1700)}else if(x<.58){cls('ear-twitch');setTimeout(()=>cls('idle'),700)}else forceBehavior(['sit','lie','stretch','yawn'][Math.floor(Math.random()*4)])}scheduleIdle()},4500+Math.random()*6500)}
function scheduleBehavior(){clearTimeout(behaviorTimer);behaviorTimer=setTimeout(()=>{if(api.canAct()&&!running)forceBehavior(chooseBehavior());scheduleBehavior()},18000+Math.random()*18000)}
function init(options){stage=options.stage;api=options;scheduleWalk();scheduleIdle();scheduleBehavior()}
function pause(){clearTimeout(walkTimer);clearTimeout(idleTimer);clearTimeout(behaviorTimer)}
function resume(){pause();scheduleWalk();scheduleIdle();scheduleBehavior()}
window.FluffyMotion={init,action,moveTo,forceBehavior,pause,resume,get running(){return running}};
})();
