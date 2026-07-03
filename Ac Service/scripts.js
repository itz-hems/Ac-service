
(function(){
  if(!window.jspdf){
    if(window.jsPDF){ window.jspdf = { jsPDF: window.jsPDF }; }
    else if(window.module && window.module.exports && window.module.exports.jsPDF){
      window.jspdf = window.module.exports;
    }
  }
  if(window.jspdf && window.jspdf.jsPDF && typeof window.jspdf.jsPDF.API === 'object'){
    if(typeof window.jspdf.jsPDF.API.autoTable !== 'function' && typeof window.autoTable === 'function'){
      window.autoTable(window.jspdf.jsPDF);
    }
  }
})();

// 


(function(){
  var intro = document.getElementById('acIntro');
  if (!intro) return;
  var symbols = ['❄','❅','❆','·','*','✦','◆'];
  var crystalBox = document.getElementById('aiCrystals');
  for (var i = 0; i < 32; i++) {
    (function(){
      var el = document.createElement('div');
      var sz = 9 + Math.random() * 20;
      var r  = Math.round(140 + Math.random() * 115);
      var g  = Math.round(210 + Math.random() * 45);
      var b2 = Math.round(225 + Math.random() * 30);
      var op = 0.2 + Math.random() * 0.55;
      var dur= 3.8 + Math.random() * 5;
      var del= Math.random() * 5;
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = 'position:absolute;font-size:'+sz+'px;left:'+(Math.random()*100)+'%;'
        +'color:rgba('+r+','+g+','+b2+','+op+');'
        +'animation:aiCrystalFloat '+dur+'s '+del+'s linear infinite;'
        +'pointer-events:none;user-select:none;'
        +'text-shadow:0 0 10px rgba(6,182,212,0.55);';
      crystalBox.appendChild(el);
    })();
  }
  var bc = document.getElementById('breezeCanvas');
  if (bc) {
    var bx = bc.getContext('2d');
    var bW=0,bH=0;
    function rsz2(){bW=bc.width=bc.offsetWidth||window.innerWidth;bH=bc.height=bc.offsetHeight||window.innerHeight;}
    rsz2(); window.addEventListener('resize',rsz2);
    var bLines=[];
    for(var j=0;j<22;j++){bLines.push({y:Math.random(),x:-0.2-Math.random()*0.4,spd:0.0006+Math.random()*0.0014,len:0.07+Math.random()*0.18,op:0.10+Math.random()*0.20,lw:0.5+Math.random()*1.3,wave:Math.random()*Math.PI*2,wSpd:0.010+Math.random()*0.022,wAmp:0.010+Math.random()*0.028});}
    var introActive=true;
    function drawBreeze(){
      if(!introActive)return;
      bx.clearRect(0,0,bW,bH);
      bLines.forEach(function(l){
        l.x+=l.spd;l.wave+=l.wSpd;
        var yy=(l.y+Math.sin(l.wave)*l.wAmp)*bH;
        var x0=l.x*bW,x1=(l.x+l.len)*bW;
        var gr=bx.createLinearGradient(x0,yy,x1,yy);
        gr.addColorStop(0,'rgba(103,232,249,0)');
        gr.addColorStop(0.25,'rgba(103,232,249,'+l.op+')');
        gr.addColorStop(0.60,'rgba(14,165,233,'+(l.op*0.8)+')');
        gr.addColorStop(0.85,'rgba(6,182,212,'+(l.op*0.4)+')');
        gr.addColorStop(1,'rgba(6,182,212,0)');
        bx.strokeStyle=gr;bx.lineWidth=l.lw;bx.lineCap='round';bx.beginPath();bx.moveTo(x0,yy);
        var steps=8,dx=(x1-x0)/steps;
        for(var s=1;s<=steps;s++){var cx2=x0+dx*(s-0.5),cy2=yy+Math.sin(l.wave+s*0.8)*bH*0.006;bx.quadraticCurveTo(cx2,cy2,x0+dx*s,yy+Math.sin(l.wave+s*0.8+0.4)*bH*0.004);}
        bx.stroke();
        if(l.x>1.15){l.x=-0.2-Math.random()*0.3;l.y=Math.random();}
      });
      requestAnimationFrame(drawBreeze);
    }
    drawBreeze();
    window._stopIntroBreeze=function(){introActive=false;};
  }
  var prog=document.getElementById('aiProgress');
  var started=Date.now(),TOTAL=3400,raf;
  function tickProg(){
    var elapsed=Date.now()-started;
    var pct=Math.min((elapsed/TOTAL)*100,100);
    if(prog)prog.style.width=pct+'%';
    if(pct<100){raf=requestAnimationFrame(tickProg);}else{dismissIntro();}
  }
  raf=requestAnimationFrame(tickProg);
  function dismissIntro(){
    if(!intro.parentNode)return;
    cancelAnimationFrame(raf);
    if(window._stopIntroBreeze)window._stopIntroBreeze();
    intro.classList.add('ai-exit');
    setTimeout(function(){if(intro.parentNode)intro.parentNode.removeChild(intro);},760);
  }
  intro.addEventListener('click',function(){started=Date.now()-TOTAL;});
})();


// 

