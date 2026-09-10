(function(){
const PETS=[
 {id:'corgi',name:'奶油柯基',nick:'团团',desc:'活泼、黏人、贪吃',traits:['active','clingy','foodie'],body:'#F2BD72',patch:'#FFF4DF',ear:'point',tail:'short'},
 {id:'shiba',name:'赤柴',nick:'柴宝',desc:'傲娇、独立',traits:['proud','independent'],body:'#D8904C',patch:'#FFF0D8',ear:'point',tail:'curl'},
 {id:'cat',name:'布丁猫',nick:'布丁',desc:'黏人、爱睡觉',traits:['clingy','sleepy'],body:'#F1C98A',patch:'#FFF5E6',ear:'cat',tail:'long'},
 {id:'graycat',name:'银灰猫',nick:'银子',desc:'高冷、慢热',traits:['cool','shy'],body:'#AAB2BD',patch:'#F1F3F5',ear:'cat',tail:'long'},
 {id:'rabbit',name:'草莓兔',nick:'莓莓',desc:'胆小、爱撒娇',traits:['timid','clingy'],body:'#F7D9D9',patch:'#FFF8F8',ear:'rabbit',tail:'puff'},
 {id:'bear',name:'焦糖熊',nick:'焦糖',desc:'温吞、贪睡',traits:['gentle','sleepy'],body:'#B77B53',patch:'#E8C4A7',ear:'round',tail:'puff'},
 {id:'hamster',name:'奶茶仓鼠',nick:'奶茶',desc:'超级贪吃、精力旺盛',traits:['foodie','active'],body:'#D9A76D',patch:'#FFF0D8',ear:'round',tail:'none'},
 {id:'panda',name:'糯米熊猫',nick:'糯米',desc:'呆萌、慢吞吞',traits:['silly','gentle'],body:'#F7F7F7',patch:'#2F3338',ear:'round',tail:'puff'}
];
function petSVG(def,outfit={hat:'none-hat',clothes:'none-clothes',accessory:'none-accessory'}){
 const panda=def.id==='panda', face=panda?'#F7F7F7':def.body;
 let ears='';
 if(def.ear==='rabbit')ears=`<g class="ears"><ellipse cx="78" cy="53" rx="17" ry="49" fill="${def.body}" transform="rotate(-13 78 53)"/><ellipse cx="142" cy="53" rx="17" ry="49" fill="${def.body}" transform="rotate(13 142 53)"/><ellipse cx="78" cy="53" rx="8" ry="36" fill="#F3AFC0" transform="rotate(-13 78 53)"/><ellipse cx="142" cy="53" rx="8" ry="36" fill="#F3AFC0" transform="rotate(13 142 53)"/></g>`;
 else if(def.ear==='point'||def.ear==='cat')ears=`<g class="ears"><path d="M55 78Q48 26 88 56Z" fill="${def.body}"/><path d="M165 78Q172 26 132 56Z" fill="${def.body}"/><path d="M62 66Q59 43 79 57Z" fill="#EFA8AB"/><path d="M158 66Q161 43 141 57Z" fill="#EFA8AB"/></g>`;
 else ears=`<g class="ears"><circle cx="66" cy="68" r="25" fill="${panda?'#2F3338':def.body}"/><circle cx="154" cy="68" r="25" fill="${panda?'#2F3338':def.body}"/><circle cx="66" cy="68" r="13" fill="${panda?'#555B63':'#D99594'}"/><circle cx="154" cy="68" r="13" fill="${panda?'#555B63':'#D99594'}"/></g>`;
 let tail='';
 if(def.tail==='curl')tail=`<path class="tail" d="M176 145Q215 120 199 91Q191 75 180 92Q196 97 189 111Q182 122 169 123" fill="none" stroke="${def.body}" stroke-width="17" stroke-linecap="round"/>`;
 if(def.tail==='long')tail=`<path class="tail" d="M172 151Q211 156 205 119Q202 97 214 91" fill="none" stroke="${def.body}" stroke-width="17" stroke-linecap="round"/>`;
 if(def.tail==='short')tail=`<path class="tail" d="M174 143Q199 132 204 146Q200 162 176 157Z" fill="${def.body}"/>`;
 if(def.tail==='puff')tail=`<circle class="tail" cx="188" cy="147" r="21" fill="${def.body}"/>`;
 let marks='';
 if(['corgi','shiba'].includes(def.id))marks=`<path d="M82 77Q110 57 138 77Q132 119 110 133Q88 119 82 77" fill="${def.patch}"/>`;
 if(def.id==='hamster')marks=`<ellipse cx="74" cy="113" rx="25" ry="22" fill="${def.patch}"/><ellipse cx="146" cy="113" rx="25" ry="22" fill="${def.patch}"/>`;
 if(panda)marks=`<ellipse cx="83" cy="100" rx="21" ry="28" fill="#2F3338" transform="rotate(18 83 100)"/><ellipse cx="137" cy="100" rx="21" ry="28" fill="#2F3338" transform="rotate(-18 137 100)"/>`;
 const clothes={
  sailor:`<path d="M65 151Q110 178 155 151L149 194Q110 209 71 194Z" fill="#F8F8FC"/><path d="M72 155L94 176 110 162 126 176 148 155" fill="none" stroke="#5481B5" stroke-width="8"/>`,
  hoodie:`<path d="M63 151Q110 176 157 151L154 196Q110 211 66 196Z" fill="#F399AE"/><path d="M88 159Q110 147 132 159" fill="none" stroke="#FFD7E0" stroke-width="8"/>`,
  overalls:`<path d="M74 157Q110 174 146 157V198Q110 210 74 198Z" fill="#72AFD0"/><path d="M80 150L96 178M140 150L124 178" stroke="#407FA4" stroke-width="8"/>`,
  bee:`<path d="M64 153Q110 175 156 153L151 195Q110 210 69 195Z" fill="#FFD65C"/><path d="M72 168Q110 182 148 168M70 185Q110 198 150 185" stroke="#4D443C" stroke-width="7"/><ellipse cx="61" cy="170" rx="20" ry="29" fill="#DFF3FF"/><ellipse cx="159" cy="170" rx="20" ry="29" fill="#DFF3FF"/>`,
  dino:`<path d="M63 151Q110 176 157 151L153 198Q110 211 67 198Z" fill="#65C89A"/><path d="M87 158L96 143 106 160 116 143 126 161 136 148" fill="#FFE17A" stroke="#3FA77A" stroke-width="3"/>`,
  pajamas:`<path d="M64 151Q110 176 156 151L153 198Q110 210 67 198Z" fill="#9EAFEA"/><circle cx="84" cy="177" r="4" fill="#FFF4A8"/><circle cx="132" cy="188" r="4" fill="#FFF4A8"/><path d="M110 161V201" stroke="#E6EAFF" stroke-width="3"/>`,
  raincoat:`<path d="M62 149Q110 177 158 149L153 200Q110 212 67 200Z" fill="#FFD84E"/><path d="M110 160V203" stroke="#E2A92C" stroke-width="4"/><circle cx="101" cy="176" r="3" fill="#fff"/>`
 };
 const hats={
  flower:`<g transform="translate(147 62)"><circle r="9" fill="#FFD45F"/><circle cy="-12" r="9" fill="#FFF7A8"/><circle cx="11" cy="-4" r="9" fill="#FFF7A8"/><circle cx="7" cy="10" r="9" fill="#FFF7A8"/><circle cx="-7" cy="10" r="9" fill="#FFF7A8"/><circle cx="-11" cy="-4" r="9" fill="#FFF7A8"/></g>`,
  strawberry:`<path d="M78 62Q110 28 142 62Q135 83 110 84Q85 83 78 62" fill="#F35D75"/><path d="M102 37L110 23 117 37 132 31 126 46H94L88 31Z" fill="#6BC984"/>`,
  cap:`<path d="M72 62Q76 30 117 34Q143 38 147 63Z" fill="#67A8DE"/><path d="M111 61Q151 54 164 67Q139 73 111 68Z" fill="#4E8FC8"/>`,
  crown:`<path d="M78 61L84 29 101 47 112 22 126 47 143 29 148 61Z" fill="#FFD75E" stroke="#E9A933" stroke-width="4"/>`,
  beret:`<ellipse cx="110" cy="58" rx="50" ry="21" fill="#E9C58F"/><path d="M75 58Q110 25 148 58" fill="#F1D5A9"/><path d="M110 36Q116 27 123 32" fill="none" stroke="#B68E62" stroke-width="5"/>`,
  nightcap:`<path d="M73 64Q100 20 145 48Q137 68 113 72Z" fill="#8EA7E2"/><circle cx="148" cy="47" r="12" fill="#FFF4CA"/><path d="M82 50Q110 64 139 54" stroke="#FFF4CA" stroke-width="7"/>`,
  frog:`<path d="M70 66Q74 33 110 34Q146 33 150 66Z" fill="#6BCB7C"/><circle cx="87" cy="39" r="14" fill="#6BCB7C"/><circle cx="133" cy="39" r="14" fill="#6BCB7C"/><circle cx="87" cy="39" r="5" fill="#26382B"/><circle cx="133" cy="39" r="5" fill="#26382B"/>`,
  bearhat:`<path d="M70 67Q73 31 110 31Q147 31 150 67Z" fill="#B9825D"/><circle cx="79" cy="37" r="15" fill="#B9825D"/><circle cx="141" cy="37" r="15" fill="#B9825D"/>`
 };
 const accessories={
  bow:`<g transform="translate(110 151)"><path d="M-4 0Q-30-18-34 5Q-28 24-4 7Z" fill="#F07FA1"/><path d="M4 0Q30-18 34 5Q28 24 4 7Z" fill="#F07FA1"/><circle r="8" fill="#D85F87"/></g>`,
  scarf:`<path d="M71 145Q110 161 149 145" fill="none" stroke="#E97E68" stroke-width="13"/><path d="M136 151L151 190 132 184Z" fill="#E97E68"/>`,
  bell:`<path d="M74 145Q110 159 146 145" fill="none" stroke="#7BC0A3" stroke-width="8"/><circle cx="110" cy="158" r="9" fill="#F5C94F"/>`,
  glasses:`<g fill="none" stroke="#514844" stroke-width="4"><circle cx="84" cy="106" r="21"/><circle cx="136" cy="106" r="21"/><path d="M105 105H115"/></g>`,
  sunglasses:`<g fill="#333942" stroke="#333942" stroke-width="4"><path d="M62 91H105L100 113Q84 128 69 112Z"/><path d="M115 91H158L151 112Q136 128 120 113Z"/><path d="M103 99H117"/></g>`,
  backpack:`<path d="M52 153Q33 158 40 190H68V157Z" fill="#E49760"/><path d="M45 160Q54 144 66 153" fill="none" stroke="#9B613D" stroke-width="5"/>`,
  necklace:`<path d="M76 146Q110 170 144 146" fill="none" stroke="#F2C44C" stroke-width="4"/><path d="M110 163l7 9-7 9-7-9Z" fill="#75B9E9"/>`
 };
 const legs=def.id==='hamster'?'':`<ellipse class="leg-left" cx="82" cy="194" rx="21" ry="13" fill="${def.body}"/><ellipse class="leg-right" cx="138" cy="194" rx="21" ry="13" fill="${def.body}"/>`;
 return `<svg viewBox="0 0 220 220" aria-label="${def.name}">${tail}${ears}<g class="body"><ellipse cx="110" cy="158" rx="67" ry="53" fill="${def.body}"/>${legs}${clothes[outfit.clothes]||''}</g><g class="head"><ellipse cx="110" cy="105" rx="68" ry="66" fill="${face}"/>${marks}<g class="eyes"><ellipse cx="84" cy="105" rx="7" ry="9" fill="#463A37"/><ellipse cx="136" cy="105" rx="7" ry="9" fill="#463A37"/><circle cx="82" cy="102" r="2.4" fill="#fff"/><circle cx="134" cy="102" r="2.4" fill="#fff"/></g><ellipse cx="65" cy="126" rx="16" ry="7" fill="#F5A7AE" opacity=".6"/><ellipse cx="155" cy="126" rx="16" ry="7" fill="#F5A7AE" opacity=".6"/><path d="M104 120Q110 126 116 120M110 124Q103 136 96 128M110 124Q117 136 124 128" fill="none" stroke="#594844" stroke-width="3" stroke-linecap="round"/>${accessories[outfit.accessory]||''}${hats[outfit.hat]||''}</g></svg>`;
}
window.FluffyPets={PETS,petSVG};
})();
