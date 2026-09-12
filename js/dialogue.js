(function(){
'use strict';
const personalities=window.FluffyPersonalities;
const D=Object.fromEntries(personalities.all().map(config=>[config.id,Object.fromEntries(Object.entries(config.dialogue).map(([group,lines])=>[group,lines.map((text,index)=>({id:`${group}-${index}`,text,weight:1}))]))]));
function pick(petId,context={},recent=[]){return personalities.dialogue(petId,context,recent)}
function count(petId){return personalities.count(petId)}
window.FluffyDialogue={D,pick,count,total:personalities.total()};
})();
