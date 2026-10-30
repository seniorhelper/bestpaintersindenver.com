/* Color Studio: original room visualizer. Swatches are our own named hex values (not manufacturer colors). */
(function(){
"use strict";
var root=document.getElementById("studio");if(!root){return;}

var LIB=[
 {f:"Whites & creams",c:[["Mile High White","#F4F2EC"],["Wash Park Linen","#EFE8DA"],["Snowmelt","#EEF1F0"],["Porch Light Cream","#F1E6CF"],["Sugar Beet Ivory","#EDE3D2"],["Ceiling Cloud","#F7F7F4"]]},
 {f:"Greige & stone",c:[["Highlands Plaster","#E6DCCB"],["Front Range Fog","#D9DBD6"],["Flatiron Taupe","#A49686"],["Platte River Stone","#8D8F86"],["Dry Creek Sand","#CDBFA6"],["Lodgepole Bark","#6F6457"]]},
 {f:"Greens",c:[["Cherry Creek Sage","#9AAE97"],["Prairie Grass","#B9B27E"],["Bear Creek Moss","#6F7D5B"],["Aspen Leaf","#C9D3B4"],["Ponderosa","#3F5446"],["Juniper Smoke","#7E8F86"]]},
 {f:"Blues",c:[["Sloan's Lake Blue","#5E7D92"],["Columbine Blue","#7E97B8"],["High Plains Sky","#BFD0DF"],["Evening Range","#45556B"],["Glacier Mist","#D6E1E3"],["Larimer Ink","#25303F"]]},
 {f:"Warm earths",c:[["Red Rocks Clay","#B5624A"],["Aspen Gold","#D7A84B"],["Adobe Rose","#C99486"],["Garden of the Gods","#9B5440"],["Chamisa","#D9C08A"],["Harvest Wheat","#E2CFA4"]]},
 {f:"Deep accents",c:[["Union Station Brick","#8E4635"],["Coal Creek","#2E2F2D"],["Blue Spruce Night","#2F4A4A"],["Plum Twilight","#5A4352"],["Saddle Leather","#6E4A33"],["Iron Range","#4A4E52"]]}
];
var PRESETS={
 "Quiet Wash Park":{walls:"#EFE8DA",accent:"#9AAE97",trim:"#F4F2EC",ceiling:"#F7F7F4",door:"#6F6457"},
 "Foothill Modern":{walls:"#D9DBD6",accent:"#45556B",trim:"#F4F2EC",ceiling:"#F7F7F4",door:"#2E2F2D"},
 "Red Rocks Warmth":{walls:"#E6DCCB",accent:"#B5624A",trim:"#F1E6CF",ceiling:"#F7F7F4",door:"#6E4A33"},
 "Color-Drenched Study":{walls:"#3F5446",accent:"#3F5446",trim:"#3F5446",ceiling:"#7E8F86",door:"#3F5446"}
};
var SURF={walls:"Side walls",accent:"Back wall",trim:"Trim & casings",ceiling:"Ceiling",door:"Door"};
var DEF={walls:"#EFE8DA",accent:"#E6DCCB",trim:"#F4F2EC",ceiling:"#F7F7F4",door:"#6F6457"};
var state={walls:DEF.walls,accent:DEF.accent,trim:DEF.trim,ceiling:DEF.ceiling,door:DEF.door};
var active="walls",exposure="north",time="midday",snow=false;
var names={};LIB.forEach(function(g){g.c.forEach(function(s){names[s[1]]=s[0];});});

/* color math */
function hexOk(v){v=String(v||"").trim().replace(/^#/,"");if(/^[0-9a-f]{3}$/i.test(v)){v=v.split("").map(function(c){return c+c;}).join("");}return /^[0-9a-f]{6}$/i.test(v)?"#"+v.toUpperCase():null;}
function rgb(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)];}
function hex(r){return "#"+r.map(function(x){x=Math.max(0,Math.min(255,Math.round(x)));return (x<16?"0":"")+x.toString(16);}).join("").toUpperCase();}
function lin(c){c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);}
function lum(h){var r=rgb(h);return .2126*lin(r[0])+.7152*lin(r[1])+.0722*lin(r[2]);}
function lrv(h){return Math.round(lum(h)*100);}
function ratio(a,b){var x=lum(a),y=lum(b);if(x<y){var t=x;x=y;y=t;}return (x+.05)/(y+.05);}
function hsl(h){var r=rgb(h).map(function(v){return v/255;}),mx=Math.max.apply(0,r),mn=Math.min.apply(0,r),l=(mx+mn)/2,s=0,hu=0,d=mx-mn;
 if(d){s=l>.5?d/(2-mx-mn):d/(mx+mn);if(mx===r[0]){hu=((r[1]-r[2])/d)%6;}else if(mx===r[1]){hu=(r[2]-r[0])/d+2;}else{hu=(r[0]-r[1])/d+4;}hu*=60;if(hu<0){hu+=360;}}
 return [hu,s,l];}
function undertone(h){var x=hsl(h),r=rgb(h),ch=(Math.max.apply(0,r)-Math.min.apply(0,r))/255;if(x[1]<.06||ch<.025){return "true neutral";}var hu=x[0];
 if(hu<20||hu>=330){return "warm, red/pink lean";}if(hu<50){return "warm, orange/clay lean";}if(hu<70){return "warm, yellow lean";}if(hu<160){return "green lean";}if(hu<200){return "cool, blue-green lean";}if(hu<260){return "cool, blue lean";}return "cool, violet lean";}
function mix(h,t,a){var x=rgb(h),y=rgb(t);return [x[0]+(y[0]-x[0])*a,x[1]+(y[1]-x[1])*a,x[2]+(y[2]-x[2])*a];}
var EXPO={north:{t:"#AFC6DC",a:.09,b:.92},south:{t:"#FFE2B0",a:.06,b:1.04},east:{t:"#FFFFFF",a:0,b:1},west:{t:"#FFFFFF",a:0,b:1}};
var TIME={
 north:{morning:{a:.02,b:-.03},midday:{a:0,b:0},evening:{a:.03,b:-.06}},
 south:{morning:{a:-.01,b:-.02},midday:{a:0,b:.02},evening:{a:.02,b:-.04}},
 east:{morning:{t:"#FFD9A8",a:.11,b:1.04},midday:{t:"#FFF4E2",a:.03,b:.98},evening:{t:"#B9C8DA",a:.07,b:.86}},
 west:{morning:{t:"#BCCBDC",a:.07,b:.88},midday:{t:"#FFF4E2",a:.03,b:.98},evening:{t:"#FFB977",a:.15,b:1.0}}
};
function lit(h){
 var e=EXPO[exposure],m=TIME[exposure][time],tint=e.t,amt=e.a,br=e.b;
 if(m.t){tint=m.t;amt=m.a;br=m.b;}else{amt=Math.max(0,amt+m.a);br=br+m.b;}
 var c=mix(h,tint,amt);
 if(snow){c=mix(hex(c),"#E8F0FA",.04);br+=.05;}
 return hex(c.map(function(v){return v*br;}));
}

/* build UI */
var svg=root.querySelector("svg.room");
var tabs=root.querySelector(".st-tabs"),grid=root.querySelector(".st-lib"),read=root.querySelector(".st-read"),warn=root.querySelector(".st-warn");
var hexIn=root.querySelector("#st-hex"),hexMsg=root.querySelector("#st-hexmsg"),book=root.querySelector("#st-book"),copyB=root.querySelector("#st-copy"),saveB=root.querySelector("#st-save"),resetB=root.querySelector("#st-reset"),saved=root.querySelector("#st-saved");

Object.keys(SURF).forEach(function(k){
 var b=document.createElement("button");b.type="button";b.setAttribute("role","tab");b.dataset.s=k;
 b.innerHTML="<i></i>"+SURF[k];b.addEventListener("click",function(){pick(k);});tabs.appendChild(b);
});
LIB.forEach(function(g){
 var h=document.createElement("h4");h.textContent=g.f;grid.appendChild(h);
 var row=document.createElement("div");row.className="st-row";
 g.c.forEach(function(s){
  var b=document.createElement("button");b.type="button";b.className="sw";b.style.background=s[1];
  b.setAttribute("aria-label",s[0]+" "+s[1]);b.title=s[0]+" · "+s[1];b.dataset.hex=s[1];
  b.innerHTML="<span>"+s[0]+"</span>";
  b.addEventListener("click",function(){setColor(s[1]);});
  row.appendChild(b);
 });
 grid.appendChild(row);
});
root.querySelectorAll("[data-preset]").forEach(function(b){
 b.addEventListener("click",function(){var p=PRESETS[b.getAttribute("data-preset")];if(p){Object.keys(p).forEach(function(k){state[k]=p[k];});render();}});
});
svg.querySelectorAll("[data-s]").forEach(function(n){
 n.addEventListener("click",function(){pick(n.getAttribute("data-s"));});
});
root.querySelectorAll("[name=st-exp]").forEach(function(r){r.addEventListener("change",function(){exposure=r.value;render();});});
root.querySelectorAll("[name=st-time]").forEach(function(r){r.addEventListener("change",function(){time=r.value;render();});});
var sn=root.querySelector("#st-snow");sn.addEventListener("change",function(){snow=sn.checked;render();});

function pick(k){active=k;render();}
function setColor(h){state[active]=h;hexMsg.textContent="";render();}
root.querySelector("#st-hexform").addEventListener("submit",function(e){
 e.preventDefault();var v=hexOk(hexIn.value);
 if(!v){hexMsg.textContent="That isn't a hex color. Try a value like #9AAE97 or 9ae.";hexMsg.className="st-err";return;}
 hexMsg.className="";hexMsg.textContent="Applied "+v+" to "+SURF[active].toLowerCase()+".";setColor(v);hexMsg.textContent="Applied "+v+" to "+SURF[active].toLowerCase()+".";
});
resetB.addEventListener("click",function(){Object.keys(DEF).forEach(function(k){state[k]=DEF[k];});exposure="north";time="midday";snow=false;
 root.querySelector("[name=st-exp][value=north]").checked=true;root.querySelector("[name=st-time][value=midday]").checked=true;sn.checked=false;hexIn.value="";hexMsg.textContent="";render();});

function label(h){return (names[h]?names[h]+" ":"Custom ")+h;}
function paletteText(){return Object.keys(SURF).map(function(k){return SURF[k]+": "+label(state[k]);}).join(", ");}
copyB.addEventListener("click",function(){
 var t=paletteText();
 function done(ok){saved.textContent=ok?"Palette copied.":"Copy isn't available here. Select and copy: "+t;}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){done(true);},function(){done(false);});}else{done(false);}
});
saveB.addEventListener("click",function(){
 try{localStorage.setItem("bpid-palette",JSON.stringify(state));saved.textContent="Saved on this device. It will be here next time you open the studio.";}
 catch(e){saved.textContent="This browser won't let us save. Use Copy palette instead.";}
});
try{var prev=JSON.parse(localStorage.getItem("bpid-palette")||"null");if(prev){Object.keys(DEF).forEach(function(k){var v=hexOk(prev[k]);if(v){state[k]=v;}});}}catch(e){}

