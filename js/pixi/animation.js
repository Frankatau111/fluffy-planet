(function(){
'use strict';
class NuotuanAnimation{
  constructor(scene,sprites,stateMachine){
    this.scene=scene;this.sprites=sprites;this.stateMachine=stateMachine;this.mode=stateMachine.current;this.elapsed=0;this.frameElapsed=0;this.stateClock=0;this.autonomyClock=0;this.recoverTimer=0;this.blinkTimer=0;this.blinkActive=false;this.nextBlink=this.randomBlink();this.nextAutonomy=this.randomAutonomy();this.blinkCount=0;this.idleVariationCount=0;this.activeBehaviorCount=0;this.lastReaction='';this.reactionHistory=[];this.particles=[];this.activeBehavior='';this.targetX=0;this.tick=this.tick.bind(this);this.unsubscribe=stateMachine.onChange(e=>this.applyState(e));scene.app.ticker.add(this.tick);this.applyState({state:stateMachine.current,meta:{},reason:'boot'})
  }
  randomBlink(){return 3+Math.random()*5}randomAutonomy(){return 12+Math.random()*13}
  resetPose(state){this.sprites.pose(state);const c=this.sprites.character;c.position.set(0,0);c.scale.set(1);c.rotation=0;this.elapsed=0;this.frameElapsed=0}
  applyState(event){clearTimeout(this.recoverTimer);this.mode=event.state;this.resetPose(event.state);const{action,repeat=1}=event.meta||{};
    if(event.state==='sleep'){this.sprites.character.y=18;this.sprites.character.scale.set(1,.93)}
    else if(event.state==='sad'){this.sprites.character.y=8;this.sprites.character.scale.set(.98,.96)}
    else if(event.state==='pet')this.petReaction(action,repeat);
    else if(event.state==='eat')this.eat();
    else if(event.state==='happy'){this.lastReaction='happy';this.burstStars(7);this.recoverTimer=setTimeout(()=>this.stateMachine.settle(),1050)}
    else if(event.state==='excited'){this.lastReaction='excited';this.burstStars(10);this.recoverTimer=setTimeout(()=>this.stateMachine.settle(),1450)}
  }
  tick(ticker){const dt=Math.min(.05,ticker.deltaMS/1000);this.elapsed+=dt;this.frameElapsed+=dt;this.stateClock+=dt;this.autonomyClock+=dt;const{character,layers}=this.sprites;
    this.advanceFrames();
    if(this.mode==='idle'){const breath=Math.sin(this.elapsed*2.05),sway=Math.sin(this.elapsed*.92),ear=Math.sin(this.elapsed*1.23);character.scale.set(1+breath*.004,1+breath*.009);character.rotation=sway*.006;layers.body.y=breath*1.9;layers.earLeft.y=ear*2.5;layers.earRight.y=-ear*1.8;layers.earLeft.rotation=ear*.014;layers.earRight.rotation=-ear*.012;layers.tail.x=sway*2.2;layers.tail.rotation=sway*.018;if(this.elapsed>=this.nextBlink)this.blink();if(this.autonomyClock>=this.nextAutonomy)this.autonomous()}
    else if(this.mode==='happy'){const bounce=Math.abs(Math.sin(this.elapsed*7));character.y=-bounce*13;character.scale.set(1+bounce*.025,1-bounce*.018)}
    else if(this.mode==='excited'){const bounce=Math.abs(Math.sin(this.elapsed*10));character.y=-bounce*21;character.rotation=Math.sin(this.elapsed*9)*.025}
    else if(this.mode==='eat'){layers.body.y=Math.abs(Math.sin(this.elapsed*8))*7;character.rotation=Math.sin(this.elapsed*5)*.012}
    else if(this.mode==='sleep'){const breath=Math.sin(this.elapsed*.9);character.scale.y=.93+breath*.009;character.y=18+breath*1.2}
    else if(this.mode==='sad'){character.y=8+Math.sin(this.elapsed*1.1);character.rotation=Math.sin(this.elapsed*.7)*.006}
    else if(this.mode==='pet')this.tickPet(character);
    this.tickAutonomy(dt);this.tickParticles(dt);
    if(this.stateClock>2.5&&['idle','sleep','sad'].includes(this.mode)){this.stateClock=0;this.stateMachine.sync('needs')}
  }
  advanceFrames(){const count=this.sprites.frameCount(this.mode),fps=this.sprites.fps(this.mode);if(count>1&&this.frameElapsed>=1/fps){this.frameElapsed=0;this.sprites.setFrame(this.mode,this.sprites.frame+1)}}
  blink(){if(this.mode!=='idle'||this.blinkActive)return;this.blinkActive=true;this.blinkCount++;this.sprites.pose('blink');clearTimeout(this.blinkTimer);this.blinkTimer=setTimeout(()=>{this.blinkActive=false;if(this.mode==='idle'){this.sprites.pose('idle');this.elapsed=0;this.nextBlink=this.randomBlink()}},160+Math.random()*80)}
  petReaction(action,repeat){const phase=((repeat-1)%3)+1,kind=action==='petSpecial'?'ear':action==='petBelly'?'belly':'head';this.lastReaction=`${kind}-${phase}`;this.reactionHistory.push(this.lastReaction);this.reactionHistory=this.reactionHistory.slice(-8);const c=this.sprites.character;
    if(kind==='head'){if(phase===1){c.y=-9;this.burstStars(5)}else if(phase===2){c.x=-9;c.scale.set(1.04,.98)}else{c.x=24;c.rotation=.035}}
    if(kind==='ear'){this.sprites.pose('idle');const amount=[.11,.16,.22][phase-1];this.sprites.layers.earLeft.rotation=-amount;this.sprites.layers.earRight.rotation=amount;if(phase===3)c.x=-15}
    if(kind==='belly'){if(phase===1)c.rotation=-.03;else if(phase===2)c.scale.set(.94,1.04);else{c.x=-22;c.rotation=-.045}}
    const recover=kind==='head'&&phase<3?()=>this.stateMachine.transition('happy','pet:success',{force:true}):()=>this.stateMachine.settle();this.recoverTimer=setTimeout(recover,phase===3?1350:1050)
  }
  tickPet(character){const[kind,raw]=this.lastReaction.split('-'),phase=Number(raw||1);if(kind==='ear'){const base=[.11,.16,.22][phase-1],twitch=Math.sin(this.elapsed*18)*(.025+phase*.012);this.sprites.layers.earLeft.rotation=-base-twitch;this.sprites.layers.earRight.rotation=base+twitch}else if(phase===1)character.y-=Math.sin(this.elapsed*6)*.12;else if(phase===2)character.rotation=Math.sin(this.elapsed*4)*.025}
  eat(){this.lastReaction='eat';this.burstStars(6,0xffd36e);this.recoverTimer=setTimeout(()=>this.stateMachine.transition('happy','eat:complete',{force:true}),1250)}
  burstStars(count,color=0xffd86b){for(let i=0;i<count;i++){const g=new PIXI.Graphics().circle(0,0,5+(i%3)).fill({color,alpha:.95});g.eventMode='none';g.position.set(-80+Math.random()*160,-90+Math.random()*70);g.rotation=Math.random()*Math.PI;this.scene.character.addChild(g);this.particles.push({node:g,vx:-18+Math.random()*36,vy:-35-Math.random()*35,life:.7+Math.random()*.45})}}
  tickParticles(dt){this.particles=this.particles.filter(p=>{p.life-=dt;p.node.x+=p.vx*dt;p.node.y+=p.vy*dt;p.node.rotation+=dt*3;p.node.alpha=Math.max(0,p.life);if(p.life<=0){p.node.destroy();return false}return true})}
  autonomous(){if(this.mode!=='idle')return;this.autonomyClock=0;this.nextAutonomy=this.randomAutonomy();const choices=['look','yawn','groom','wander','wait'],choice=choices[Math.floor(Math.random()*choices.length)];this.activeBehavior=choice;this.activeBehaviorCount++;this.idleVariationCount++;const c=this.sprites.character;
    if(choice==='look'){c.x=8;c.scale.x=.985}
    else if(choice==='yawn'){this.sprites.pose('sleep');c.y=7;c.scale.y=.96}
    else if(choice==='groom'){this.sprites.pose('pet');c.rotation=-.025}
    else if(choice==='wander'){this.targetX=-18+Math.random()*36}
    else if(choice==='wait'){c.y=-5;c.scale.set(1.025)}
    setTimeout(()=>{if(this.mode==='idle'){this.activeBehavior='';this.sprites.pose('idle');c.position.set(0,0);c.scale.set(1);c.rotation=0;this.elapsed=0;this.nextBlink=this.randomBlink()}},1100+Math.random()*900)
  }
  tickAutonomy(dt){if(this.activeBehavior==='wander')this.sprites.character.x+=(this.targetX-this.sprites.character.x)*Math.min(1,dt*3.5)}
  react(action,result={}){return this.stateMachine.fromInteraction(action,result)}
  considerPassive(){if(this.mode==='idle'&&this.autonomyClock>=this.nextAutonomy)this.autonomous()}
  destroy(){clearTimeout(this.recoverTimer);clearTimeout(this.blinkTimer);this.unsubscribe?.();this.particles.forEach(p=>p.node.destroy());this.scene.app.ticker.remove(this.tick)}
  debug(){return{mode:this.mode,state:this.stateMachine.debug(),blinkCount:this.blinkCount,idleVariationCount:this.idleVariationCount,activeBehaviorCount:this.activeBehaviorCount,activeBehavior:this.activeBehavior,lastReaction:this.lastReaction,reactionHistory:[...this.reactionHistory],nextBlink:this.nextBlink,nextAutonomy:this.nextAutonomy}}
}
window.FluffyPixiAnimation={NuotuanAnimation};
})();
