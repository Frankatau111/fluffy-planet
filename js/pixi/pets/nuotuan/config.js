(function(){
const base='./assets/pets/nuotuan/';
window.NuotuanPixiConfig={
  id:'nutuan',
  states:{
    idle:{frames:[`${base}idle.webp`],fps:1},blink:{frames:[`${base}blink.webp`],fps:1},happy:{frames:[`${base}happy.webp`],fps:1},sleep:{frames:[`${base}sleep.webp`],fps:1},pet:{frames:[`${base}pet.webp`],fps:1},
    eat:{fallback:'happy'},sad:{fallback:'pet'},excited:{fallback:'happy'},walk:{frames:[],fallback:'idle',fps:9}
  },
  designSize:640,
  hitAreas:{head:{x:-145,y:-220,width:290,height:145},eyes:{x:-92,y:-112,width:184,height:76},earLeft:{x:-300,y:-175,width:145,height:190},earRight:{x:155,y:-175,width:145,height:190},belly:{x:-135,y:-25,width:270,height:220},tail:{x:175,y:70,width:190,height:220}},
  partFrames:{earLeft:{x:0,y:90,width:225,height:310},earRight:{x:405,y:100,width:235,height:315},tail:{x:425,y:350,width:175,height:205},eyes:{x:220,y:225,width:200,height:120}}
};
})();
