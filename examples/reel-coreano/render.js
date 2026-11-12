// node render.js <reel.html> <outDir> [t1,t2,...]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [html,out,st]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file://'+html);await p.evaluate(()=>document.fonts.ready);
 const times=st?st.split(',').map(Number):[...Array(Math.round(30*await p.evaluate(()=>TOTAL))).keys()].map(i=>i/30);
 for(let i=0;i<times.length;i++){await p.evaluate(t=>frame(t),times[i]);
  await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.png`});}
 await b.close();})();
