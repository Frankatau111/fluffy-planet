(function(){
class NuotuanAnimation{
  constructor(scene,sprites){this.scene=scene;this.sprites=sprites;this.mode='idle';this.elapsed=0;this.recoverTimer=0;this.nextBlink=this.randomBlink();this.tick=this.tick.bind(this);scene.app.ticker.add(this.tick)}
  randomBlink(){return 3+Math.random()*5}
  tick(ticker){const dt=ticker.deltaMS/1000;this.elapsed+=dt;const{character,layers}=this.sprites;if(this.mode==='idle'||this.mode==='blink'){const breath=Math.sin(this.elapsed*2.05),slow=Math.sin(this.elapsed*1.15);layers.body.y=breath*1.8;layers.body.scale.y=1+breath*.006;layers.body.scale.x=1-breath*.0025;layers.earLeft.y=slow*2.4;layers.earRight.y=-slow*1.7;layers.earLeft.rotation=slow*.012;layers.earRight.rotation=-slow*.01;layers.tail.x=slow*2.1;layers.tail.rotation=slow*.016;if(this.mode==='idle'&&this.elapsed>=this.nextBlink)this.blink()}else if(this.mode==='sleep'){const breath=Math.sin(this.elapsed*.9);layers.body.scale.y=1+breath*.009;layers.body.y=12+breath*1.1}else if(this.mode==='approach'){character.x+=(0-character.x)*Math.min(1,dt*4)}}
  blink(){this.mode='blink';this.sprites.pose('blink');clearTimeout(this.recoverTimer);this.recoverTimer=setTimeout(()=>{if(this.mode==='blink')this.idle()},180)}
  idle(){this.mode='idle';this.elapsed=0;this.nextBlink=this.randomBlink();this.sprites.pose('idle');this.sprites.character.position.set(0,0);this.sprites.character.scale.set(1);this.sprites.character.rotation=0}
  react(action,result={}){clearTimeout(this.recoverTimer);if(action==='sleep'||result.animation==='sleep')return this.sleep();if(action==='petSpecial')return this.ear();if(action==='petBelly')return this.shy();if(action==='approach'||result.animation==='cuddle')return this.approach();return this.happy(result.repeat>=3?1500:950)}
  happy(duration=950){this.mode='happy';this.sprites.pose('happy');this.sprites.character.scale.set(1.035,.975);this.recoverTimer=setTimeout(()=>this.idle(),duration)}
  ear(){this.mode='ear';this.sprites.pose('idle');this.sprites.layers.earLeft.rotation=-.1;this.sprites.layers.earRight.rotation=.1;this.recoverTimer=setTimeout(()=>this.idle(),900)}
  shy(){this.mode='shy';this.sprites.pose('pet');this.sprites.character.rotation=-.025;this.recoverTimer=setTimeout(()=>this.idle(),1150)}
  sleep(){this.mode='sleep';this.elapsed=0;this.sprites.pose('sleep');this.sprites.layers.body.y=12}
  approach(){this.mode='approach';this.sprites.pose('happy');this.sprites.character.x=-16;this.recoverTimer=setTimeout(()=>this.idle(),1200)}
  destroy(){clearTimeout(this.recoverTimer);this.scene.app.ticker.remove(this.tick)}
}
window.FluffyPixiAnimation={NuotuanAnimation};
})();