if (!Array.prototype.find) {
  Array.prototype.find = function(fn) {
    for (var i = 0; i < this.length; i++) { if (fn(this[i], i, this)) return this[i]; }
    return undefined;
  };
}
if (typeof NodeList !== 'undefined' && NodeList.prototype && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

var cvs = document.getElementById('bgCanvas');
var cx  = cvs.getContext('2d');
var W = 0, H = 0, sunAngle = 0;
var wState = 'clear', wTemp = 33;
var ptcls = [];

function rsz() { W = cvs.width = Math.max(innerWidth,1); H = cvs.height = Math.max(innerHeight,1); }
rsz();
window.addEventListener('resize', rsz);

function istHour() {
  var d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return d.getHours() + d.getMinutes() / 60;
}

function lerpHex(a, b, t) {
  function v(s, i) { return parseInt(s.replace('#','').slice(i, i+2), 16); }
  function h2(n)   { return ('0' + Math.round(n).toString(16)).slice(-2); }
  return '#' + h2(v(a,0)+(v(b,0)-v(a,0))*t)
             + h2(v(a,2)+(v(b,2)-v(a,2))*t)
             + h2(v(a,4)+(v(b,4)-v(a,4))*t);
}

function pal(hr) {
  if (hr >= 21 || hr < 5) {
    if (wState === 'rain') return { c0:'#050710', c1:'#080e1c', type:'night' };
    return { c0:'#020307', c1:'#040618', c2:'#060c1e', type:'night' };
  }
  if (hr >= 5 && hr < 7) {
    var t0 = (hr - 5) / 2;
    return { c0:lerpHex('#07081c','#170f4a',t0), c1:lerpHex('#170f4a','#b25424',t0), c2:lerpHex('#b25424','#fcd89c',t0), type:'dawn' };
  }
  if (hr >= 7 && hr < 11) {
    var t1 = (hr - 7) / 4;
    return { c0:lerpHex('#1456ca','#0d46ae',t1), c1:lerpHex('#4294ec','#1e74da',t1), c2:lerpHex('#fae4aa','#c2e6ff',t1), type:'morning' };
  }
  if (hr >= 11 && hr < 17) {
    if (wState === 'rain')   return { c0:'#566880', c1:'#96b6ca', type:'rainday' };
    if (wState === 'cloudy') return { c0:'#6484ae', c1:'#b0ccde', type:'cloudy' };
    if (wTemp >= 36)         return { c0:'#de9c1c', c1:'#4ea6e6', c2:'#c0e6ff', type:'hot' };
    return { c0:'#0848ca', c1:'#1e82ec', c2:'#b4d8ff', type:'day' };
  }
  if (hr >= 17 && hr < 19) {
    var t2 = (hr - 17) / 2;
    return { c0:lerpHex('#0a1a4a','#1a0830',t2), c1:lerpHex('#e05c10','#c02050',t2), c2:lerpHex('#ffd84a','#8a2060',t2), type:'dusk' };
  }
  var t3 = Math.min((hr - 19) / 2, 1);
  return { c0:lerpHex('#1a0830','#060412',t3), c1:lerpHex('#c02050','#180830',t3), c2:lerpHex('#8a2060','#0a0416',t3), type:'evening' };
}

function isDark(type) { return type==='night'||type==='evening'||type==='dawn'||type==='dusk'; }

function buildParticles() {
  ptcls = [];
  var hr=istHour(), info=pal(hr), dark=isDark(info.type);
  if (wState === 'rain') {
    for (var i=0;i<160;i++) ptcls.push({x:Math.random()*W,y:Math.random()*H,sx:2,sy:11+Math.random()*7,op:Math.random()*.28+.08,len:9+Math.random()*13,type:'rain'});
  } else if (wState === 'cloudy') {
    for (var i=0;i<22;i++) ptcls.push({x:Math.random()*W,y:10+Math.random()*H*.38,sx:.18+Math.random()*.14,sy:0,op:Math.random()*.16+.06,r:90+Math.random()*140,br:dark?168:255,type:'cloud'});
  } else if (dark) {
    var cnt=(info.type==='night'||info.type==='evening')?240:90;
    var mx=(info.type==='night'||info.type==='evening')?.9:.4;
    for (var i=0;i<cnt;i++) ptcls.push({x:Math.random()*W,y:Math.random()*H*.78,sz:Math.random()*1.6+.2,op:Math.random()*mx+.1,tw:Math.random()*Math.PI*2,twS:.018+Math.random()*.04,type:'star'});
  }
}

function drawSky() {
  var info=pal(istHour());
  var g=cx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,info.c0);
  g.addColorStop(info.c2?.5:1,info.c1);
  if(info.c2)g.addColorStop(1,info.c2);
  cx.fillStyle=g;cx.fillRect(0,0,W,H);
  if(info.type==='dawn'||info.type==='dusk'){
    var gx2=(info.type==='dawn')?W*.1:W*.9, sgR=H*.58;
    if(sgR>0){
      var sg=cx.createRadialGradient(gx2,sgR,0,gx2,sgR,sgR);
      if(info.type==='dusk'){sg.addColorStop(0,'rgba(255,200,40,0.38)');sg.addColorStop(.25,'rgba(255,100,20,0.22)');sg.addColorStop(.6,'rgba(220,40,80,0.10)');sg.addColorStop(1,'rgba(180,20,60,0)');}
      else{sg.addColorStop(0,'rgba(255,138,38,0.22)');sg.addColorStop(.4,'rgba(255,68,18,0.09)');sg.addColorStop(1,'rgba(255,68,18,0)');}
      cx.fillStyle=sg;cx.fillRect(0,0,W,H);
    }
    if(info.type==='dusk'){
      var sunX=W*.85,sunY=H*.72;
      var sunGlow=cx.createRadialGradient(sunX,sunY,0,sunX,sunY,W*.18);
      sunGlow.addColorStop(0,'rgba(255,230,80,0.55)');sunGlow.addColorStop(.2,'rgba(255,160,30,0.32)');sunGlow.addColorStop(.5,'rgba(220,80,20,0.14)');sunGlow.addColorStop(1,'rgba(200,40,60,0)');
      cx.fillStyle=sunGlow;cx.fillRect(0,0,W,H);
      cx.save();cx.beginPath();cx.arc(sunX,sunY,28,0,Math.PI*2);cx.fillStyle='rgba(255,220,60,0.92)';cx.fill();
      cx.beginPath();cx.arc(sunX,sunY,20,0,Math.PI*2);cx.fillStyle='rgba(255,250,200,0.95)';cx.fill();cx.restore();
      var shimmer=cx.createLinearGradient(0,H*.68,0,H*.78);
      shimmer.addColorStop(0,'rgba(255,200,60,0.18)');shimmer.addColorStop(.5,'rgba(255,140,20,0.28)');shimmer.addColorStop(1,'rgba(200,60,30,0.06)');
      cx.fillStyle=shimmer;cx.fillRect(0,H*.68,W,H*.12);
    }
  }
}

function drawSunRays() {
  if(!W||!H)return;
  var hr=istHour(), frac=Math.max(0,Math.min(1,(hr-6)/12));
  var scx=W*frac, scy=H*(.05+.1*Math.sin(Math.PI*frac));
  sunAngle+=.001;
  var maxL=Math.max(W,H)*1.5, hot=wTemp>=36;
  cx.save();
  for(var i=0;i<16;i++){
    var ang=(Math.PI*2/16)*i+sunAngle, maj=(i%2===0), rop=maj?.075:.04, rw=maj?.058:.03;
    cx.save();cx.translate(scx,scy);cx.rotate(ang);
    var rg=cx.createLinearGradient(0,0,maxL,0);
    if(hot){rg.addColorStop(0,'rgba(255,215,52,'+(rop+.02)+')');rg.addColorStop(.5,'rgba(255,162,12,'+rop+')');rg.addColorStop(1,'rgba(255,192,32,0)');}
    else{rg.addColorStop(0,'rgba(255,240,172,'+(rop+.01)+')');rg.addColorStop(.5,'rgba(192,226,255,'+rop+')');rg.addColorStop(1,'rgba(172,216,255,0)');}
    cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,maxL,-rw,rw);cx.closePath();cx.fillStyle=rg;cx.fill();cx.restore();
  }
  var dg=cx.createRadialGradient(scx,scy,0,scx,scy,130);
  dg.addColorStop(0,hot?'rgba(255,235,70,0.42)':'rgba(255,255,192,0.30)');dg.addColorStop(.3,hot?'rgba(255,192,32,0.12)':'rgba(255,235,152,0.10)');dg.addColorStop(1,'rgba(255,255,192,0)');
  cx.fillStyle=dg;cx.fillRect(0,0,W,H);cx.restore();
}

function drawMoon() {
  if(!W||!H)return;
  var mx=W*.82,my=H*.11;
  var mg=cx.createRadialGradient(mx,my,0,mx,my,100);
  mg.addColorStop(0,'rgba(215,226,255,0.15)');mg.addColorStop(1,'rgba(175,196,255,0)');
  cx.fillStyle=mg;cx.fillRect(0,0,W,H);
  cx.save();cx.beginPath();cx.arc(mx,my,20,0,Math.PI*2);cx.fillStyle='rgba(236,242,255,0.90)';cx.fill();
  cx.beginPath();cx.arc(mx+9,my-3,16,0,Math.PI*2);cx.fillStyle=pal(istHour()).c0;cx.fill();cx.restore();
}

function drawFrame() {
  cx.clearRect(0,0,W,H);
  drawSky();
  var hr=istHour(),info=pal(hr),dark=isDark(info.type);
  var isDay=(info.type==='day'||info.type==='hot'||info.type==='morning');
  if(isDay&&wState==='clear')drawSunRays();
  if(dark&&wState!=='rain')drawMoon();
  ptcls.forEach(function(pt){
    cx.save();cx.globalAlpha=pt.op;
    if(pt.type==='star'){pt.tw+=pt.twS;var sz=pt.sz*(.7+.3*Math.sin(pt.tw));cx.fillStyle='rgba(255,255,255,1)';cx.beginPath();cx.arc(pt.x,pt.y,sz,0,Math.PI*2);cx.fill();}
    else if(pt.type==='rain'){cx.strokeStyle=dark?'rgba(98,136,206,1)':'rgba(76,116,186,1)';cx.lineWidth=.75;cx.beginPath();cx.moveTo(pt.x,pt.y);cx.lineTo(pt.x+pt.sx,pt.y+pt.len);cx.stroke();pt.x+=pt.sx;pt.y+=pt.sy;if(pt.y>H){pt.x=Math.random()*W;pt.y=-20;}}
    else if(pt.type==='cloud'){var b=pt.br;cx.fillStyle='rgba('+b+','+b+','+(Math.min(b+14,255))+',1)';cx.beginPath();cx.ellipse(pt.x,pt.y,pt.r,pt.r*.38,0,0,Math.PI*2);cx.fill();cx.globalAlpha=pt.op*.25;cx.fillStyle='rgba(136,150,170,1)';cx.beginPath();cx.ellipse(pt.x+10,pt.y+6,pt.r*.82,pt.r*.27,0,0,Math.PI*2);cx.fill();pt.x+=pt.sx;if(pt.x>W+pt.r)pt.x=-pt.r;}
    cx.restore();
  });
  requestAnimationFrame(drawFrame);
}

