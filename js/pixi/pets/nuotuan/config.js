(function(){
const base='./assets/pets/nuotuan/';
window.NuotuanPixiConfig={
  id:'nutuan',
  assets:{idle:`${base}idle.webp`,blink:`${base}blink.webp`,sleep:`${base}sleep.webp`,happy:`${base}happy.webp`,pet:`${base}pet.webp`},
  designSize:640,
  hitAreas:{head:{x:-155,y:-220,width:310,height:205},earLeft:{x:-300,y:-175,width:145,height:190},earRight:{x:155,y:-175,width:145,height:190},belly:{x:-135,y:-15,width:270,height:230}},
  layerFrames:{earLeft:{x:0,y:90,width:225,height:310},earRight:{x:405,y:100,width:235,height:315},tail:{x:425,y:350,width:175,height:205}}
};
})();
