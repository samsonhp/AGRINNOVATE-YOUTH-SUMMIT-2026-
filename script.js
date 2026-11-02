(function(){
var $=function(s){return document.querySelector(s)};
var db=null,downloads=null,blobData=null;
try{claude.use("db").then(function(d){db=d}).catch(function(){});claude.use("downloads").then(function(d){downloads=d;}).catch(function(){});}catch(e){}
function H(s,m){var x=5381;for(var i=0;i<s.length;i++)x=((x*m)+s.charCodeAt(i))>>>0;return x}
function keyOf(e){e=e.trim().toLowerCase();return H(e,33).toString(16)+H(e,31).toString(16)+H(e,37).toString(16)}
function codeOf(k){return "AGR26-"+(H(k,41).toString(36)+H(k,43).toString(36)).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6).padEnd(6,"7")}
function msg(t,c){var m=$("#msg");m.textContent=t;m.className=c}
function lsGet(){try{return JSON.parse(localStorage.getItem("agri26_ticket")||"null")}catch(e){return null}}
function lsSet(v){try{localStorage.setItem("agri26_ticket",JSON.stringify(v))}catch(e){}}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function fit(c,t,x,y,max,size,font){var s=size;do{c.font=font.replace("#",s);s--}while(c.measureText(t).width>max&&s>12);c.fillText(t,x,y)}
function draw(t){
 var cv=document.createElement("canvas");cv.width=1000;cv.height=440;var c=cv.getContext("2d");
 var g=c.createLinearGradient(0,0,1000,440);g.addColorStop(0,"#05501f");g.addColorStop(1,"#1f6b3a");
 c.fillStyle="#eef5e6";c.fillRect(0,0,1000,440);
 c.fillStyle=g;rr(c,10,10,980,420,26);c.fill();
 c.fillStyle="#a5bd5c";c.fillRect(10,10,980,86);
 c.fillStyle="#0f2a14";c.textBaseline="alphabetic";
 c.font="700 44px Oswald,Impact,sans-serif";c.fillText("AGRINNOVATE YOUTH SUMMIT 2026",40,70);
 c.fillStyle="#fff";c.font="600 22px Inter,Arial,sans-serif";c.fillText("MEAL TICKET",40,140);
 c.fillStyle="#d7e9a5";c.font="16px Inter,Arial,sans-serif";c.fillText("PARTICIPANT",40,185);
 c.fillStyle="#fff";fit(c,t.name.toUpperCase(),40,225,600,40,"700 #px Oswald,Impact,sans-serif");
 c.fillStyle="#d7e9a5";c.font="16px Inter,Arial,sans-serif";c.fillText(t.faculty+" · "+t.level+(/^\d/.test(t.level)?" Level":"")+" · "+t.campus,40,262);
 c.fillStyle="#fff";c.font="600 20px Inter,Arial,sans-serif";
 c.fillText("14 Nov 2026 · 9:00 AM prompt",40,315);c.fillText("Convocation Arena, BUK Main Campus",40,345);
 c.fillStyle="#a5bd5c";c.font="500 36px Oswald,Impact,sans-serif";c.fillText(t.code,40,405);
 // perforation
 c.setLineDash([8,8]);c.strokeStyle="#a5bd5c";c.lineWidth=3;c.beginPath();c.moveTo(700,110);c.lineTo(700,420);c.stroke();c.setLineDash([]);
 // stub
 c.fillStyle="#fff";rr(c,730,120,230,230,16);c.fill();
 var s=H(t.code,29)||7,x=750;c.fillStyle="#0f2a14";
 while(x<940){s=(s*1664525+1013904223)>>>0;var w=2+(s>>>28)%4;if((s>>>20)%3)c.fillRect(x,140,w,150);x+=w+2+((s>>>24)%3)}
 c.fillStyle="#0f2a14";c.font="600 20px Inter,Arial,sans-serif";c.textAlign="center";c.fillText(t.code,845,325);
 c.fillStyle="#d7e9a5";c.font="14px Inter,Arial,sans-serif";c.fillText("ONE PER PARTICIPANT",845,385);c.fillText("Attendance is free",845,405);c.textAlign="left";
 return cv}
function show(t){
 var cv=draw(t);$("#timg").src=cv.toDataURL("image/png");$("#out").style.display="block";$("#dl").style.display="inline-block";
 cv.toBlob(function(b){blobData=b});
 $("#out").scrollIntoView({behavior:"smooth",block:"center"})}
$("#dl").onclick=function(){
 if(!blobData)return;
 if(downloads){blobData.arrayBuffer().then(function(ab){return downloads.save({filename:"AGRINNOVATE-meal-ticket.png",data:new Uint8Array(ab)})}).catch(function(){});return}
 var a=document.createElement("a");a.href=URL.createObjectURL(blobData);a.download="AGRINNOVATE-meal-ticket.png";document.body.appendChild(a);a.click();a.remove();};
$("#f").addEventListener("submit",function(ev){
 ev.preventDefault();var fd=new FormData(ev.target),v={};fd.forEach(function(a,b){v[b]=String(a).trim()});
 var btn=$("#go");btn.disabled=true;msg("","");
 var k=keyOf(v.email),t={name:v.name,faculty:v.faculty,level:v.level,campus:v.campus,code:codeOf(k),k:k};
 var local=lsGet();
 function done(tk,existing){btn.disabled=false;lsSet(tk);show(tk);
  msg(existing?"This profile already has a ticket, so here is your original one. Only one ticket can be generated per profile.":"Registration complete. Your meal ticket is ready. You can only generate one per profile, so save it now.",existing?"warn":"ok")}
 if(local&&local.k!==k){btn.disabled=false;msg("A ticket has already been generated on this device for another profile. Only one ticket per profile is allowed, and this device has used its ticket.","warn");show(local);return}
 if(local&&local.k===k){done(local,true);return}
 if(!db){done(t,false);return}
 var ref=db.collection("tickets").doc(k),timer=setTimeout(function(){done(t,false)},10000),fired=false;
 function fin(a,b){if(fired)return;fired=true;clearTimeout(timer);done(a,b)}
 ref.get().then(function(s){
  if(s.exists){var d=s.data();fin({name:d.name,faculty:d.faculty,level:d.level,campus:d.campus,code:d.code,k:k},true)}
  else{ref.set({name:t.name,faculty:t.faculty,level:t.level,campus:t.campus,code:t.code}).then(function(){fin(t,false)}).catch(function(){fin(t,false)})}
 }).catch(function(){fin(t,false)});
});
})();
