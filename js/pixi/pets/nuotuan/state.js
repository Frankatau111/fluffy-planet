(function(){
'use strict';
const VALID=new Set(['idle','happy','sleep','pet','eat','sad','excited']);
class NuotuanState{
  constructor(readPet){this.readPet=readPet;this.current='idle';this.previous='idle';this.reason='boot';this.changedAt=Date.now();this.lastInteraction=0;this.listeners=new Set();this.relationshipAtChange=this.snapshot().relationship;this.sync('boot')}
  snapshot(){const p=this.readPet?.()||{},needs=p.needs||{};return{energy:Number(needs.energy??78),hunger:Number(needs.hunger??82),relationship:Number(p.love??58),lastInteraction:Number(p.lastActionTime||0),lastAction:p.lastAction||'',repeat:Number(p.sameActionCount||0)}}
  decide(context={}){const s=this.snapshot(),action=context.action||'',now=Date.now(),recent=now-s.lastInteraction<6500;this.lastInteraction=s.lastInteraction;
    if(action==='sleep'||s.energy<22)return'sleep';
    if(s.hunger<22)return'sad';
    if(action==='feed')return'eat';
    if(['petHead','petEyes','petSpecial','petBelly','petTail'].includes(action))return'pet';
    if(action==='play'&&s.energy>30)return'excited';
    if(context.loveGain>0||(recent&&s.relationship>=60))return'happy';
    return'idle'}
  transition(next,reason='system',meta={}){if(!VALID.has(next))next='idle';const changed=next!==this.current,notify=changed||meta.force;this.previous=this.current;this.current=next;this.reason=reason;if(notify)this.changedAt=Date.now();const snapshot=this.snapshot(),event={state:next,previous:this.previous,reason,changed,meta,snapshot};this.relationshipAtChange=snapshot.relationship;if(notify)this.listeners.forEach(fn=>fn(event));return event}
  fromInteraction(action,result={}){const loveGain=Math.max(0,this.snapshot().relationship-this.relationshipAtChange);return this.transition(this.decide({action,loveGain}),`interaction:${action}`,{action,repeat:Number(result.repeat||1),loveGain,force:true})}
  sync(reason='needs'){return this.transition(this.decide(),reason)}
  settle(){const s=this.snapshot();return this.transition(s.energy<22?'sleep':s.hunger<22?'sad':'idle','settle')}
  onChange(listener){this.listeners.add(listener);return()=>this.listeners.delete(listener)}
  debug(){return{state:this.current,previous:this.previous,reason:this.reason,changedAt:this.changedAt,lastInteraction:this.lastInteraction,...this.snapshot()}}
}
window.NuotuanState={NuotuanState,VALID:[...VALID]};
})();
