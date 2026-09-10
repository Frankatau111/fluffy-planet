(function(){
const ITEMS=[
 ['none-hat','hat','不戴帽子','✨',0],['flower','hat','小花花','🌼',65],['strawberry','hat','草莓帽','🍓',80],['cap','hat','鸭舌帽','🧢',100],['crown','hat','小皇冠','👑',180],['beret','hat','奶油贝雷帽','🎨',120],['nightcap','hat','星星睡帽','🌙',150],['frog','hat','青蛙帽','🐸',165],['bearhat','hat','小熊帽','🧸',175],
 ['none-clothes','clothes','不穿衣服','✨',0],['sailor','clothes','海军服','⚓',130],['hoodie','clothes','粉色卫衣','🩷',160],['overalls','clothes','牛仔背带裤','🩵',190],['bee','clothes','蜜蜂服','🐝',220],['dino','clothes','恐龙服','🦖',210],['pajamas','clothes','星星睡衣','🌌',180],['raincoat','clothes','柠檬雨衣','🧥',200],
 ['none-accessory','accessory','不戴配饰','✨',0],['bow','accessory','蝴蝶结','🎀',90],['scarf','accessory','小围巾','🧣',110],['bell','accessory','铃铛项圈','🔔',140],['glasses','accessory','圆圆眼镜','🤓',170],['sunglasses','accessory','酷酷墨镜','🕶️',190],['backpack','accessory','小书包','🎒',210],['necklace','accessory','星星项链','💎',230]
].map(([id,cat,name,emoji,price])=>({id,cat,name,emoji,price}));
const FOODS=[['strawberry','🍓','草莓',3,12,5],['chicken','🍗','香香鸡腿',7,28,2],['cake','🍰','小蛋糕',9,17,15],['milk','🥛','热牛奶',5,13,3],['rice','🍙','软软饭团',6,23,3],['carrot','🥕','脆胡萝卜',4,16,6]].map(([id,emoji,name,cost,hunger,fun])=>({id,emoji,name,cost,hunger,fun}));
const TOYS=[{id:'ball',emoji:'🎾',name:'弹弹球',fun:24,energy:-10,anim:'jump'},{id:'wand',emoji:'🪄',name:'逗宠棒',fun:28,energy:-12,anim:'spin'},{id:'mouse',emoji:'🐭',name:'发条小鼠',fun:21,energy:-8,anim:'run'}];
const ACHIEVEMENTS=[
 {id:'meet',icon:'🏡',name:'第一次见面',desc:'领养一只宠物',test:s=>s.adopted},
 {id:'first-feed',icon:'🍓',name:'第一口好吃的',desc:'第一次喂食',test:s=>(s.counts.feed||0)>=1},
 {id:'pet10',icon:'🫳',name:'摸摸达人',desc:'摸摸 10 次',test:s=>(s.counts.head||0)>=10},
 {id:'pet100',icon:'💞',name:'摸摸大师',desc:'摸摸 100 次',test:s=>(s.counts.head||0)>=100},
 {id:'love50',icon:'💗',name:'心有灵犀',desc:'亲密度达到 50',test:s=>s.love>=50},
 {id:'love100',icon:'💖',name:'最好的朋友',desc:'亲密度达到 100',test:s=>s.love>=100},
 {id:'first-buy',icon:'🛍️',name:'第一件礼物',desc:'购买第一件衣服',test:s=>(s.counts.buy||0)>=1},
 {id:'own10',icon:'🎀',name:'时尚收藏家',desc:'拥有 10 件服装',test:s=>s.owned.length>=10},
 {id:'streak7',icon:'📅',name:'天天见面',desc:'连续签到 7 天',test:s=>s.maxStreak>=7},
 {id:'interact100',icon:'🌟',name:'形影不离',desc:'互动 100 次',test:s=>s.totalInteractions>=100}
];
window.FluffyItems={ITEMS,FOODS,TOYS,ACHIEVEMENTS};
})();
