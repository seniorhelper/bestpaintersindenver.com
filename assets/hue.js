/* Hue — the swatch-card guide for bestpaintersindenver.com.
   Every answer goes through ONE adapter: window.BPID_HUE.ask(question) -> Promise<{html:string}>.
   To connect an AI API later, replace only the body of ask() (e.g. fetch('/api/hue',{method:'POST',body:...}) -> {html});
   the tab, panel and chips below never change. */
(function(){
"use strict";
var PHONE="720-208-5645",TEL="tel:+17202085645";
var KB=[
 {k:["best painter","best painters","top rated","top-rated","who is the best","number one","#1","ranking","rated","the best","makes a painter","good painter"],
  a:"<p>I won't hand you a ranking. Nobody can honestly crown one painter for every house. What I can show you is the standard our crews work to: prep first, the right primer, clean cut lines, a tidy site every day, and a written 5-year workmanship warranty.</p><p>See <a href='/our-standards/'>our standards</a> and judge any painter by them, us included.</p>"},
 {k:["color","colour","paint color","which color","pick","choose","palette","undertone","shade"],
  a:"<p>Two good starting points: play with the <a href='/color-studio/'>Color Studio</a> (wall, trim, ceiling, accent, plus a light simulator), or book a <a href='/color-consultation/'>color consultation</a> so we can look at samples in your own light.</p>"},
 {k:["consult","consultation","color help","designer","appointment"],
  a:"<p>A color consult can be virtual (send photos and tell us which way the windows face) or in your home. We test real samples on your walls and look at them at the times you actually use the room.</p><p><a href='/book-a-color-consult/'>Book a color consult</a> or call <a href='"+TEL+"'>"+PHONE+"</a>.</p>"},
 {k:["north","south","east","west","window","light","facing","sun","dark room"],
  a:"<p>Window direction changes color more than people expect. North rooms read cooler and grayer; south rooms run warm and bright; east rooms glow in the morning and flatten later; west rooms go amber at dusk.</p><p>The room-by-room guide is here: <a href='/journal/denver-light-room-color-guide/'>how Denver light changes paint color</a>.</p>"},
 {k:["primer","prime","priming","stain blocking","bleed"],
  a:"<p>We prime when the surface calls for it: bare drywall and patches, stains, glossy or slick finishes, raw wood, and big jumps in color. A self-priming paint doesn't cover every one of those.</p><p>Details: <a href='/journal/do-you-need-primer-before-painting/'>do you need primer before painting?</a></p>"},
 {k:["inspect","walkthrough","punch","quality","check my paint","flashing","touch up","touch-up"],
  a:"<p>Look at the finished work from about 39 inches away, in the room's normal light, the way the painting industry's own quality standard describes it. Then check lines, coverage, hardware and cleanup.</p><p>Full method: <a href='/journal/how-to-inspect-a-paint-job/'>how to inspect a paint job</a>.</p>"},
 {k:["warranty","guarantee","5-year","5 year","five year"],
  a:"<p>Our workmanship is covered by a written 5-year warranty. It's in writing with the estimate, so you know what it covers before you sign.</p>"},
 {k:["insured","insurance","liability","license","licensed"],
  a:"<p>Yes, we're fully insured. Colorado doesn't issue a statewide painting-contractor license, so ask any painter for proof of insurance and a written warranty instead.</p>"},
 {k:["estimate","quote","price","cost","how much","bid"],
  a:"<p>You choose how the estimate happens: a <b>virtual estimate</b> from your photos, or an <b>in-person estimate</b> at the house. Either way you get a written scope.</p><p>Call <a href='"+TEL+"'>"+PHONE+"</a> or use the <a href='/contact/'>contact form</a>.</p>"},
 {k:["winter","offer","discount","deal","25%","promo","sale"],
  a:"<p>Winter offer: <b>25% off the labor on painting projects booked by December 31, 2026.</b> Paint and materials not included. Call <a href='"+TEL+"'>"+PHONE+"</a> to hold your dates.</p>"},
 {k:["luxury","high end","high-end","fine finish","level 5","spray","sprayed","trim","doors","drench"],
  a:"<p>Fine-finish interiors are mostly about what happens before the paint: wall surfaces brought to the level the light and sheen demand, sprayed trim and doors, and cut lines you can follow with your eye.</p><p><a href='/fine-finish-interior-painting/'>Fine-finish interior painting</a></p>"},
 {k:["cabinet","kitchen"],
  a:"<p>Cabinets are a spray-finish job done by a dedicated crew. Read how Painter Hotline handles <a href='https://painterhotline.com/cabinet-refinishing/'>cabinet refinishing</a>, or call <a href='"+TEL+"'>"+PHONE+"</a>.</p>"},
 {k:["brand","sherwin","benjamin","behr","valspar","ppg","paint brand"],
  a:"<p>We paint with all major brands, including Sherwin-Williams, Benjamin Moore, Behr, Valspar and PPG. The product and sheen for each surface is named in writing on your estimate.</p>"},
 {k:["lead","1978","old house","older home","asbestos","popcorn"],
  a:"<p>For homes built before 1978, Colorado requires the Renovate Right pamphlet at least 7 days before work that disturbs painted surfaces, and lead-safe work practices. Popcorn or texture removal over 32 sq ft in a single-family home needs an asbestos inspection first. We plan for both. See <a href='/our-standards/#prep'>how we prep</a>.</p>"},
 {k:["photo","gallery","pictures","work","portfolio","examples"],
  a:"<p>Every photo in our <a href='/project-gallery/'>project gallery</a> is from our own work: prep, protection and finished rooms.</p>"},
 {k:["area","where","denver","serve","neighborhood","suburb"],
  a:"<p>We're headquartered in Denver and work across the metro. Tell us where the house is when you call <a href='"+TEL+"'>"+PHONE+"</a>.</p>"},
 {k:["hello","hi","hey","help","who are you"],
  a:"<p>Hi, I'm Hue. Ask me about color, our standards, estimates, or the winter booking offer.</p>"}
];
function norm(s){return (" "+String(s||"").toLowerCase().replace(/[^a-z0-9#%\- ]/g," ").replace(/\s+/g," ")+" ");}
window.BPID_HUE={
  ask:function(question){
    var q=norm(question);
    if(q.trim().length<2){return Promise.resolve({html:"<p>Type a question about color, painting standards, estimates or scheduling.</p>"});}
    var best=null,score=0;
    KB.forEach(function(item){
      var s=0;item.k.forEach(function(w){if(q.indexOf(w)>-1){s+=w.length>4?2:1;}});
      if(s>score){score=s;best=item;}
    });
    if(best){return Promise.resolve({html:best.a});}
    return Promise.resolve({html:"<p>Good question, and one a person should answer. Call or text <a href='"+TEL+"'>"+PHONE+"</a>, or <a href='/contact/'>send a note</a>.</p>"});
  }
};

var face="<svg viewBox='0 0 64 92' aria-hidden='true' focusable='false'><rect x='3' y='3' width='58' height='86' rx='12' fill='#FFFDF8' stroke='#1E2838' stroke-width='2.5'/><circle cx='32' cy='11' r='3.2' fill='#FBF8F3' stroke='#1E2838' stroke-width='1.6'/><rect x='9' y='46' width='46' height='12' rx='3' fill='#C0654A'/><rect x='9' y='60' width='46' height='12' rx='3' fill='#7C9A82'/><rect x='9' y='74' width='46' height='9' rx='3' fill='#24324A'/><circle class='eye' cx='23' cy='27' r='3.6' fill='#1E2838'/><circle class='eye' cx='41' cy='27' r='3.6' fill='#1E2838'/><path d='M24 35 Q32 41 40 35' fill='none' stroke='#1E2838' stroke-width='2.4' stroke-linecap='round'/><circle cx='17' cy='34' r='3' fill='#E9A58F' opacity='.7'/><circle cx='47' cy='34' r='3' fill='#E9A58F' opacity='.7'/></svg>";

var css="#hue-tab{position:fixed;right:6px;bottom:96px;z-index:45;border:0;background:transparent;padding:0;cursor:pointer;display:flex;align-items:center;gap:0;filter:drop-shadow(0 8px 14px rgba(30,40,56,.25))}"+
"#hue-tab .hue-body{width:58px;height:84px;display:block;transform:rotate(-5deg);transition:transform .25s}"+
"#hue-tab:hover .hue-body,#hue-tab:focus-visible .hue-body{transform:rotate(-1deg) translateY(-3px)}"+
"#hue-tab .hue-say{background:#1E2838;color:#fff;font:600 13px/1.2 system-ui,sans-serif;padding:7px 10px;border-radius:8px 8px 0 8px;margin-right:4px;white-space:nowrap}"+
"@media(min-width:900px){#hue-tab{bottom:28px}}"+
"#hue-panel{position:fixed;right:12px;bottom:92px;z-index:46;width:min(370px,calc(100vw - 24px));max-height:min(560px,calc(100vh - 120px));display:none;flex-direction:column;background:#FFFDF8;border:1px solid #E3DBCF;border-radius:16px;box-shadow:0 24px 60px -20px rgba(30,40,56,.45);overflow:hidden;font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1E2838}"+
"@media(min-width:900px){#hue-panel{bottom:24px;right:24px}}"+
"#hue-panel.on{display:flex}"+
"#hue-panel header{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#F4EEE4;border-bottom:1px solid #E3DBCF}"+
"#hue-panel header svg{width:30px;height:43px;flex:0 0 auto}"+
"#hue-panel header b{display:block;font-family:Iowan Old Style,Palatino Linotype,Georgia,serif;font-size:17px}"+
"#hue-panel header small{color:#6B7380}"+
"#hue-x{margin-left:auto;width:40px;height:40px;border-radius:50%;border:1px solid #E3DBCF;background:#fff;font-size:20px;cursor:pointer}"+
"#hue-log{padding:14px;overflow-y:auto;flex:1}"+
".hue-m{margin:0 0 10px;padding:10px 12px;border-radius:12px;max-width:92%}"+
".hue-m p{margin:0 0 6px}.hue-m p:last-child{margin:0}"+
".hue-bot{background:#F4EEE4}.hue-me{background:#1E2838;color:#fff;margin-left:auto}"+
".hue-bot a{color:#8F4430}"+
"#hue-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}"+
"#hue-chips button{border:1px solid #CFC5B6;background:#fff;border-radius:6px;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer}"+
"#hue-f{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #E3DBCF}"+
"#hue-f input{flex:1;min-width:0;padding:10px 12px;border:1px solid #CFC5B6;border-radius:8px;font:inherit}"+
"#hue-f button{padding:10px 14px;border:0;border-radius:8px;background:#B0573E;color:#fff;font-weight:600;cursor:pointer}"+
"#hue-call{display:block;text-align:center;padding:8px;font-size:13px;color:#47505E;border-top:1px solid #E3DBCF}"+
"";

function el(t,a,h){var e=document.createElement(t);if(a){for(var k in a){e.setAttribute(k,a[k]);}}if(h!=null){e.innerHTML=h;}return e;}
function init(){
  var st=el("style",null,css);document.head.appendChild(st);
  var tab=el("button",{id:"hue-tab",type:"button","aria-label":"Ask Hue, the color and painting guide","aria-expanded":"false","aria-controls":"hue-panel"},"<span class='hue-say'>Ask Hue</span><span class='hue-body'>"+face+"</span>");
  var panel=el("div",{id:"hue-panel",role:"dialog","aria-label":"Hue, color and painting guide"},
   "<header>"+face+"<div><b>Hue</b><small>Color &amp; standards guide</small></div><button id='hue-x' type='button' aria-label='Close'>&times;</button></header>"+
   "<div id='hue-log' aria-live='polite'></div>"+
   "<div id='hue-chips'><button type='button'>What makes a painter the best?</button><button type='button'>Help me pick a color</button><button type='button'>Winter offer</button><button type='button'>Virtual estimate</button></div>"+
   "<form id='hue-f'><label class='hp' for='hue-q'>Your question</label><input id='hue-q' type='text' autocomplete='off' maxlength='300' placeholder='Ask about color, prep, estimates…'><button type='submit'>Ask</button></form>"+
   "<a id='hue-call' href='"+TEL+"'>Rather talk? Call or text "+PHONE+"</a>");
  document.body.appendChild(tab);document.body.appendChild(panel);
  var log=panel.querySelector("#hue-log"),inp=panel.querySelector("#hue-q");
  function add(html,who){var m=el("div",{"class":"hue-m "+(who==="me"?"hue-me":"hue-bot")});if(who==="me"){m.textContent=html;}else{m.innerHTML=html;}log.appendChild(m);log.scrollTop=log.scrollHeight;}
  var greeted=false;
  function open(){panel.classList.add("on");tab.style.display="none";tab.setAttribute("aria-expanded","true");if(!greeted){add("<p>Hi, I'm Hue, a paint swatch with opinions. Ask me about color, how we prep, or booking an estimate.</p>");greeted=true;}setTimeout(function(){inp.focus();},30);}
  function close(){panel.classList.remove("on");tab.style.display="";tab.setAttribute("aria-expanded","false");tab.focus();}
  function ask(q){q=String(q||"").trim();if(!q){return;}add(q,"me");window.BPID_HUE.ask(q).then(function(r){add(r&&r.html?r.html:"<p>Call or text "+PHONE+".</p>");},function(){add("<p>Something went wrong on my side. Call or text <a href='"+TEL+"'>"+PHONE+"</a>.</p>");});}
  tab.addEventListener("click",open);
  panel.querySelector("#hue-x").addEventListener("click",close);
  panel.addEventListener("keydown",function(e){if(e.key==="Escape"){close();}});
  panel.querySelectorAll("#hue-chips button").forEach(function(b){b.addEventListener("click",function(){ask(b.textContent);});});
  panel.querySelector("#hue-f").addEventListener("submit",function(e){e.preventDefault();ask(inp.value);inp.value="";});
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
