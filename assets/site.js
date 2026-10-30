/* Site behavior: menu, protected contact details, hardened forms, gallery lightbox. */
(function(){
"use strict";
var started=Date.now(),human=false;
["keydown","pointerdown","touchstart","scroll"].forEach(function(ev){
  window.addEventListener(ev,function(){human=true;},{once:true,passive:true});
});
function b(s){try{return atob(s);}catch(e){return "";}}

/* menu */
var ham=document.querySelector(".ham"),tray=document.getElementById("tray");
if(ham&&tray){
  ham.addEventListener("click",function(){
    var on=tray.classList.toggle("on");
    ham.setAttribute("aria-expanded",on?"true":"false");
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&tray.classList.contains("on")){tray.classList.remove("on");ham.setAttribute("aria-expanded","false");ham.focus();}
  });
}

/* email assembled at runtime */
document.querySelectorAll("[data-mu]").forEach(function(el){
  var addr=b(el.getAttribute("data-mu"))+String.fromCharCode(64)+b(el.getAttribute("data-md"));
  var a=document.createElement("a");a.href="mailto:"+addr;a.textContent=addr;
  el.replaceWith(a);
});

/* form endpoint pieces */
function endpoint(){
  var p=["aHR0cHM6Ly9mb3Jt","c3VibWl0LmNvL2Fq","YXgv"],l=["aW5m","bw=="],d=["ZXlldG9hZC5j","b20="];
  return b(p.join(""))+b(l.join(""))+String.fromCharCode(64)+b(d.join(""));
}

/* palette handoff from the Color Studio */
try{
  var q=new URLSearchParams(location.search),pal=q.get("palette");
  var pf=document.querySelector("[name=palette]");
  if(pal&&pf){
    var clean=pal.replace(/[^#0-9A-Za-z ,:\-'’()]/g,"").slice(0,400);
    pf.value=clean;
    var show=document.getElementById("palette-note");
    if(show&&clean){show.hidden=false;show.querySelector("span").textContent=clean;}
  }
}catch(e){}

document.querySelectorAll("form[data-guard]").forEach(function(f){
  var out=f.querySelector(".fmsg");
  function say(kind,text){out.className="fmsg "+kind;out.textContent=text;}
  f.addEventListener("submit",function(ev){
    ev.preventDefault();
    var trap=f.querySelector("[name=_honey]");
    if(trap&&trap.value){say("ok","Thank you, your note was received.");f.reset();return;}
    if(!human||Date.now()-started<3500){say("bad","Please take a moment to check the details, then press send again.");human=true;return;}
    if(!f.checkValidity()){f.reportValidity();return;}
    var data=new FormData(f);data.delete("_honey");
    data.append("page",location.pathname);
    var btn=f.querySelector("button[type=submit]");btn.disabled=true;say("wait","Sending…");
    fetch(endpoint(),{method:"POST",headers:{"Accept":"application/json"},body:data})
      .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};},function(){return {ok:false,j:{}};});})
      .then(function(x){
        if(x.ok&&(x.j.success===true||x.j.success==="true")){say("ok",f.getAttribute("data-thanks"));f.reset();if(window.gtag){window.gtag("event","generate_lead",{form_id:f.id});}}
        else{throw new Error("fail");}
      })
      .catch(function(){say("bad","Sorry, that did not send. Please call or text 720-208-5645 and we will take it from there.");})
      .finally(function(){btn.disabled=false;});
  });
});

/* gallery lightbox */
var lb=document.getElementById("lb");
if(lb&&typeof lb.showModal==="function"){
  var li=lb.querySelector("img"),lp=lb.querySelector("p");
  document.querySelectorAll("[data-full]").forEach(function(btn){
    btn.addEventListener("click",function(){
      li.src=btn.getAttribute("data-full");li.alt=btn.querySelector("img").alt;
      lp.textContent=btn.getAttribute("data-cap")||"";lb.showModal();
    });
  });
  lb.querySelector(".x").addEventListener("click",function(){lb.close();});
  lb.addEventListener("click",function(e){if(e.target===lb){lb.close();}});
}
})();
