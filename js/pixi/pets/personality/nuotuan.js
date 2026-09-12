(function(){
'use strict';
const config=window.FluffyPersonalities.register({
  id:'nutuan',name:'糯团',traits:{clinginess:90,curiosity:70,mischief:40,reserve:20},activeHours:['morning','evening','night'],likedInteractions:['petHead','petSpecial','sleep'],dislikedInteractions:['clean'],representativeAction:'主动靠近主人',memoryKey:'fluffy_nuotuan_memory_v1',forceApproachAfter:35000,openingChance:.68,returnDialogue:'你昨天没有来看我，我有一点点想你……',
  behaviorWeights:{approach:95,explore:58,sneakToy:28,lookWindow:62,findTreasure:48,groom:35,wait:82},
  behaviorAnimations:{approach:'cuddle',explore:'cuddle',sneakToy:'happy',lookWindow:'cuddle',findTreasure:'cuddle',groom:'groom',wait:'cuddle'},
  openingEvents:[
    {id:'window',behavior:'lookWindow',text:'糯团正在看窗外，听见你的脚步才回过头。'},
    {id:'carrot',behavior:'sleep',text:'糯团抱着胡萝卜睡着了，耳朵轻轻动了一下。'},
    {id:'stone',behavior:'findTreasure',text:'糯团发现了一颗小石头，正认真地等你鉴定。'}
  ],
  eventDialogue:{approach:'我走近一点，你就不会突然不见了。',explore:'那边刚才好像动了一下，我去看看。',sneakToy:'嘘，我只偷偷玩一下，不会弄乱的。',lookWindow:'窗外的云换形状了，你要一起看吗？',findTreasure:'我发现了一颗小石头，它像一颗迷你星球。',groom:'等我把毛毛整理好，就来贴着你。',wait:'我在这里等你回应，没有着急喔。'},
  interactionDialogue:{liked:['唔……我记住你的手心了。','再靠近一点点，这样比较方便撒娇。','等、等一下，我的脸要变红啦。'],disliked:['水声小一点的话，我会努力勇敢。','可以牵着我再洗吗？']},
  contextLines:[
    {id:'night-cling',times:['night'],trait:'clinginess',min:70,text:'你终于回来啦，我等你好久了。'},
    {id:'evening-cling',times:['evening'],trait:'clinginess',min:70,text:'天快黑了，今天可以多陪我一会儿吗？'},
    {id:'morning-cling',times:['morning'],trait:'clinginess',min:70,text:'早上第一眼就看到你，今天一定会很好。'},
    {id:'happy-cling',states:['happy','excited'],trait:'clinginess',min:70,text:'嘿嘿，你一来，我的尾巴就藏不住开心。'},
    {id:'sleep-soft',states:['sleep','sleepy'],text:'我先眯一小会儿，你还在旁边吧？'},
    {id:'sad-soft',states:['sad','hungry'],text:'我只是有点没精神，陪我坐一下就会好。'},
    {id:'eat-curious',states:['eat'],trait:'curiosity',min:55,text:'这一口是什么味道？我要慢慢研究一下。'}
  ],
  dialogue:{
    greeting:['你回来啦……','我有乖乖等你。','可以再坐一会儿嘛？','你来了，房间就不空了。','今天也靠近一点点。'],
    time:['早上好……声音轻一点点。','阳光暖暖的，适合一起发呆。','下午也不要走太快喔。','天要黑了，可以挨着你吗？','晚安之前，再陪我一小会儿。'],
    needs:['肚子轻轻叫了一下……','水杯可以放近一点吗？','有一点无聊，但你在就好。','毛毛沾灰了……不要开大水声。','眼睛快要自己合上啦。'],
    petHead:['嘿嘿……','这里也喜欢。','你的手很暖。','再慢一点点。','我把耳朵放松啦。'],
    petSpecial:['云朵耳会记住你的手。','这里……可以再摸一下。','耳朵痒痒的，但很舒服。','轻轻的，我不害怕。','它们在替我说喜欢。'],
    feed:['牛奶的味道像晚安。','我会慢慢吃完的。','可以分一半给你。','谢谢……肚子暖了。','饼干屑要藏进枕头吗？'],
    play:['我先看你玩，好不好？','不要突然冲过来喔。','我追到啦……大概。','玩累了就靠着你。','这个球没有很大声。'],
    repeat:['还可以再摸一次。','这里也喜欢……','你没有要停，对吧？','我靠近一点，会更方便。','……没有了吗？'],
    relationship:['我还在学着相信你。','你的脚步声，我认得了。','有你在，我胆子大一点。','今天也想跟你待在一起。','那就再晚一点点睡。'],
    idle:['这个枕头分你一角。','我本来已经要睡了。','被窝里还留着位置。','我可以安静地陪你。','靠一下……就一下。']
  }
});
class NuotuanPersonality extends window.FluffyPersonalities.CharacterPersonality{constructor(){super(config)}}
window.NuotuanPersonality={NuotuanPersonality,TRAITS:config.traits,BEHAVIORS:config.behaviorWeights,MEMORY_KEY:config.memoryKey};
})();