/* THEMES */
var THEMES = {
  night:{text:'#eef0ff',muted:'#5060a8',soft:'#8090d0',blue:'#818cf8',sky:'#a78bfa',cyan:'#67e8f9',green:'#34d399',secbg:'rgba(4,4,22,0.84)',navbg:'rgba(4,4,22,0.95)',wcbg:'rgba(4,4,22,0.93)',border:'rgba(129,140,248,0.24)',navBorder:'rgba(129,140,248,0.18)',cardBg:'rgba(8,8,38,0.90)',cardBorder:'rgba(129,140,248,0.20)',flipBack:'linear-gradient(145deg,rgba(12,8,46,0.97),rgba(20,10,60,0.97))',btnGrad:'linear-gradient(135deg,#4c1d95,#7c3aed,#818cf8)',btnShadow:'rgba(124,58,237,0.55)',priceFontColor:'#c4b5fd',statGrad:'linear-gradient(135deg,#818cf8,#c4b5fd)',wcTipColor:'#67e8f9',wcTipBg:'rgba(103,232,249,0.08)',wcTagBg:'rgba(129,140,248,0.12)',wcTagBorder:'rgba(129,140,248,0.24)',svcListLine:'rgba(129,140,248,0.14)',svcListBullet:'#a78bfa',noteColor:'#fde68a',noteBg:'rgba(251,191,36,0.10)',noteBorder:'rgba(251,191,36,0.32)'},
  dawn:{text:'#fff4ec',muted:'#b86840',soft:'#e89060',blue:'#f97316',sky:'#fb923c',cyan:'#fbbf24',green:'#4ade80',secbg:'rgba(38,10,4,0.80)',navbg:'rgba(28,8,2,0.95)',wcbg:'rgba(28,8,2,0.93)',border:'rgba(249,115,22,0.28)',navBorder:'rgba(249,115,22,0.22)',cardBg:'rgba(48,14,4,0.90)',cardBorder:'rgba(249,115,22,0.22)',flipBack:'linear-gradient(145deg,rgba(54,16,4,0.97),rgba(76,22,6,0.97))',btnGrad:'linear-gradient(135deg,#9a3412,#ea580c,#f97316)',btnShadow:'rgba(234,88,12,0.55)',priceFontColor:'#fcd34d',statGrad:'linear-gradient(135deg,#ea580c,#f97316,#fbbf24)',wcTipColor:'#fde68a',wcTipBg:'rgba(252,211,77,0.09)',wcTagBg:'rgba(249,115,22,0.13)',wcTagBorder:'rgba(249,115,22,0.28)',svcListLine:'rgba(249,115,22,0.16)',svcListBullet:'#fbbf24',noteColor:'#fef9c3',noteBg:'rgba(251,191,36,0.12)',noteBorder:'rgba(251,191,36,0.38)'},
  morning:{text:'#072a50',muted:'#3870a0',soft:'#205888',blue:'#0284c7',sky:'#0ea5e9',cyan:'#06b6d4',green:'#16a34a',secbg:'rgba(218,242,255,0.80)',navbg:'rgba(255,255,255,0.96)',wcbg:'rgba(240,250,255,0.96)',border:'rgba(2,132,199,0.22)',navBorder:'rgba(14,165,233,0.22)',cardBg:'rgba(255,255,255,0.96)',cardBorder:'rgba(14,165,233,0.20)',flipBack:'linear-gradient(145deg,rgba(218,242,255,0.98),rgba(196,234,255,0.98))',btnGrad:'linear-gradient(135deg,#0369a1,#0284c7,#06b6d4)',btnShadow:'rgba(2,132,199,0.45)',priceFontColor:'#0369a1',statGrad:'linear-gradient(135deg,#0284c7,#0ea5e9,#67e8f9)',wcTipColor:'#0e7490',wcTipBg:'rgba(6,182,212,0.09)',wcTagBg:'rgba(14,165,233,0.10)',wcTagBorder:'rgba(14,165,233,0.20)',svcListLine:'rgba(14,165,233,0.14)',svcListBullet:'#0ea5e9',noteColor:'#78350f',noteBg:'rgba(245,158,11,0.10)',noteBorder:'rgba(245,158,11,0.30)'},
  day:{text:'#080e28',muted:'#3850a8',soft:'#1e3898',blue:'#1d4ed8',sky:'#3b82f6',cyan:'#06b6d4',green:'#16a34a',secbg:'rgba(228,238,255,0.82)',navbg:'rgba(255,255,255,0.97)',wcbg:'rgba(248,252,255,0.97)',border:'rgba(29,78,216,0.20)',navBorder:'rgba(59,130,246,0.22)',cardBg:'rgba(255,255,255,0.97)',cardBorder:'rgba(59,130,246,0.18)',flipBack:'linear-gradient(145deg,rgba(228,238,255,0.98),rgba(210,226,255,0.98))',btnGrad:'linear-gradient(135deg,#1e3a8a,#1d4ed8,#3b82f6)',btnShadow:'rgba(29,78,216,0.45)',priceFontColor:'#1e40af',statGrad:'linear-gradient(135deg,#1d4ed8,#3b82f6,#93c5fd)',wcTipColor:'#0369a1',wcTipBg:'rgba(6,182,212,0.08)',wcTagBg:'rgba(59,130,246,0.10)',wcTagBorder:'rgba(59,130,246,0.20)',svcListLine:'rgba(59,130,246,0.14)',svcListBullet:'#3b82f6',noteColor:'#78350f',noteBg:'rgba(245,158,11,0.10)',noteBorder:'rgba(245,158,11,0.30)'},
  hot:{text:'#1a0a00',muted:'#8b4000',soft:'#6b3000',blue:'#b45309',sky:'#d97706',cyan:'#f59e0b',green:'#15803d',secbg:'rgba(255,244,220,0.82)',navbg:'rgba(255,255,255,0.97)',wcbg:'rgba(255,252,240,0.97)',border:'rgba(180,83,9,0.22)',navBorder:'rgba(217,119,6,0.22)',cardBg:'rgba(255,255,255,0.97)',cardBorder:'rgba(217,119,6,0.20)',flipBack:'linear-gradient(145deg,rgba(255,244,220,0.98),rgba(255,234,196,0.98))',btnGrad:'linear-gradient(135deg,#92400e,#b45309,#d97706)',btnShadow:'rgba(180,83,9,0.48)',priceFontColor:'#92400e',statGrad:'linear-gradient(135deg,#b45309,#d97706,#fbbf24)',wcTipColor:'#92400e',wcTipBg:'rgba(245,158,11,0.10)',wcTagBg:'rgba(217,119,6,0.12)',wcTagBorder:'rgba(217,119,6,0.25)',svcListLine:'rgba(217,119,6,0.16)',svcListBullet:'#d97706',noteColor:'#78350f',noteBg:'rgba(245,158,11,0.12)',noteBorder:'rgba(245,158,11,0.35)'},
  dusk:{text:'#fff0ec',muted:'#b06050',soft:'#d88070',blue:'#e11d48',sky:'#f43f5e',cyan:'#fb923c',green:'#4ade80',secbg:'rgba(38,4,12,0.82)',navbg:'rgba(28,2,8,0.95)',wcbg:'rgba(28,2,8,0.93)',border:'rgba(244,63,94,0.28)',navBorder:'rgba(244,63,94,0.24)',cardBg:'rgba(50,4,16,0.90)',cardBorder:'rgba(244,63,94,0.22)',flipBack:'linear-gradient(145deg,rgba(58,4,18,0.97),rgba(80,8,26,0.97))',btnGrad:'linear-gradient(135deg,#9f1239,#be123c,#f43f5e)',btnShadow:'rgba(190,18,60,0.55)',priceFontColor:'#fda4af',statGrad:'linear-gradient(135deg,#e11d48,#f43f5e,#fb923c)',wcTipColor:'#fb923c',wcTipBg:'rgba(251,146,60,0.09)',wcTagBg:'rgba(244,63,94,0.13)',wcTagBorder:'rgba(244,63,94,0.28)',svcListLine:'rgba(244,63,94,0.16)',svcListBullet:'#fb923c',noteColor:'#fef9c3',noteBg:'rgba(251,191,36,0.10)',noteBorder:'rgba(251,191,36,0.32)'},
  evening:{text:'#dff8f8',muted:'#306878',soft:'#508898',blue:'#0891b2',sky:'#22d3ee',cyan:'#67e8f9',green:'#34d399',secbg:'rgba(0,12,20,0.84)',navbg:'rgba(0,8,16,0.95)',wcbg:'rgba(0,8,16,0.93)',border:'rgba(8,145,178,0.28)',navBorder:'rgba(8,145,178,0.22)',cardBg:'rgba(0,16,28,0.90)',cardBorder:'rgba(8,145,178,0.22)',flipBack:'linear-gradient(145deg,rgba(0,18,32,0.97),rgba(0,26,44,0.97))',btnGrad:'linear-gradient(135deg,#164e63,#0e7490,#0891b2)',btnShadow:'rgba(8,145,178,0.55)',priceFontColor:'#67e8f9',statGrad:'linear-gradient(135deg,#0891b2,#22d3ee,#67e8f9)',wcTipColor:'#67e8f9',wcTipBg:'rgba(103,232,249,0.08)',wcTagBg:'rgba(8,145,178,0.14)',wcTagBorder:'rgba(8,145,178,0.28)',svcListLine:'rgba(34,211,238,0.14)',svcListBullet:'#22d3ee',noteColor:'#fef9c3',noteBg:'rgba(251,191,36,0.10)',noteBorder:'rgba(251,191,36,0.32)'}
};

