// Functional smoke checks in a small DOM harness; these are not visual browser tests.
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const script = readFileSync(require('node:path').join(__dirname,'../scripts/atelier.js'),'utf8');
class Element {
  constructor() {
    this.events={}; this.attrs={}; this.dataset={}; this.children=[];
    this.style={setProperty:(k,v)=>{this.style[k]=v;}};
    const classes=new Set();
    this.classList={add:(...a)=>a.forEach(x=>classes.add(x)),remove:(...a)=>a.forEach(x=>classes.delete(x)),toggle:(x,v)=>v?classes.add(x):classes.delete(x),contains:x=>classes.has(x)};
  }
  addEventListener(k,fn){(this.events[k]??=[]).push(fn);}
  dispatchEvent(e){for(const fn of this.events[e.type]??[]) fn(e);}
  setAttribute(k,v){this.attrs[k]=v;}
  getAttribute(k){return this.attrs[k];}
  querySelectorAll(){return this.children;}
  focus(){this.focused=true;}
  getClientRects(){return [1];}
}
for (const mode of ['desktop','mobile','reduced','stored','blocked-storage']) {
  const nodes=Object.fromEntries(['.site-nav','.site-menu-toggle','.site-nav-links','.menu-shade','.back-to-top','.motion-toggle','.site-dust'].map(s=>[s,new Element()]));
  const doc=new Element(); doc.documentElement=new Element(); doc.documentElement.scrollHeight=2400; doc.hidden=false;
  doc.querySelector=s=>nodes[s]??null; doc.querySelectorAll=()=>[];
  const context=new Proxy({}, {get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
  nodes['.site-dust'].getContext=()=>context;
  const raf=new Map(); let nextId=0;
  const queries={};
  const sandbox={document:doc,innerWidth:mode==='mobile'?390:1440,innerHeight:900,scrollY:100,devicePixelRatio:2,
    matchMedia:q=>queries[q]??=(Object.assign(new Element(),{matches:q.includes('reduce')?mode==='reduced':q.includes('hover')?mode!=='mobile':mode==='mobile'})),
    localStorage:{getItem:()=>{if(mode==='blocked-storage')throw Error('blocked'); return mode==='stored'?'paused':null;},setItem:()=>{}},
    requestAnimationFrame:fn=>{raf.set(++nextId,fn);return nextId;},cancelAnimationFrame:id=>raf.delete(id),
    addEventListener:()=>{},performance:{now:()=>0},Event:class{constructor(type){this.type=type;}},setTimeout:()=>{},navigator:{},getComputedStyle:()=>({})};
  sandbox.window=sandbox;
  vm.runInNewContext(script,sandbox);
  doc.dispatchEvent({type:'DOMContentLoaded'});
  assert.equal(doc.documentElement.dataset.motion,['reduced','stored'].includes(mode)?'paused':'full',mode);
  assert.equal(raf.size>0,!['mobile','reduced','stored'].includes(mode),`${mode}: animation loop`);
  nodes['.site-menu-toggle'].dispatchEvent({type:'click'});
  assert.equal(nodes['.site-menu-toggle'].getAttribute('aria-expanded'),'true');
  doc.dispatchEvent({type:'keydown',key:'Escape'});
  assert.equal(nodes['.site-menu-toggle'].getAttribute('aria-expanded'),'false');
  if(mode==='desktop') {
    const tick=raf.values().next().value;raf.clear();tick(40);
    assert.equal(raf.size,1,'one active animation loop');
    nodes['.motion-toggle'].dispatchEvent({type:'click'});
    assert.equal(doc.documentElement.dataset.motion,'paused');assert.equal(raf.size,0);
    nodes['.motion-toggle'].dispatchEvent({type:'click'});
    assert.equal(doc.documentElement.dataset.motion,'full');assert.equal(raf.size,1);
    doc.hidden=true;doc.dispatchEvent({type:'visibilitychange'});assert.equal(raf.size,0);
    doc.hidden=false;doc.dispatchEvent({type:'visibilitychange'});assert.equal(raf.size,1);
  }
}
console.log('PASS: desktop/mobile/reduced motion, saved preference, blocked storage, menu/Escape, pause/resume and hidden-tab animation lifecycle.');
