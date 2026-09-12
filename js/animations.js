(function(){
function play(id,name,duration=1200,action=name,result={}){
  if(id==='nutuan'&&window.FluffyPixi){if(!Object.keys(result).length){window.FluffyPixi.passive(name);return}window.FluffyPixi.react(action,result);return}
  const el=document.querySelector(`.pet-slot[data-pet="${id}"]`);if(!el)return;const cls=`react-${name}`;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),duration)
}
window.FluffyAnimations={play};
})();