function getThemeKey(type) {
  if(type==='night')return'night';if(type==='dawn')return'dawn';if(type==='morning')return'morning';
  if(type==='hot')return'hot';if(type==='day'||type==='rainday'||type==='cloudy')return'day';
  if(type==='dusk')return'dusk';if(type==='evening')return'evening';return'day';
}

function applyTheme() {
  var hr=istHour(),inf=pal(hr),key=getThemeKey(inf.type),T=THEMES[key];
  var r=document.documentElement.style;
  r.setProperty('--text',T.text);r.setProperty('--muted',T.muted);r.setProperty('--soft',T.soft);
  r.setProperty('--blue',T.blue);r.setProperty('--sky',T.sky);r.setProperty('--cyan',T.cyan);
  r.setProperty('--green',T.green);r.setProperty('--secbg',T.secbg);r.setProperty('--navbg',T.navbg);
  r.setProperty('--wcbg',T.wcbg);r.setProperty('--border',T.border);
  var nb=document.getElementById('navbar');if(nb){nb.style.background=T.navbg;nb.style.borderBottomColor=T.navBorder;}
  var wc=document.getElementById('weatherCorner');if(wc){wc.style.background=T.wcbg;wc.style.borderColor=T.border;}
  var wcTempEl=document.getElementById('wcTemp');if(wcTempEl)wcTempEl.style.color=T.blue;
  var wcTip=document.getElementById('wcTip');if(wcTip){wcTip.style.color=T.wcTipColor;wcTip.style.background=T.wcTipBg;wcTip.style.borderColor=T.wcTipBg;}
  document.querySelectorAll('.wc-tag').forEach(function(el){el.style.background=T.wcTagBg;el.style.borderColor=T.wcTagBorder;el.style.color=T.soft;});
  var h1el=document.querySelector('.hero h1');if(h1el)h1el.style.color=T.text;
  var hsel=document.querySelector('.hero-sub');if(hsel)hsel.style.color=T.soft;
  var cta=document.querySelector('.nav-cta');if(cta){cta.style.background=T.btnGrad;cta.style.boxShadow='0 4px 14px '+T.btnShadow;}
  document.querySelectorAll('.btn-glow').forEach(function(b){b.style.background=T.btnGrad;b.style.boxShadow='0 6px 20px '+T.btnShadow;});
  document.querySelectorAll('.book-chip').forEach(function(b){b.style.background=T.btnGrad;});
  document.querySelectorAll('.flip-front').forEach(function(c){c.style.background=T.cardBg;c.style.borderColor=T.cardBorder;});
  document.querySelectorAll('.flip-back').forEach(function(c){c.style.background=T.flipBack;c.style.borderColor=T.cardBorder;});
  document.querySelectorAll('.svc-name').forEach(function(e){e.style.color=T.text;});
  document.querySelectorAll('.svc-price').forEach(function(e){e.style.color=T.priceFontColor;});
  document.querySelectorAll('.svc-list li').forEach(function(e){e.style.color=T.soft;e.style.borderBottomColor=T.svcListLine;});
  r.setProperty('--bullet-color',T.svcListBullet);
  document.querySelectorAll('.about-card').forEach(function(c){c.style.background=T.cardBg;c.style.borderColor=T.cardBorder;});
  document.querySelectorAll('.about-card h3').forEach(function(e){e.style.color=T.blue;});
  document.querySelectorAll('.about-card p').forEach(function(e){e.style.color=T.soft;});
  var sr=document.querySelector('.stats-row');if(sr){sr.style.background=T.cardBg;sr.style.borderColor=T.cardBorder;}
  document.querySelectorAll('.stat-num').forEach(function(e){e.style.background=T.statGrad;e.style.webkitBackgroundClip='text';e.style.backgroundClip='text';e.style.webkitTextFillColor='transparent';e.style.color='transparent';});
  document.querySelectorAll('.stat-lbl').forEach(function(e){e.style.color=T.muted;});
  document.querySelectorAll('.page-header h2,.about-hero h2,.brands-wrap h2').forEach(function(e){e.style.color=T.text;});
  document.querySelectorAll('.page-header p,.brands-sub').forEach(function(e){e.style.color=T.muted;});
  var fc=document.querySelector('.form-card');if(fc){fc.style.background=T.cardBg;fc.style.borderColor=T.cardBorder;}
  var ft=document.querySelector('.form-title');if(ft)ft.style.color=T.text;
  var bc=document.querySelector('.bill-card');if(bc){bc.style.background=T.cardBg;bc.style.borderColor=T.cardBorder;}
  var bh=document.querySelector('.bill-h');if(bh)bh.style.color=T.text;
  document.querySelectorAll('.brand-gcard,.brand-scroll-card').forEach(function(c){c.style.background=T.cardBg;c.style.borderColor=T.cardBorder;});
  document.querySelectorAll('.brand-gcard-name,.brand-scroll-card-name').forEach(function(e){e.style.color=T.muted;});
  document.querySelectorAll('.svc-note').forEach(function(e){e.style.color=T.noteColor;e.style.background=T.noteBg;e.style.borderColor=T.noteBorder;});
  var bn=document.querySelector('.booking-notice');
  if(bn){var darkTheme=(key==='night'||key==='dawn'||key==='dusk'||key==='evening');bn.style.background=darkTheme?'rgba(251,191,36,0.1)':'#fffbeb';bn.style.borderColor=darkTheme?'rgba(251,191,36,0.3)':'#fde68a';}
  /* Price card theme updates */
  document.querySelectorAll('.rc-category').forEach(function(c){c.style.background=T.cardBg;c.style.borderColor=T.cardBorder;});
  document.querySelectorAll('.rc-svc-name').forEach(function(e){e.style.color=T.text;});
  document.querySelectorAll('.rc-price').forEach(function(e){e.style.color=T.priceFontColor;});
  document.querySelectorAll('.rc-price-note').forEach(function(e){e.style.color=T.muted;});
  document.querySelectorAll('.rc-book-btn').forEach(function(b){b.style.background=T.btnGrad;});
  document.querySelectorAll('.rc-chip').forEach(function(c){c.style.borderColor=T.cardBorder;c.style.color=T.soft;});
  document.querySelectorAll('.rc-chip strong').forEach(function(e){e.style.color=T.blue;});
  var rcSearch=document.getElementById('rcSearch');if(rcSearch){rcSearch.style.borderColor=T.border;rcSearch.style.color=T.text;}
}

