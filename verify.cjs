const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),code=html.split('<script>')[1].split('</script>')[0],els=new Map(),storage=new Map();
const el=id=>{if(!els.has(id))els.set(id,{innerHTML:'',textContent:''});return els.get(id)};
const ctx=vm.createContext({document:{getElementById:el,querySelectorAll:()=>[]},localStorage:{setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k)},matchMedia:()=>({matches:true})});
vm.runInContext(code,ctx);const run=s=>vm.runInContext(s,ctx);
for(const t of run('tabs')){run('tab='+JSON.stringify(t)+';render()');assert(!el('panel').innerHTML.includes('Review assumptions'));assert(el('panel').innerHTML.includes('<h2>'))}
assert(Math.abs(run('model({...defaults,sales:100,growth:0,margin:20,tax:0,da:0,cap:0,g:0,rf:10,beta:0,weight:0,cash:5,debt:15,shares:10}).v')-19)<1e-10);
assert.throws(()=>run('model({...defaults,g:30})'));assert.throws(()=>run('model({...defaults,shares:0})'));
assert.equal(run('model(defaults).v'),run('model(defaults,model(defaults).w).v'));
el('save').onclick();el('controls').oninput({target:{id:'sales',valueAsNumber:2000}});assert.equal(run('a.sales'),2000);el('load').onclick();assert.equal(run('a.sales'),1000);
console.log('All seven views, valuation fixture, invalid assumptions, sensitivity base and snapshot round-trip passed.');