(function(){
'use strict';
let timer=null,running=false;
const personalities=window.FluffyPersonalities;
const weights=Object.fromEntries(personalities.all().map(config=>[config.id,Object.entries(config.behaviorWeights).flatMap(([name,weight])=>Array.from({length:Math.max(1,Math.round(weight/24))},()=>name))]));
function choose(id){return personalities.chooseBehavior(id)}
function choosePet(){const pets=window.FluffyPets.PETS.map(pet=>({id:pet.id,score:personalities.activityScore(pet.id)})),total=pets.reduce((sum,pet)=>sum+pet.score,0);let cursor=Math.random()*total;return pets.find(pet=>(cursor-=pet.score)<=0)?.id||pets[0].id}
function animation(id,behavior){return personalities.animationFor(id,behavior)}
function start(onIdle,onEvent){stop();running=true;const tick=()=>{if(!running)return;const id=choosePet(),behavior=choose(id);onIdle(id,behavior);if(Math.random()<.18)onEvent(window.FluffyRelationships.random());timer=setTimeout(tick,4500+Math.random()*4500)};timer=setTimeout(tick,2600)}
function stop(){clearTimeout(timer);running=false}
window.FluffyBehaviors={start,stop,choose,animation,weights};
})();