function render(){
 svg.querySelectorAll("[data-s]").forEach(function(n){n.setAttribute("fill",lit(state[n.getAttribute("data-s")]));n.classList.toggle("on",n.getAttribute("data-s")===active);});
 var glow=svg.querySelector("#glow");
 var gc={north:"#DCE8F5",south:"#FFF1D2",east:time==="morning"?"#FFE4BC":"#F4F1EA",west:time==="evening"?"#FFC98F":"#F4F1EA"}[exposure];
 glow.setAttribute("fill",snow?"#F2F6FB":gc);
 tabs.querySelectorAll("button").forEach(function(b){var on=b.dataset.s===active;b.setAttribute("aria-selected",on?"true":"false");b.querySelector("i").style.background=state[b.dataset.s];});
 grid.querySelectorAll(".sw").forEach(function(b){b.classList.toggle("cur",b.dataset.hex===state[active]);});
 var a=state[active];
 var rows=Object.keys(SURF).map(function(k){return "<tr"+(k===active?" class='cur'":"")+"><th scope='row'><i style='background:"+state[k]+"'></i>"+SURF[k]+"</th><td>"+label(state[k])+"</td><td>≈"+lrv(state[k])+"</td><td>"+undertone(state[k])+"</td></tr>";}).join("");
 read.innerHTML="<table class='t'><thead><tr><th>Surface</th><th>Color</th><th>LRV</th><th>Undertone</th></tr></thead><tbody>"+rows+"</tbody></table>";
 var cr=ratio(state.walls,state.trim),notes=[];
 if(state.walls===state.trim&&state.walls===state.accent){notes.push("Walls, back wall and trim match: that's a color-drenched room. Use sheen (flat walls, satin or semi-gloss trim) to keep the edges readable.");}
 else if(cr<1.15){notes.push("Wall and trim are nearly the same lightness ("+cr.toFixed(2)+":1). That reads soft and tonal. If you want trim to frame the room, pick a trim color with more contrast.");}
 else if(cr>6){notes.push("Very high wall-to-trim contrast ("+cr.toFixed(1)+":1). It looks crisp, and every cut line shows, so it needs a careful hand.");}
 if(lrv(state.walls)<15&&exposure==="north"){notes.push("A deep color on north-facing walls will read darker and cooler than the chip. Sample it at a large size before you commit.");}
 if(lrv(state.ceiling)<55){notes.push("A ceiling under about 55 LRV will make the room feel lower. That's fine for a cozy study; less so for a small bedroom.");}
 if(exposure==="west"&&time==="evening"&&hsl(state.walls)[0]>20&&hsl(state.walls)[0]<60&&hsl(state.walls)[1]>.25){notes.push("Warm walls plus west evening light can push toward orange. Check the sample at dusk.");}
 warn.innerHTML=notes.length?notes.map(function(n){return "<p>"+n+"</p>";}).join(""):"<p>Wall and trim contrast is "+cr.toFixed(1)+":1, a balanced, classic frame.</p>";
 root.querySelector(".st-active").textContent=SURF[active]+": "+label(a);
 book.href="/book-a-color-consult/?palette="+encodeURIComponent(paletteText());
}
render();
})();