buildParticles();
drawFrame();
setInterval(function(){buildParticles();applyTheme();},60000);

/* WEATHER */
var WC={
  0:{i:'☀️',d:'Clear Sky',s:'clear'},1:{i:'🌤',d:'Mostly Clear',s:'clear'},
  2:{i:'⛅',d:'Partly Cloudy',s:'cloudy'},3:{i:'☁️',d:'Overcast',s:'cloudy'},
  45:{i:'🌫',d:'Foggy',s:'cloudy'},48:{i:'🌫',d:'Icy Fog',s:'cloudy'},
  51:{i:'🌦',d:'Drizzle',s:'rain'},53:{i:'🌦',d:'Drizzle',s:'rain'},
  55:{i:'🌧',d:'Heavy Drizzle',s:'rain'},61:{i:'🌧',d:'Light Rain',s:'rain'},
  63:{i:'🌧',d:'Rain',s:'rain'},65:{i:'🌧',d:'Heavy Rain',s:'rain'},
  80:{i:'🌦',d:'Showers',s:'rain'},81:{i:'🌦',d:'Heavy Showers',s:'rain'},
  95:{i:'⛈',d:'Thunderstorm',s:'rain'},99:{i:'⛈',d:'Severe Storm',s:'rain'}
};
function loadWeather(){
  fetch('https://geocoding-api.open-meteo.com/v1/search?name=Kanchipuram&count=1&language=en&format=json')
    .then(function(r){return r.json();})
    .then(function(gd){
      if(!gd.results||!gd.results.length)throw new Error('no results');
      var lat=gd.results[0].latitude,lon=gd.results[0].longitude;
      return fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,precipitation&timezone=Asia%2FKolkata');
    })
    .then(function(r){return r.json();})
    .then(function(data){
      var c=data.current,code=c.weather_code;
      var w=WC[code]||WC[Math.floor(code/10)*10]||{i:'☀️',d:'Clear Sky',s:'clear'};
      wTemp=Math.round(c.temperature_2m);wState=w.s;
      buildParticles();applyTheme();
      document.getElementById('wcIcon').textContent=w.i;
      document.getElementById('wcTemp').textContent=wTemp+'°C';
      document.getElementById('wcDesc').textContent=w.d+' · Feels '+Math.round(c.apparent_temperature)+'°C';
      document.getElementById('wcMeta').innerHTML="<span class='wc-tag'>"+c.relative_humidity_2m+"% humidity</span><span class='wc-tag'>"+Math.round(c.wind_speed_10m)+" km/h</span><span class='wc-tag'>"+c.precipitation+"mm</span>";
      var tip=wTemp>=36?'Extreme heat — service your AC now':wTemp>=32?'Hot day — ideal time to book AC service':wState==='rain'?'Rainy — good time to check for leaks':'Cooler day — great time to schedule maintenance';
      document.getElementById('wcTip').textContent=tip;
    })
    .catch(function(){
      wState='clear';wTemp=33;buildParticles();
      document.getElementById('wcIcon').textContent='☀️';
      document.getElementById('wcTemp').textContent='~33°C';
      document.getElementById('wcDesc').textContent='Typically Hot and Humid';
      document.getElementById('wcMeta').innerHTML="<span class='wc-tag'>~72% humidity</span><span class='wc-tag'>~14 km/h</span>";
      document.getElementById('wcTip').textContent='Kanchipuram stays hot — keep your AC serviced';
    });
}
loadWeather();
setInterval(loadWeather,600000);

/* Logo */
(function(){
  var wrap=document.getElementById('logoWrap');
  var img=document.createElement('img');
  img.src='LOGOS/bcc.png';img.alt=' AC';img.className='nav-logo-img';
  img.onerror=function(){wrap.innerHTML='<div class="nav-logo-fallback">❄</div>';};
  wrap.innerHTML='';wrap.appendChild(img);
  var footerWrap=document.getElementById('footerLogoWrap');
  if(footerWrap){
    var fImg=document.createElement('img');
    fImg.src='logos/bcc.png';fImg.alt=' AC';fImg.className='fb-logo-img';
    fImg.onerror=function(){fImg.style.display='none';var fb=document.createElement('div');fb.className='fb-logo-fallback';fb.textContent='❄';footerWrap.insertBefore(fb,footerWrap.firstChild);};
    footerWrap.innerHTML='';footerWrap.appendChild(fImg);
    var fTitle=document.createElement('span');
    fTitle.style.cssText="font-family:'DM Serif Display',serif;font-weight:400;font-size:1rem;color:white;";
    fTitle.textContent=' AC';footerWrap.appendChild(fTitle);
  }
}());

/* ROUTING */
window.addEventListener('scroll',function(){document.getElementById('navbar').classList.toggle('scrolled',scrollY>40);});
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open');}
var PAGES=['home','services','about','booking','billing','brands','pricecard'];
function showPage(pg){
  PAGES.forEach(function(id){document.getElementById(id).style.display=(id===pg)?'block':'none';});
  ['home','services','about','booking','brands','pricecard'].forEach(function(id){var el=document.getElementById('nl-'+id);if(el)el.classList.toggle('active',id===pg);});
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(applyTheme,10);
}

/* ============================================================
   SERVICES — icons are text/SVG-based, no emoji in SVG context
   FIX: removed emoji from SVG icon class, kept only in HTML text
============================================================ */
var SVC_NOTE='Technician will rectify your complaint. If additional issues are found, charges may vary.';
var SVCS=[
  ['AC Installation',    '🏗️','Install new AC units',       '₹1,499',['Wall mounting','Copper pipe setup','Drain pipe','Cooling test']],
  ['AC Repair',          '🔧','Fix all cooling problems',   '₹350',  ['Cooling diagnosis','Electrical check','Fan inspection','Thermostat test']],
  ['AC PCB Repair',      '💻','Fix PCB board issues',       '₹1,299',['PCB circuit diagnosis','Component replacement','Voltage testing','Cooling test']],
  ['AC Maintenance',     '🔩','Complete annual service',    '₹899',  ['Filter clean','Coil wash','Drain cleaning','Performance test']],
  ['Gas Refill',         '💨','R22 R32 R410A refill',       '₹2,799',['Leak inspection','Vacuum process','Gas refill','Cooling check']],
  ['AC Cleaning',        '🧹','Deep coil and filter wash',  '₹799',  ['Indoor cleaning','Coil wash','Filter sanitize','Dust removal']],
  ['Leak Detection',     '🔍','Detect and repair leaks',    '₹699',  ['Pipe inspection','Leak detection','Joint repair','Gas seal']],
  ['Compressor Replace', '⚙️','Full motor replacement',     '₹2,999',['Remove compressor','Install new unit','Gas recharge','Full testing']],
  ['Duct Cleaning',      '🌬️','Air duct deep clean',         '₹899',  ['Duct vacuum','Dust removal','Air flow test','Sanitize ducts']]
];

