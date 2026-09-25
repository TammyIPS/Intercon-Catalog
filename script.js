import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
const pdf=await pdfjsLib.getDocument('catalog-web.pdf').promise;
const left=document.querySelector('.left'),right=document.querySelector('.right');
const lc=document.getElementById('left'),rc=document.getElementById('right');
const status=document.getElementById('status'),prev=document.getElementById('prev'),next=document.getElementById('next');
let spread=0, zoom=1;
async function paint(n,canvas){const page=await pdf.getPage(n);const vp=page.getViewport({scale:1.55});canvas.width=vp.width;canvas.height=vp.height;await page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise}
async function render(dir=''){
 const mobile=matchMedia('(max-width:760px)').matches;
 if(spread===0){left.classList.add('hidden');right.classList.remove('hidden');await paint(1,rc);status.textContent='Cover';}
 else if(mobile){left.classList.add('hidden');right.classList.remove('hidden');const p=Math.min(spread+1,pdf.numPages);await paint(p,rc);status.textContent=`Page ${p} / ${pdf.numPages}`;}
 else {const p1=spread+1,p2=spread+2;left.classList.remove('hidden');right.classList.toggle('hidden',p2>pdf.numPages);await paint(p1,lc);if(p2<=pdf.numPages)await paint(p2,rc);status.textContent=p2<=pdf.numPages?`Pages ${p1}–${p2} / ${pdf.numPages}`:`Page ${p1} / ${pdf.numPages}`;}
 prev.disabled=spread===0; next.disabled=mobile?spread+1>=pdf.numPages:spread+2>=pdf.numPages;
 const target=dir==='next'?right:left;target.classList.remove('turn-next','turn-prev');void target.offsetWidth;if(dir)target.classList.add(dir==='next'?'turn-next':'turn-prev');
}
next.onclick=()=>{const mobile=matchMedia('(max-width:760px)').matches;spread=Math.min(spread+(mobile?1:2),mobile?pdf.numPages-1:pdf.numPages-1);render('next')};
prev.onclick=()=>{const mobile=matchMedia('(max-width:760px)').matches;spread=Math.max(0,spread-(mobile?1:2));render('prev')};
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next.click();if(e.key==='ArrowLeft')prev.click()});
document.getElementById('zoomIn').onclick=()=>{zoom=Math.min(1.35,zoom+.1);document.documentElement.style.setProperty('--scale',zoom)};
document.getElementById('zoomOut').onclick=()=>{zoom=Math.max(.7,zoom-.1);document.documentElement.style.setProperty('--scale',zoom)};
document.getElementById('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>render(),150)});render();
