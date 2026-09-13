(function(){
'use strict';
const clamp01=value=>Math.max(0,Math.min(1,value));
class NuotuanAnimation{
  constructor(scene,sprites,stateMachine,personality,onDialogue){
    this.scene=scene;this.sprites=sprites;this.stateMachine=stateMachine;this.personality=personality;this.onDialogue=onDialogue;this.mode=stateMachine.current;this.elapsed=0;this.frameElapsed=0;this.stateClock=0;this.recoverTimer=0;this.behaviorTimer=0;this.blinkTimer=0;this.blinkActive=false;this.nextBlink=this.randomBlink();this.blinkCount=0;this.idleVariationCount=0;this.activeBehaviorCount=0;this.lastReaction='';this.reactionHistory=[];this.activeBehaviorHistory=[];this.personalityDialogueHistory=[];this.particles=[];this.activeBehavior='';this.targetX=0;this.transition=null;this.earTargetLeft=0;this.earTargetRight=0;this.nextEarMotion=1.5;this.tick=this.tick.bind(this);
    this.scheduler=new window.FluffyLifeScheduler.LifeScheduler({minDelay:10,maxDelay:30,readContext:()=>{const pet=window.FluffyState?.pet('nutuan')||{},needs=pet.needs||{};return{energy:needs.energy,clinginess:this.personality.traits.clinginess}},onBehavior:behavior=>this.performBehavior(behavior,true)});
    this.unsubscribe=stateMachine.onChange(event=>this.applyState(event));scene.app.ticker.add(this.tick);this.applyState({state:stateMachine.current,meta:{},reason:'boot'})
  }
  randomBlink(){return 3+Math.random()*5}
  capture(){const c=this.sprites.character;return{x:c.x,y:c.y,scaleX:c.scale.x,scaleY:c.scale.y,rotation:c.rotation,alpha:c.alpha}}
  restore(pose){const c=this.sprites.character;c.position.set(pose.x,pose.y);c.scale.set(pose.scaleX,pose.scaleY);c.rotation=pose.rotation;c.alpha=pose.alpha}
  startTransition(from,target,duration=.5){this.restore(from);this.sprites.character.alpha=Math.min(from.alpha,.72);this.transition={from:{...this.capture()},target:{...target,alpha:1},elapsed:0,duration}}
  tickTransition(dt){if(!this.transition)return;const t=this.transition,progress=clamp01((t.elapsed+=dt)/t.duration),ease=1-Math.pow(1-progress,3),c=this.sprites.character;for(const key of['x','y','rotation','alpha'])c[key]=t.from[key]+(t.target[key]-t.from[key])*ease;c.scale.set(t.from.scaleX+(t.target.scaleX-t.from.scaleX)*ease,t.from.scaleY+(t.target.scaleY-t.from.scaleY)*ease);if(progress>=1)this.transition=null}
  resetPose(state){this.sprites.pose(state);const c=this.sprites.character;c.position.set(0,0);c.scale.set(1);c.rotation=0;c.alpha=1;for(const part of Object.values(this.sprites.parts)){part.rotation=0;if(Number.isFinite(part.homeX))part.position.set(part.homeX,part.homeY)}this.elapsed=0;this.frameElapsed=0}
  applyState(event){clearTimeout(this.recoverTimer);const from=this.capture();this.mode=event.state;this.activeBehavior='';this.resetPose(event.state);const{action,repeat=1}=event.meta||{};
    if(event.state==='sleep'){this.sprites.character.y=18;this.sprites.character.scale.set(1,.93)}
    else if(event.state==='sad'){this.sprites.character.y=8;this.sprites.character.scale.set(.98,.96)}
    else if(event.state==='pet')this.petReaction(action,repeat);
    else if(event.state==='eat')this.eat();
    else if(event.state==='happy'){this.lastReaction='happy';this.burstStars(7);this.recoverTimer=setTimeout(()=>this.stateMachine.settle(),1050)}
    else if(event.state==='excited'){this.lastReaction='excited';this.burstStars(10);this.recoverTimer=setTimeout(()=>this.stateMachine.settle(),1450)}
    const target=this.capture();this.startTransition(from,target,.5)
  }
  tick(ticker){const dt=Math.min(.05,ticker.deltaMS/1000);this.elapsed+=dt;this.frameElapsed+=dt;this.stateClock+=dt;const{character,layers}=this.sprites;
    this.advanceFrames();
    if(this.mode==='idle'){const cycle=(1-Math.cos(this.elapsed*1.9))/2,tailAmplitude=.025+(this.personality.traits.clinginess/100)*.03;layers.body.scale.set(1-cycle*.006,1-cycle*.02);layers.body.y=cycle*1.4;this.tickEars(dt);layers.tail.rotation=Math.sin(this.elapsed*1.18)*tailAmplitude;layers.tail.x=(layers.tail.homeX||0)+Math.sin(this.elapsed*.74)*1.8;if(this.elapsed>=this.nextBlink)this.blink();if(!this.activeBehavior)this.scheduler.update(dt)}
    else if(this.mode==='happy'){const bounce=Math.abs(Math.sin(this.elapsed*7));character.y=-bounce*13;character.scale.set(1+bounce*.025,1-bounce*.018)}
    else if(this.mode==='excited'){const bounce=Math.abs(Math.sin(this.elapsed*10));character.y=-bounce*21;character.rotation=Math.sin(this.elapsed*9)*.025}
    else if(this.mode==='eat'){layers.body.y=Math.abs(Math.sin(this.elapsed*8))*7;character.rotation=Math.sin(this.elapsed*5)*.012}
    else if(this.mode==='sleep'){const breath=Math.sin(this.elapsed*.9);character.scale.y=.93+breath*.009;character.y=18+breath*1.2}
    else if(this.mode==='sad'){character.y=8+Math.sin(this.elapsed*1.1);character.rotation=Math.sin(this.elapsed*.7)*.006}
    else if(this.mode==='pet')this.tickPet(character);
    this.tickBehavior(dt);this.tickParticles(dt);this.tickTransition(dt);
    if(this.stateClock>2.5&&['idle','sleep','sad'].includes(this.mode)){this.stateClock=0;this.stateMachine.sync('needs')}
  }
  tickEars(dt){this.nextEarMotion-=dt;if(this.nextEarMotion<=0){const limit=5*Math.PI/180;this.earTargetLeft=(Math.random()*2-1)*limit;this.earTargetRight=(Math.random()*2-1)*limit;this.nextEarMotion=1.4+Math.random()*2.8}const speed=Math.min(1,dt*2.2),{earLeft,earRight}=this.sprites.layers;earLeft.rotation+=(this.earTargetLeft-earLeft.rotation)*speed;earRight.rotation+=(this.earTargetRight-earRight.rotation)*speed}
  advanceFrames(){const count=this.sprites.frameCount(this.mode),fps=this.sprites.fps(this.mode);if(count>1&&this.frameElapsed>=1/fps){this.frameElapsed=0;this.sprites.setFrame(this.mode,this.sprites.frame+1)}}
  blink(){if(this.mode!=='idle'||this.blinkActive)return;this.blinkActive=true;this.blinkCount++;this.sprites.showEyes(true);clearTimeout(this.blinkTimer);this.blinkTimer=setTimeout(()=>{this.blinkActive=false;this.sprites.showEyes(false);this.elapsed=0;this.nextBlink=this.randomBlink()},100+Math.random()*100)}
  petReaction(action,repeat){const phase=((repeat-1)%3)+1,kind=action==='petEyes'?'eyes':action==='petSpecial'?'ear':action==='petBelly'?'belly':action==='petTail'?'tail':'head';this.lastReaction=`${kind}-${phase}`;this.reactionHistory.push(this.lastReaction);this.reactionHistory=this.reactionHistory.slice(-10);const c=this.sprites.character;
    if(kind==='head'){if(phase===1){c.y=-9;this.burstStars(5)}else if(phase===2){c.x=-11;c.scale.set(1.06,.98);this.burstStars(7)}else{this.sprites.pose('pet');c.x=-18;c.y=-7;c.rotation=-.045;c.scale.set(1.07,.97)}}
    else if(kind==='eyes'){this.sprites.pose('idle');this.sprites.showEyes(true);c.y=-7;if(phase>=2)c.scale.set(1.04,.98);if(phase===3)c.rotation=-.035}
    else if(kind==='ear'){this.sprites.pose('idle');const amount=[.08,.13,.18][phase-1];this.sprites.layers.earLeft.rotation=-amount;this.sprites.layers.earRight.rotation=amount;if(phase===3)c.x=-15}
    else if(kind==='belly'){if(phase===1)c.rotation=-.03;else if(phase===2)c.scale.set(.94,1.04);else{c.x=-22;c.rotation=-.045}}
    else if(kind==='tail'){this.sprites.pose('idle');c.x=-[8,15,24][phase-1];c.rotation=-[.015,.03,.05][phase-1];this.sprites.layers.tail.rotation=.12+phase*.04}
    const recover=kind==='head'&&phase<3?()=>this.stateMachine.transition('happy','pet:success',{force:true}):()=>this.stateMachine.settle();this.recoverTimer=setTimeout(()=>{this.sprites.showEyes(false);recover()},phase===3?1450:1100)
  }
  tickPet(character){const[kind,raw]=this.lastReaction.split('-'),phase=Number(raw||1);if(kind==='ear'){const base=[.08,.13,.18][phase-1],twitch=Math.sin(this.elapsed*18)*(.02+phase*.01);this.sprites.layers.earLeft.rotation=-base-twitch;this.sprites.layers.earRight.rotation=base+twitch}else if(kind==='tail')this.sprites.layers.tail.rotation+=Math.sin(this.elapsed*13)*.004;else if(phase===1)character.y-=Math.sin(this.elapsed*6)*.12;else if(phase===2)character.rotation=Math.sin(this.elapsed*4)*.025}
  eat(){this.lastReaction='eat';this.burstStars(6,0xffd36e);this.recoverTimer=setTimeout(()=>this.stateMachine.transition('happy','eat:complete',{force:true}),1250)}
  burstStars(count,color=0xffd86b){for(let i=0;i<count;i++){const g=new PIXI.Graphics().circle(0,0,5+(i%3)).fill({color,alpha:.95});g.eventMode='none';g.position.set(-80+Math.random()*160,-90+Math.random()*70);g.rotation=Math.random()*Math.PI;this.scene.character.addChild(g);this.particles.push({node:g,vx:-18+Math.random()*36,vy:-35-Math.random()*35,life:.7+Math.random()*.45})}}
  tickParticles(dt){this.particles=this.particles.filter(p=>{p.life-=dt;p.node.x+=p.vx*dt;p.node.y+=p.vy*dt;p.node.rotation+=dt*3;p.node.alpha=Math.max(0,p.life);if(p.life<=0){p.node.destroy();return false}return true})}
  normalizeBehavior(choice){return{approach:'look_player',wait:'look_player',explore:'curious',lookWindow:'curious',findTreasure:'curious',sneakToy:'stretch',groom:'clean'}[choice]||choice}
  performBehavior(rawChoice,speak=false){if(this.mode!=='idle'||this.activeBehavior)return;const choice=this.normalizeBehavior(rawChoice);if(!window.FluffyLifeScheduler.BEHAVIORS.includes(choice))return;clearTimeout(this.behaviorTimer);this.activeBehavior=choice;this.activeBehaviorCount++;this.idleVariationCount++;this.activeBehaviorHistory.push(choice);this.activeBehaviorHistory=this.activeBehaviorHistory.slice(-20);const c=this.sprites.character,from=this.capture();
    if(choice==='look_player'){c.x=-5;c.y=-5;c.rotation=-.025;this.sprites.parts.head.rotation=-.035}
    else if(choice==='stretch'){c.y=5;c.scale.set(1.055,.94);this.sprites.parts.arms.rotation=.025}
    else if(choice==='clean'){this.sprites.pose('pet');c.rotation=-.028;c.y=3}
    else if(choice==='curious'){this.targetX=-20+Math.random()*40;c.rotation=this.targetX<0?-.022:.022}
    else if(choice==='sleep'){this.sprites.pose('sleep');c.y=14;c.scale.set(1,.94)}
    const target=this.capture();this.startTransition(from,target,.5);if(speak)this.speak({behavior:choice,state:this.mode});
    this.behaviorTimer=setTimeout(()=>{if(this.mode==='idle'){const backFrom=this.capture();this.activeBehavior='';this.resetPose('idle');const backTarget=this.capture();this.startTransition(backFrom,backTarget,.5);this.nextBlink=this.randomBlink()}},choice==='sleep'?5200:2200+Math.random()*1300)
  }
  tickBehavior(dt){const c=this.sprites.character;if(this.activeBehavior==='look_player')c.rotation+=Math.sin(this.elapsed*1.8)*.0007;else if(this.activeBehavior==='stretch')this.sprites.layers.body.scale.y=.94+Math.sin(this.elapsed*2.4)*.012;else if(this.activeBehavior==='clean')c.rotation+=Math.sin(this.elapsed*5)*.0012;else if(this.activeBehavior==='curious')c.x+=(this.targetX-c.x)*Math.min(1,dt*2.8);else if(this.activeBehavior==='sleep')c.scale.y=.94+Math.sin(this.elapsed*.85)*.008}
  speak(context={}){const line=this.personality.dialogue(context);this.personalityDialogueHistory.push(line.id);this.personalityDialogueHistory=this.personalityDialogueHistory.slice(-12);this.onDialogue?.(line.text,line);return line}
  opening(event){if(!event)return null;this.performBehavior(event.behavior,false);this.onDialogue?.(event.text,event);return event}
  react(action,result={}){this.personality.recordInteraction(action);const event=this.stateMachine.fromInteraction(action,result);return{event,line:this.speak({action,repeat:result.repeat,state:event.state})}}
  considerPassive(){return this.mode==='idle'&&!this.activeBehavior}
  destroy(){clearTimeout(this.recoverTimer);clearTimeout(this.behaviorTimer);clearTimeout(this.blinkTimer);this.unsubscribe?.();this.personality.destroy();this.particles.forEach(p=>p.node.destroy());this.scene.app.ticker.remove(this.tick)}
  debug(){return{mode:this.mode,state:this.stateMachine.debug(),personality:this.personality.debug(),blinkCount:this.blinkCount,idleVariationCount:this.idleVariationCount,activeBehaviorCount:this.activeBehaviorCount,activeBehavior:this.activeBehavior,activeBehaviorHistory:[...this.activeBehaviorHistory],lifeScheduler:this.scheduler.debug(),personalityDialogueHistory:[...this.personalityDialogueHistory],lastReaction:this.lastReaction,reactionHistory:[...this.reactionHistory],nextBlink:this.nextBlink,transitioning:Boolean(this.transition)}}
}
window.FluffyPixiAnimation={NuotuanAnimation};
})();