function parseRs(s){return parseInt(s.replace(/[₹,]/g,''))||0;}

function makeCard(s){
  var items=s[4].map(function(d){return'<li>'+d+'</li>';}).join('');
  return '<div class="flip-card"><div class="flip-inner">'+
    '<div class="flip-front"><div class="svc-icon">'+s[1]+'</div>'+
    '<div class="svc-name">'+s[0]+'</div>'+
    '<div class="svc-tagline">'+s[2]+'</div></div>'+
    '<div class="flip-back"><div class="svc-price">'+s[3]+'</div>'+
    '<ul class="svc-list">'+items+'</ul>'+
    '<div class="svc-note"><span>⚠</span> '+SVC_NOTE+'</div>'+
    '<button class="book-chip" onclick="selectSvc(\''+s[0]+'\')">Book Now</button>'+
    '</div></div></div>';
}

var svcBox=document.getElementById('serviceBox');
var homeBox=document.getElementById('homeServiceBox');
var svcSel=document.getElementById('serviceSelect');

/* ============================================================
   FIX: Build merged service options (SVCS + RC_CATEGORIES)
   We build RC_CATEGORIES first, then populate the dropdown
============================================================ */
var RC_CATEGORIES=[
  {name:'General Services',items:[
    {name:'Deep-jet AC Service',price:699},
    {name:'Gas Charging',price:2800},
    {name:'Cooling Coil Repair with Anti-rust Coating',price:899},
    {name:'Replace Sensor',price:800},
    {name:'Anti-rust Spray (Avoid Gas Leak)',price:349},
    {name:'Water Leakage Repaired - Split AC',price:799},
    {name:'Stabilizer Repair',price:1500}
  ]},
  {name:'PCB and Electrical',items:[
    {name:'Non-Inverter PCB Repaired',price:1500},
    {name:'Inverter PCB Repaired',price:4000},
    {name:'Contactor Replaced',price:900},
    {name:'Contactor - Daikin / O-General',price:1500},
    {name:'Fan Capacitor (2.5 to 10 mfd)',price:400},
    {name:'Comp Capacitor (25 to 60 mfd)',price:800},
    {name:'Combo Capacitor (Comp + Fan)',price:900}
  ]},
  {name:'Motor and Blower',items:[
    {name:'Fan Motor - Split AC',price:2299},
    {name:'Blower Motor - Split AC',price:2699},
    {name:'Blower Motor (DC) - Split AC',price:3800},
    {name:'Fan Motor (DC) - Split AC',price:3800},
    {name:'AC Fan Blade',price:1300}
  ]},
  {name:'Installation and Uninstallation',items:[
    {name:'AC Installation',price:1499},
    {name:'AC Uninstallation',price:699},
    {name:'Outdoor Unit Reinstalled',price:799},
    {name:'Indoor Unit Reinstalled',price:699},
    {name:'1 ft Copper Pipe Set Labour',price:350}
  ]},
  {name:'Accessories and Parts',items:[
    {name:'Split AC Wall Stand',price:750},
    {name:'Floor Stand',price:550},
    {name:'Universal Back Plate',price:300},
    {name:'Fastener Complete Set',price:200}
  ]}
];

/* Render service flip cards */
SVCS.forEach(function(s){
  var card=makeCard(s);
  svcBox.innerHTML+=card;
  homeBox.innerHTML+=card;
});

/* Build booking dropdown with ALL services (SVCS + Price card) */
function buildServiceDropdown(){
  svcSel.innerHTML='<option value="">Select Service</option>';

  /* Group 1: Main services */
  var grp1=document.createElement('optgroup');
  grp1.label='Our Services';
  SVCS.forEach(function(s){
    var opt=document.createElement('option');
    opt.value=s[0];opt.textContent=s[0]+' — from '+s[3];
    grp1.appendChild(opt);
  });
  svcSel.appendChild(grp1);

  /* Group 2: Price card services by category */
  RC_CATEGORIES.forEach(function(cat){
    var grp=document.createElement('optgroup');
    grp.label=cat.name;
    cat.items.forEach(function(item){
      var opt=document.createElement('option');
      opt.value=item.name;
      opt.textContent=item.name+' — Rs. '+item.price.toLocaleString('en-IN');
      grp.appendChild(opt);
    });
    svcSel.appendChild(grp);
  });
}
buildServiceDropdown();

/* ============================================================
   Price card — Build accordion
============================================================ */
(function(){
  var container=document.getElementById('rcCategories');
  var summary=document.getElementById('rcSummary');
  if(!container)return;
  var totalItems=RC_CATEGORIES.reduce(function(a,c){return a+c.items.length;},0);
  var minPrice=Infinity;
  RC_CATEGORIES.forEach(function(cat){cat.items.forEach(function(item){if(item.price<minPrice)minPrice=item.price;});});
  if(summary){
    summary.innerHTML=
      '<div class="rc-chip"><strong>'+totalItems+'</strong>&nbsp;Services</div>'+
      '<div class="rc-chip">From&nbsp;<strong>Rs. '+minPrice+'</strong></div>'+
      '<div class="rc-chip"><strong>'+RC_CATEGORIES.length+'</strong>&nbsp;Categories</div>'+
      '<div class="rc-chip">Same-Day&nbsp;<strong>Available</strong></div>';
  }
  RC_CATEGORIES.forEach(function(cat,ci){
    var catEl=document.createElement('div');
    catEl.className='rc-category';catEl.id='rc-cat-'+ci;
    var header=document.createElement('div');
    header.className='rc-cat-header';
    header.innerHTML=
      '<div class="rc-cat-left">'+
        '<span class="rc-cat-name">'+cat.name+'</span>'+
        '<span class="rc-cat-count">'+cat.items.length+' services</span>'+
      '</div>'+
      '<div class="rc-chevron">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'+
      '</div>';
    header.addEventListener('click',function(){catEl.classList.toggle('open');});
    var body=document.createElement('div');
    body.className='rc-cat-body';
    var tableRows='';
    cat.items.forEach(function(item){
      tableRows+=
        '<tr class="rc-row" data-search="'+item.name.toLowerCase()+'">'+
          '<td><div class="rc-svc-name">'+item.name+'</div></td>'+
          '<td class="rc-price-cell">'+
            '<div class="rc-price">Rs. '+item.price.toLocaleString('en-IN')+'</div>'+
            '<span class="rc-price-note">Starting rate</span>'+
          '</td>'+
          '<td class="rc-book-cell">'+
            '<button class="rc-book-btn" onclick="selectSvc(\''+item.name.replace(/'/g,"\\'")+'\')">' +
            'Book Now</button>'+
          '</td>'+
        '</tr>';
    });
    body.innerHTML=
      '<table class="rc-table"><tbody>'+tableRows+'</tbody></table>'+
      '<div class="rc-footer-note">Prices shown are starting rates. Technician will diagnose on-site; additional issues found beyond the stated complaint may vary charges accordingly.</div>';
    catEl.appendChild(header);catEl.appendChild(body);container.appendChild(catEl);
  });
})();

function filterRC(val){
  var q=val.trim().toLowerCase(),totalVisible=0;
  document.querySelectorAll('.rc-category').forEach(function(catEl){
    var rows=catEl.querySelectorAll('.rc-row'),visInCat=0;
    rows.forEach(function(row){var match=!q||row.getAttribute('data-search').indexOf(q)!==-1;row.classList.toggle('rc-row-hidden',!match);if(match)visInCat++;});
    if(visInCat===0&&q){catEl.classList.add('cat-hidden');}else{catEl.classList.remove('cat-hidden');if(q&&visInCat>0)catEl.classList.add('open');totalVisible+=visInCat;}
  });
  var noRes=document.getElementById('rcNoResults');if(noRes)noRes.classList.toggle('visible',totalVisible===0&&!!q);
  if(!q){document.querySelectorAll('.rc-category').forEach(function(c){c.classList.remove('open');});}
}

/* ============================================================
   FIX: selectSvc — handles both SVCS names and RC item names
============================================================ */
function selectSvc(n){
  /* Try to find option in dropdown */
  var found=false;
  for(var i=0;i<svcSel.options.length;i++){
    if(svcSel.options[i].value===n){svcSel.selectedIndex=i;found=true;break;}
  }
  if(!found&&n){
    /* Option not in list — add it dynamically */
    var opt=document.createElement('option');
    opt.value=n;opt.textContent=n;svcSel.appendChild(opt);svcSel.value=n;
  }
  showPage('booking');
}

/* BOOKING — FIX: Google Maps uses correct maps search URL (no JavaScript: pseudo) */
var bDateEl=document.getElementById('bDate');
var today=new Date();
bDateEl.min=bDateEl.value=today.toISOString().split('T')[0];

var OWNER='919791141298';
var lastBooks={};

function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}
function lsGet(key){try{var raw=localStorage.getItem(key);return raw?JSON.parse(raw):null;}catch(e){return null;}}

