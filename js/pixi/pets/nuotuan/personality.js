(function(){
'use strict';
const MEMORY_KEY='fluffy_nuotuan_memory_v1';
const TRAITS=Object.freeze({clinginess:90,curiosity:70,mischief:40,reserve:20});
const BEHAVIORS=Object.freeze({
  approach:{trait:'clinginess',base:1.25},
  explore:{trait:'curiosity',base:1.05},
  sneakToy:{trait:'mischief',base:.72},
  lookWindow:{trait:'curiosity',base:.82},
  findTreasure:{trait:'curiosity',base:.78},
  groom:{trait:'reserve',base:.7},
  wait:{trait:'clinginess',base:.88}
});
const LINES=[
  {id:'night-cling',times:['night'],trait:'clinginess',min:70,text:'你终于回来啦，我等你好久了。'},
  {id:'evening-cling',times:['evening'],trait:'clinginess',min:70,text:'天快黑了，今天可以多陪我一会儿吗？'},
  {id:'morning-cling',times:['morning'],trait:'clinginess',min:70,text:'早上第一眼就看到你，今天一定会很好。'},
  {id:'day-cling',times:['day'],trait:'clinginess',min:70,text:'我只是刚好走到你旁边，不是在等抱抱喔。'},
  {id:'idle-cling-1',states:['idle'],trait:'clinginess',min:70,text:'你不说话也没关系，我挨着你就好。'},
  {id:'idle-cling-2',states:['idle'],trait:'clinginess',min:70,text:'我把离你最近的位置留给自己啦。'},
  {id:'happy-cling',states:['happy','excited'],trait:'clinginess',min:70,text:'嘿嘿，你一来，我的尾巴就藏不住开心。'},
  {id:'sleep-soft',states:['sleep'],text:'我先眯一小会儿，你还在旁边吧？'},
  {id:'sad-soft',states:['sad'],text:'我只是有点没精神，陪我坐一下就会好。'},
  {id:'eat-curious',states:['eat'],trait:'curiosity',min:55,text:'这一口是什么味道？我要慢慢研究一下。'},
  {id:'pet-one',actions:['petHead','petSpecial','petBelly'],repeats:[1],text:'唔……我记住你的手心了。'},
  {id:'pet-two',actions:['petHead','petSpecial','petBelly'],repeats:[2],trait:'clinginess',min:70,text:'再靠近一点点，这样比较方便撒娇。'},
  {id:'pet-three',actions:['petHead','petSpecial','petBelly'],repeats:[3],trait:'reserve',max:35,text:'等、等一下，我的脸要变红啦。'},
  {id:'feed-memory',actions:['feed'],text:'我记得你上次喂我的味道，这次也一样香。'},
  {id:'play-mischief',actions:['play'],trait:'mischief',min:30,text:'这次我会乖乖玩……大概会吧。'},
  {id:'approach',behaviors:['approach'],trait:'clinginess',min:70,text:'我走近一点，你就不会突然不见了。'},
  {id:'explore',behaviors:['explore'],trait:'curiosity',min:55,text:'那边刚才好像动了一下，我去看看。'},
  {id:'toy',behaviors:['sneakToy'],trait:'mischief',min:30,text:'嘘，我只偷偷玩一下，不会弄乱的。'},
  {id:'window',behaviors:['lookWindow'],trait:'curiosity',min:55,text:'窗外的云换形状了，你要一起看吗？'},
  {id:'treasure',behaviors:['findTreasure'],trait:'curiosity',min:55,text:'我发现了一颗小石头，它像一颗迷你星球。'},
  {id:'groom',behaviors:['groom'],text:'等我把毛毛整理好，就来贴着你。'},
  {id:'wait',behaviors:['wait'],trait:'clinginess',min:70,text:'我在这里等你回应，没有着急喔。'},
  {id:'night-normal',times:['night'],text:'今天也辛苦啦～'},
  {id:'evening-normal',times:['evening'],text:'晚霞落进房间里了，好暖。'},
  {id:'morning-normal',times:['morning'],text:'早安，我刚刚数了三朵云。'},
  {id:'day-normal',times:['day'],text:'今天的房间里，好像藏着新鲜事。'}
];
const OPENING=[
  {id:'window',behavior:'lookWindow',text:'糯团正在看窗外，听见你的脚步才回过头。'},
  {id:'carrot',behavior:'sleep',text:'糯团抱着胡萝卜睡着了，耳朵轻轻动了一下。'},
  {id:'stone',behavior:'findTreasure',text:'糯团发现了一颗小石头，正认真地等你鉴定。'}
];
function emptyMemory(){return{lastSeen:0,lastInteraction:0,lastFeed:0,recentDialogueIds:[],recentBehaviors:[],dialogueCursor:0,approachCount:0,totalActiveBehaviors:0}}
function readMemory(){try{return{...emptyMemory(),...JSON.parse(localStorage.getItem(MEMORY_KEY)||'{}')}}catch(_){return emptyMemory()}}
function chinaTime(){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(p=>[p.type,p.value])),hour=Number(parts.hour);return hour>=6&&hour<10?'morning':hour>=10&&hour<17?'day':hour>=17&&hour<20?'evening':'night'}
class NuotuanPersonality{
  constructor(){this.traits=TRAITS;this.memory=readMemory();this.previousSeen=this.memory.lastSeen;this.awayMs=this.previousSeen?Math.max(0,Date.now()-this.previousSeen):0;this.sessionStarted=Date.now();this.sessionApproachCount=0;this.memory.lastSeen=Date.now();this.save();this.onVisibility=()=>{if(document.visibilityState==='hidden')this.markSeen()};document.addEventListener('visibilitychange',this.onVisibility);window.addEventListener('pagehide',this.onVisibility)}
  save(){try{localStorage.setItem(MEMORY_KEY,JSON.stringify(this.memory))}catch(_){}}
  markSeen(){this.memory.lastSeen=Date.now();this.save()}
  recordInteraction(action){const now=Date.now();this.memory.lastInteraction=now;if(action==='feed')this.memory.lastFeed=now;this.markSeen()}
  time(){return chinaTime()}
  chooseBehavior(context={}){const recent=this.memory.recentBehaviors.slice(-5),age=Date.now()-this.sessionStarted;if(age>35000&&!this.sessionApproachCount){this.recordBehavior('approach');return'approach'}let pool=Object.entries(BEHAVIORS).filter(([name])=>!recent.includes(name));if(!pool.length)pool=Object.entries(BEHAVIORS);const weighted=pool.map(([name,def])=>{const trait=this.traits[def.trait]??50;let score=def.base*(.45+trait/100);if(name==='approach'&&this.traits.clinginess>=80)score*=1.45;if(name==='explore'&&this.traits.curiosity>=65)score*=1.25;if(name==='sneakToy'&&this.traits.mischief<50)score*=.72;if(context.state==='sad'&&name==='approach')score*=1.4;return{name,score}});let cursor=Math.random()*weighted.reduce((sum,item)=>sum+item.score,0),chosen=weighted.find(item=>(cursor-=item.score)<=0)?.name||weighted[0].name;this.recordBehavior(chosen);return chosen}
  recordBehavior(name){this.memory.recentBehaviors=[...this.memory.recentBehaviors,name].slice(-5);this.memory.totalActiveBehaviors++;if(name==='approach'){this.memory.approachCount++;this.sessionApproachCount++}this.markSeen()}
  dialogue(context={}){const state=context.state||'idle',time=context.time||this.time(),action=context.action||'',behavior=context.behavior||'',repeat=((Number(context.repeat||1)-1)%3)+1;let candidates=LINES.filter(line=>(!line.states||line.states.includes(state))&&(!line.times||line.times.includes(time))&&(!line.actions||line.actions.includes(action))&&(!line.behaviors||line.behaviors.includes(behavior))&&(!line.repeats||line.repeats.includes(repeat))&&(!line.trait||(this.traits[line.trait]>=Number(line.min||0)&&this.traits[line.trait]<=Number(line.max??100))));const specific=candidates.filter(line=>line.actions||line.behaviors);if(action||behavior)candidates=specific.length?specific:candidates;if(!candidates.length)candidates=LINES.filter(line=>line.times?.includes(time)&&!line.actions&&!line.behaviors);const recent=this.memory.recentDialogueIds.slice(-5),fresh=candidates.filter(line=>!recent.includes(line.id));if(fresh.length)candidates=fresh;candidates.sort((a,b)=>a.id.localeCompare(b.id));const chosen=candidates[this.memory.dialogueCursor%candidates.length]||LINES[0];this.memory.dialogueCursor++;this.memory.recentDialogueIds=[...this.memory.recentDialogueIds,chosen.id].slice(-8);this.markSeen();return{id:chosen.id,text:chosen.text,state,time,traits:this.traits}}
  openingEvent(force=false){if(this.awayMs>=18*60*60*1000)return{id:'missed-you',behavior:'approach',text:'你昨天没有来看我，我有一点点想你……',awayMs:this.awayMs};if(!force&&Math.random()>.68)return null;const index=(new Date().getDate()+this.memory.dialogueCursor)%OPENING.length,event=OPENING[index];this.memory.dialogueCursor++;this.markSeen();return{...event,awayMs:this.awayMs}}
  debug(){return{traits:{...this.traits},time:this.time(),awayMs:this.awayMs,sessionAge:Date.now()-this.sessionStarted,sessionApproachCount:this.sessionApproachCount,memory:{...this.memory}}}
  destroy(){document.removeEventListener('visibilitychange',this.onVisibility);window.removeEventListener('pagehide',this.onVisibility)}
}
window.NuotuanPersonality={NuotuanPersonality,TRAITS,BEHAVIORS,MEMORY_KEY};
})();
