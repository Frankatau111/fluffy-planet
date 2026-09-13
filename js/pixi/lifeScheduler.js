(function(){
'use strict';
const BEHAVIORS=['look_player','stretch','clean','curious','sleep'];
class LifeScheduler{
  constructor(options={}){this.minDelay=Number(options.minDelay||10);this.maxDelay=Number(options.maxDelay||30);this.onBehavior=options.onBehavior||(()=>{});this.readContext=options.readContext||(()=>({}));this.elapsed=0;this.nextAt=this.randomDelay();this.history=[];this.count=0}
  randomDelay(){return this.minDelay+Math.random()*(this.maxDelay-this.minDelay)}
  weights(){const context=this.readContext()||{},energy=Number(context.energy??78),clinginess=Number(context.clinginess??90);return{look_player:28+clinginess*.18,stretch:20,clean:18,curious:26,sleep:energy<35?55:12}}
  choose(){const weights=this.weights();if(!this.history.includes('look_player')&&(this.count>=1||weights.look_player>=44))return'look_player';const last=this.history.at(-1),entries=BEHAVIORS.map(name=>[name,name===last?weights[name]*.2:weights[name]]),total=entries.reduce((sum,item)=>sum+item[1],0);let cursor=Math.random()*total;return entries.find(item=>(cursor-=item[1])<=0)?.[0]||'look_player'}
  update(dt){this.elapsed+=Math.max(0,Number(dt)||0);if(this.elapsed<this.nextAt)return null;this.elapsed=0;this.nextAt=this.randomDelay();const behavior=this.choose();this.count++;this.history.push(behavior);this.history=this.history.slice(-20);this.onBehavior(behavior);return behavior}
  simulate(seconds,step=1){const emitted=[];for(let time=0;time<seconds;time+=step){const behavior=this.update(step);if(behavior)emitted.push(behavior)}return emitted}
  reset(){this.elapsed=0;this.nextAt=this.randomDelay()}
  debug(){return{minDelay:this.minDelay,maxDelay:this.maxDelay,nextAt:this.nextAt,elapsed:this.elapsed,count:this.count,history:[...this.history]}}
}
window.FluffyLifeScheduler={LifeScheduler,BEHAVIORS};
})();