function submitBooking(){
  var name=getVal('bName').trim();
  var phone=getVal('bPhone').trim();
  var addr=getVal('bAddress').trim();
  var svc=svcSel.value;
  var date=bDateEl.value;
  if(!name||!phone||!addr||!svc){alert('Please fill in Name, Phone, Address and Service.');return;}
  var ref='CC-'+Math.floor(100000+Math.random()*900000);

  /* Find price: check SVCS first, then RC_CATEGORIES */
  var price=0;
  var foundSvc=SVCS.find(function(s){return s[0]===svc;});
  if(foundSvc){price=parseRs(foundSvc[3]);}else{
    RC_CATEGORIES.forEach(function(cat){
      cat.items.forEach(function(item){if(item.name===svc)price=item.price;});
    });
  }

  var bk={name:name,phone:phone,addr:addr,svc:svc,date:date,price:price};
  lastBooks[ref]=bk;lsSet('cc_'+ref,bk);

  setText('popRef',ref);
  var popup=elById('bookingPopup');if(popup)popup.classList.add('show');

  /* FIX: Proper Google Maps search URL — no JavaScript: protocol */
  var mapsUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(addr+', Kanchipuram, Tamil Nadu');

  var msg='NEW AC SERVICE BOOKING\n'+
    '━━━━━━━━━━━━━━━━━━\n'+
    'Ref: '+ref+'\n'+
    'Name: '+name+'\n'+
    'Phone: '+phone+'\n'+
    'Service: '+svc+'\n'+
    'Date: '+date+'\n'+
    '━━━━━━━━━━━━━━━━━━\n'+
    'Address: '+addr+'\n'+
    'Maps: '+mapsUrl+'\n'+
    '━━━━━━━━━━━━━━━━━━\n'+
    'via website booking';

  setTimeout(function(){
    window.open('https://wa.me/'+OWNER+'?text='+encodeURIComponent(msg),'_blank');
  },1200);
}

function closePopup(){
  var popup=elById('bookingPopup');if(popup)popup.classList.remove('show');
  ['bName','bPhone','bAddress'].forEach(function(id){setVal(id,'');});
  svcSel.value='';
}

/* ADMIN */
function loginOwner(){
  var pw=prompt('Enter Owner Password:');
  if(pw==='admin123'){var an=document.getElementById('adminNav');if(an)an.style.display='inline-block';showPage('billing');}
  else if(pw!==null){alert('Access Denied');}
}
function logoutOwner(){var an=document.getElementById('adminNav');if(an)an.style.display='none';showPage('home');}

/* BILLING HELPERS */
function elById(id){return document.getElementById(id);}
function setDisplay(id,val){var el=elById(id);if(el)el.style.display=val;}
function setHTML(id,html){var el=elById(id);if(el)el.innerHTML=html;}
function setText(id,txt){var el=elById(id);if(el)el.textContent=txt;}
function getVal(id){var el=elById(id);return el?el.value:'';}
function setVal(id,v){var el=elById(id);if(el)el.value=v;}

function applyRef(){
  var val=getVal('refInput').trim().toUpperCase();
  if(!val){alert('Enter a reference number.');return;}
  var bk=lastBooks[val]||lsGet('cc_'+val);
  setText('refBannerVal',val);setDisplay('refBanner','flex');setDisplay('refEntryWrap','none');
  if(bk){
    setVal('custName',bk.name||'');setVal('custPhone',bk.phone?bk.phone.replace(/\D/g,''):'');
    setText('refBannerName','Customer: '+bk.name+'  Service: '+bk.svc);
    setDisplay('refServicesBox','block');
    setHTML('refServicesList',
      '<div class="ref-svc-item">'+
      '<div class="ref-svc-name">'+bk.svc+'</div>'+
      '<input type="number" id="refSvcPrice" value="'+bk.price+'" '+
      'style="width:90px;padding:5px 8px;border-radius:8px;border:1.5px solid rgba(14,165,233,.25);'+
      'background:#eff6ff;color:#1565c0;font-family:\'DM Sans\',sans-serif;font-size:.9rem;font-weight:600;'+
      'outline:none;text-align:right;"></div>');
  }else{
    setText('refBannerName','Not found in this session. Enter details manually.');
    setDisplay('refServicesBox','none');
  }
}
function clearRef(){setDisplay('refBanner','none');setDisplay('refEntryWrap','block');setVal('refInput','');setText('refBannerName','');setDisplay('refServicesBox','none');setHTML('refServicesList','');}
function activeRef(){var rb=elById('refBanner');return(rb&&rb.style.display!=='none')?(elById('refBannerVal')?elById('refBannerVal').textContent:'—'):'—';}

function getLines(){
  var lines=[];
  var rbox=document.getElementById('refServicesBox');
  if(rbox&&rbox.style.display!=='none'){
    var nm=document.querySelector('#refServicesList .ref-svc-name');
    var pr=document.getElementById('refSvcPrice');
    if(nm&&pr&&nm.textContent.trim())lines.push({desc:nm.textContent.trim(),price:parseFloat(pr.value)||0});
  }
  var ds=document.getElementsByClassName('bDesc'),ps=document.getElementsByClassName('bPrice');
  for(var i=0;i<ds.length;i++){if(ds[i].value.trim())lines.push({desc:ds[i].value.trim(),price:parseFloat(ps[i].value)||0});}
  return lines;
}
function addBillRow(){
  var w=document.getElementById('billItems'),d=document.createElement('div');
  d.className='bill-row';
  d.innerHTML='<input type="text" class="bDesc" placeholder="Service Description"><input type="number" class="bPrice" placeholder="Price"><div class="rm-row" onclick="removeRow(this)">✕</div>';
  w.appendChild(d);
}
function removeRow(btn){btn.parentElement.remove();}

/* PDF */
function getJsPDF(){
  if(window.jspdf&&window.jspdf.jsPDF)return window.jspdf.jsPDF;
  if(window.jsPDF)return window.jsPDF;
  if(window.jspdf&&typeof window.jspdf==='function')return window.jspdf;
  try{if(window.module&&window.module.exports){var ex=window.module.exports;if(ex.jsPDF)return ex.jsPDF;if(typeof ex==='function')return ex;}}catch(e){}
  return null;
}

