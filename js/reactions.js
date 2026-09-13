(function(){
const clamp=n=>Math.max(0,Math.min(100,n));
const effects={feed:{coins:-8,xp:5,love:3,hunger:18},play:{xp:6,love:2,fun:20,energy:-8},clean:{xp:4,love:2,clean:22},sleep:{xp:3,love:1,energy:30},petHead:{xp:3,love:2,fun:4},petEyes:{xp:3,love:2,fun:4},petSpecial:{xp:4,love:2,fun:5},petBelly:{xp:3,love:1,fun:3},petTail:{xp:3,love:1,fun:3}};
const areas={petHead:'head',petEyes:'head',petSpecial:'special',petBelly:'body',petTail:'special'};
function time(){const h=new Date().getHours();return h<6||h>=21?'night':h<10?'morning':h<17?'day':'evening'}
function relationship(love){return love<20?'low':love<40?'familiar':love<60?'friend':love<80?'close':'partner'}
function moodOf(state){if(state.needs.energy<25)return'sleepy';if(state.needs.hunger<25)return'hungry';if(state.love>=80)return'attached';return state.lastMood||'calm'}
function animationFor(id,action,same,state){if(action==='sleep'||state.needs.energy<18)return'sleep';if(id==='nutuan'){if(action==='petSpecial')return'ear';if(action==='petBelly')return'shy';if(same>=3)return'cuddle';return'happy'}if(action==='play')return id==='yayajiu'?'dash':'jump';if(action==='petSpecial'||same>=3)return{taoke:'groom',yayajiu:'dash',maiduo:'organize',shuguo:'doze'}[id];return id==='yayajiu'?'jump':id==='shuguo'?'doze':'cuddle'}
function react(petId,action,area=action){
  const profile=window.FluffyPets.getPet(petId),state=window.FluffyState.pet(petId),now=Date.now(),same=state.lastAction===action&&now-state.lastActionTime<12000?state.sameActionCount+1:1,base=effects[action]||{xp:2,love:1},touchKey=areas[area]||area;
  state.needs=state.needs||{hunger:82,thirst:82,fun:80,clean:88,energy:78};
  state.lastAction=action;state.lastActionTime=now;state.sameActionCount=same;state.recentActions=[...state.recentActions,action].slice(-10);state.recentPettingArea=area;state.interactions++;
  state.love=clamp(state.love+(base.love||0)*(profile.touch[touchKey]||1));for(const key of['hunger','thirst','fun','clean','energy'])if(base[key])state.needs[key]=clamp(state.needs[key]+base[key]);state.lastMood=moodOf(state);
  const line=window.FluffyDialogue.pick(petId,{action,repeat:same,time:time(),relationship:relationship(state.love),mood:state.lastMood,energy:state.needs.energy,hunger:state.needs.hunger,recentActions:state.recentActions},state.recentDialogueIds);
  state.recentDialogueIds=[...state.recentDialogueIds,line.id].slice(-15);window.FluffyState.addCoins(base.coins||0);window.FluffyState.addXP(base.xp||0);window.FluffyState.save();
  return{...line,repeat:same,love:state.love,mood:state.lastMood,energy:state.needs.energy,hunger:state.needs.hunger,animation:animationFor(profile.id,action,same,state)};
}
window.FluffyReactions={react,relationship,time,moodOf};
})();