function generatePDF(){
  var jsPDF=getJsPDF();
  if(!jsPDF){alert('PDF library not loaded yet. Please wait a moment and try again.');return;}
  var doc=new jsPDF();
  var cName=getVal('custName').trim()||'Valued Customer';
  var ref=activeRef(),lines=getLines();
  if(!lines.length){alert('Add at least one service line.');return;}
  var total=lines.reduce(function(s,l){return s+l.price;},0);

  doc.setFillColor(232,244,255);doc.rect(0,0,210,297,'F');
  doc.setFillColor(8,28,58);doc.rect(0,0,210,66,'F');
  doc.setFillColor(6,182,212);doc.rect(0,66,210,3,'F');

  var logoLoaded=false;
  try{
    var logoEl=document.querySelector('.nav-logo-img');
    if(logoEl&&logoEl.complete&&logoEl.naturalWidth>0){
      var tmpC=document.createElement('canvas');tmpC.width=logoEl.naturalWidth;tmpC.height=logoEl.naturalHeight;
      tmpC.getContext('2d').drawImage(logoEl,0,0);
      doc.addImage(tmpC.toDataURL('image/png'),'PNG',8,8,42,42);logoLoaded=true;
    }
  }catch(e){logoLoaded=false;}

  var tx=logoLoaded?56:12;
  doc.setFont('helvetica','bold');doc.setFontSize(20);doc.setTextColor(255,255,255);doc.text(' AC',tx,24);
  doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(6,182,212);doc.text('AC SERVICE',tx,33);
  doc.setFontSize(7.5);doc.setTextColor(150,200,240);
  doc.text('+91 97911 41298   kevinjosh714@gmail.com',tx,42);
  doc.text('Service  |  Installation  |  Repair  |  Gas Refill  |  PCB Repair',tx,50);
  doc.text('Kanchipuram, Tamil Nadu',tx,58);

  if(ref&&ref!=='—'&&ref!=='-'){
    doc.setFillColor(12,80,160);doc.roundedRect(146,9,56,36,3,3,'F');
    doc.setFillColor(6,182,212);doc.roundedRect(146,9,56,10,3,3,'F');doc.rect(146,15,56,4,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(8,28,58);doc.text('BOOKING REF',174,16,{align:'center'});
    doc.setFontSize(12);doc.setTextColor(255,255,255);doc.text(ref,174,31,{align:'center'});
  }

  doc.setFillColor(255,255,255);doc.roundedRect(10,74,190,28,3,3,'F');
  doc.setFillColor(6,182,212);doc.rect(10,74,5,28,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(17);doc.setTextColor(8,28,58);doc.text('INVOICE',21,87);
  doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(80,100,130);doc.text('INV-'+Date.now().toString().slice(-6),21,96);
  doc.setFontSize(9);doc.setTextColor(40,60,90);doc.text('Date: '+new Date().toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'}),128,87);

  doc.setFillColor(255,255,255);doc.roundedRect(10,107,190,24,3,3,'F');
  doc.setFillColor(8,28,58);doc.rect(10,107,5,24,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(6,182,212);doc.text('BILL TO',20,117);
  doc.setFont('helvetica','normal');doc.setFontSize(11);doc.setTextColor(8,28,58);doc.text(cName,20,126);

  doc.autoTable({
    startY:137,
    head:[['Service Description','Qty','Rate','Amount']],
    body:lines.map(function(l){return[l.desc,'1','Rs. '+l.price.toFixed(2),'Rs. '+l.price.toFixed(2)];}),
    theme:'grid',
    headStyles:{fillColor:[8,28,58],textColor:[6,182,212],fontStyle:'bold',fontSize:10,cellPadding:6},
    bodyStyles:{fontSize:10,textColor:[10,30,60],fillColor:[255,255,255],cellPadding:5},
    alternateRowStyles:{fillColor:[237,248,255]},
    columnStyles:{0:{cellWidth:90},1:{cellWidth:18,halign:'center'},2:{cellWidth:42,halign:'right'},3:{cellWidth:40,halign:'right'}},
    styles:{lineColor:[6,182,212],lineWidth:0.3}
  });

  var fy=doc.lastAutoTable.finalY+10;
  doc.setFillColor(8,28,58);doc.roundedRect(118,fy,82,24,3,3,'F');
  doc.setFillColor(6,182,212);doc.roundedRect(118,fy,82,9,3,3,'F');doc.rect(118,fy+5,82,4,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(8,28,58);doc.text('TOTAL AMOUNT',159,fy+7,{align:'center'});
  doc.setFontSize(15);doc.setTextColor(255,255,255);doc.text('Rs. '+total.toFixed(2),159,fy+19,{align:'center'});

  var footY=Math.max(fy+38,262);
  doc.setFillColor(8,28,58);doc.rect(0,footY,210,35,'F');
  doc.setFillColor(6,182,212);doc.rect(0,footY,210,2.5,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(9.5);doc.setTextColor(255,255,255);
  doc.text('Thank you for choosing  AC AC Service!',105,footY+11,{align:'center'});
  doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(150,205,245);
  doc.text('Support: +91 97911 41298 kevinjosh714@gmail.com',105,footY+20,{align:'center'});
  doc.text('Kanchipuram, Tamil Nadu   |   6 Days a Week   |   Same Day Service',105,footY+28,{align:'center'});

  doc.save('Invoice_'+cName.replace(/\s/g,'_')+'_'+Date.now().toString().slice(-6)+'.pdf');
}

function sendInvoice(){
  var phone=getVal('custPhone').trim(),name=getVal('custName').trim()||'Customer',ref=activeRef();
  if(!phone){alert('Enter customer phone number.');return;}
  var lines=getLines();if(!lines.length){alert('Add at least one service line.');return;}
  var total=0,det='';
  lines.forEach(function(l){total+=l.price;det+='* '+l.desc+': Rs '+l.price.toFixed(2)+'\n';});
  var msg='INVOICE —  AC AC SERVICE\n'+(ref&&ref!=='—'?'Ref: '+ref+'\n':'')+'Hello '+name+', thank you for choosing us!\n\nServices Completed:\n'+det+'\nTOTAL: Rs '+total.toFixed(2)+'\n\nPhone: +91 87780 75349\nThank you';
  window.open('https://wa.me/91'+phone+'?text='+encodeURIComponent(msg),'_blank');
}

/* BRANDS */
var BRANDS=[
  {name:'Daikin',file:'daikin.png'},{name:'LG',file:'lg.png'},
  {name:'Samsung',file:'samsung.png'},{name:'Voltas',file:'voltas.png'},
  {name:'Hitachi',file:'hitatchi.png'},{name:'Panasonic',file:'panasonic.png'},
  {name:'Blue Star',file:'bs.png'},{name:'Carrier',file:'carrier.png'},
  {name:'Mitsubishi',file:'mitshu.png'},{name:'Godrej',file:'godrej.jpg'},
  {name:'Whirlpool',file:'wp.png'},{name:'O General',file:'og.png'}
];

var bGrid=document.getElementById('brandGrid');
BRANDS.forEach(function(b){
  var card=document.createElement('div');card.className='brand-gcard';
  var img=document.createElement('img');
  img.src='BRANDS/'+b.file;img.alt=b.name+' logo';img.width=100;img.height=50;img.loading='lazy';
  img.style.objectFit='contain';img.style.display='block';
  var lbl=document.createElement('div');lbl.className='brand-gcard-name';lbl.textContent=b.name;
  card.appendChild(img);card.appendChild(lbl);bGrid.appendChild(card);
});

var bTrack=document.getElementById('brandScrollTrack');
if(bTrack){
  var scrollHTML='';
  for(var sc=0;sc<2;sc++){
    BRANDS.forEach(function(b){
      scrollHTML+='<div class="brand-scroll-card">'+
        '<img src="BRANDS/'+b.file+'" alt="'+b.name+'" loading="lazy">'+
        '<div class="brand-scroll-card-name">'+b.name+'</div>'+
        '</div>';
    });
  }
  bTrack.innerHTML=scrollHTML;
}

applyTheme();
