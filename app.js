const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const C=(a,b,c,d)=>[['Hot 8 oz',a],['Hot 12 oz',b],['Iced 12 oz',c],['Iced 16 oz',d]];
const T=(a,b)=>[['12 oz',a],['16 oz',b]],F=p=>[['Regular',p]];
const M=[];const add=(cat,e,list)=>list.forEach(x=>M.push({cat,e,n:x[0],v:x[1]}));
add('Coffee','☕',[['Springboard Latte',C(130,150,165,185)],['Cappuccino',C(120,140,155,175)],['Cafe Americano',C(110,130,145,165)],['Spanish Coffee',C(130,150,165,185)],['Cafe Mocha',C(130,150,165,185)],['Caramel Macchiato',C(130,150,165,185)],['Nutty Hazelnut Latte',C(130,150,165,185)]]);
add('Non-Coffee','🍫',['European Chocolate','White Chocolate','Chamomile Red Berry Iced Tea','Lemon Cucumber Blend','Strawberry Cream Cooler','Green Apple Citrus Blend'].map(n=>[n,T(130,150)]));
add('Matcha','🍵',['Hot Matcha Latte','Ice Matcha','Matcha Ice Blend'].map(n=>[n,T(140,160)]));
add('Blends','🥤',['Java Chips','Hazelnut Caramel','Chocolate Butterscotch','Ferrero Blends','Triple Chocolate Chips','French Vanilla Dream','Cookies & Cream'].map(n=>[n,n=='Ferrero Blends'?T(165,185):T(155,175)]));
add('Snacks','🥪',['Nacho Bake','Ham & Cheese','Chicken and Mushroom Pesto','Tuna Melt','Sausage Burger Melt'].map(n=>[n,F(155)]));
add('Pasta','🍝',['Cajun Shrimp Pasta','Mahiwagang Pansit ni Lola','Beef Pomodoro','Oven Bake Penne','Burger Mac and Cheese','Aglio Olio Pasta'].map(n=>[n,F(155)]));
add('Meals','🍛',['Beef Humba','Filipino Pork Steak','Chicken Ala King','Saucy Breakfast Sausage','Beyond Honey Butter Beef with Egg','Creamy Peppered Beef and Mushroom','Beyond Chicken Inasal','Rosemary Chicken in Creamy Herbed Sauce','Beyond Fried Chicken Adobo','Italian Pork in Garlic Mushroom Sauce','Beyond Pork Chop BBQ','Special Buttered Daing na Bangus with Egg'].map(n=>[n,F(175)]));
add('Add-ons','🍳',[['Java Rice',F(35)],['Egg',F(25)],['Extra Cheese',F(30)],['Bacon Strips',F(45)],['Hash Browns',F(40)]]);
const cats=[...new Set(M.map(m=>m.cat))];
let S={mode:'Dine In',cat:'Coffee',cart:[],pay:'Cash',scr:'splash',sel:null,opt:0,qty:1,last:null};
const peso=n=>'₱'+n;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1400)}
function go(s){S.scr=s;$$('.scr').forEach(e=>e.classList.toggle('on',e.id==s));
 $('#nav').style.display=s=='splash'?'none':'flex';
 $$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go==s||(s=='status'&&b.dataset.go=='order')));
 $$('.mode').forEach(e=>e.textContent=S.mode);
 if(s=='menu')renderMenu();if(s=='order')renderOrder();if(s=='status')renderStatus();
 if(s=='chat'&&!$('#msgs').children.length)bot("Hi! I’m Brew, your Springboard barista. Tell me what you feel like and I’ll suggest something from the menu.")}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
$$('.seg button').forEach(b=>b.onclick=()=>{S.mode=b.dataset.m;$$('.seg button').forEach(x=>x.classList.toggle('on',x==b))});
$('#start').onclick=()=>go('menu');
function renderMenu(){
 $('#chips').innerHTML=cats.map(c=>`<button class="${c==S.cat?'on':''}" data-c="${c}">${c}</button>`).join('');
 $$('#chips button').forEach(b=>b.onclick=()=>{S.cat=b.dataset.c;$('#q').value='';renderMenu()});
 const q=$('#q').value.trim().toLowerCase();
 const items=M.filter(m=>q?m.n.toLowerCase().includes(q):m.cat==S.cat);
 $('#list').innerHTML=items.map(m=>{const i=M.indexOf(m),lo=Math.min(...m.v.map(x=>x[1]));
  const pr=m.cat=='Coffee'||m.v.length==1?`from ${peso(lo)}`:m.v.map(x=>`<div style="font-size:11px">${x[0].replace(' ','')}<br>${x[1]}</div>`).join('');
  return `<button class="it" data-i="${i}"><div class="th">${m.e}</div><div class="n">${m.n}</div><div class="p" style="${m.cat=='Coffee'||m.v.length==1?'':'display:flex;gap:14px'}">${pr}</div></button>`}).join('')||'<p class="empty">No matches</p>';
 $$('.it').forEach(b=>b.onclick=()=>openSheet(+b.dataset.i));
 const ac=$('#chips .on');if(ac)ac.scrollIntoView({inline:'center',block:'nearest'})}
$('#q').oninput=renderMenu;
function openSheet(i){S.sel=i;S.opt=0;S.qty=1;drawSheet();$('#sheet').classList.add('on')}
function drawSheet(){const m=M[S.sel];
 $('#sh').innerHTML=`<h2>${m.n}</h2><div class="opts" style="${m.v.length==1?'grid-template-columns:1fr':''}">${m.v.map((v,i)=>`<button class="${i==S.opt?'on':''}" data-o="${i}">${v[0]} · ${peso(v[1])}</button>`).join('')}</div>
 <div class="row"><div class="qty"><button data-q="1">+</button><span>${S.qty}</span><button data-q="-1">−</button></div><div class="t">${peso(m.v[S.opt][1]*S.qty)}</div></div>
 <button class="gold" id="po">Place Order</button><button class="cancel" id="cx">Cancel</button>`;
 $$('#sh [data-o]').forEach(b=>b.onclick=()=>{S.opt=+b.dataset.o;drawSheet()});
 $$('#sh [data-q]').forEach(b=>b.onclick=()=>{S.qty=Math.max(1,S.qty+ +b.dataset.q);drawSheet()});
 $('#cx').onclick=()=>$('#sheet').classList.remove('on');
 $('#po').onclick=()=>{addCart(S.sel,S.opt,S.qty);$('#sheet').classList.remove('on');go('order')}}
$('#sheet').onclick=e=>{if(e.target.id=='sheet')$('#sheet').classList.remove('on')};
function addCart(i,o,q){const ex=S.cart.find(c=>c.i==i&&c.o==o);ex?ex.q+=q:S.cart.push({i,o,q})}
const total=()=>S.cart.reduce((s,c)=>s+M[c.i].v[c.o][1]*c.q,0);
function renderOrder(){
 if(!S.cart.length){$('#ob').innerHTML='<p class="empty">Your order is empty.<br>Pick something from the menu.</p>';return}
 const pays=[['Cash','Pay at the counter','💵'],['GCash','Pay now','📱'],['Maya','Pay now','💳']];
 $('#ob').innerHTML=`<p class="sub">${S.mode=='Dine In'?'Dine-in · Table 5':'Take-out · Pick up at the counter'}</p>
 ${S.cart.map((c,k)=>{const m=M[c.i],v=m.v[c.o];return `<div class="line"><div><b>${m.n}</b><small>${v[0]} · ${peso(v[1])}</small></div><div class="qty"><button data-k="${k}" data-d="1">+</button><span>${c.q}</span><button data-k="${k}" data-d="-1">−</button></div></div>`}).join('')}
 <div class="tot"><span>Total</span><span>${peso(total())}</span></div>
 <div class="sec" style="font-size:20px;margin-bottom:10px">Payment</div>
 ${pays.map(p=>`<button class="pay ${S.pay==p[0]?'on':''}" data-p="${p[0]}"><i>${p[2]}</i><b>${p[0]}</b><small>${p[1]}</small></button>`).join('')}
 <button class="gold" id="place" style="margin-top:6px">Place Order</button>`;
 $$('#ob [data-d]').forEach(b=>b.onclick=()=>{const c=S.cart[+b.dataset.k];c.q+=+b.dataset.d;if(c.q<1)S.cart.splice(+b.dataset.k,1);renderOrder()});
 $$('#ob [data-p]').forEach(b=>b.onclick=()=>{S.pay=b.dataset.p;renderOrder()});
 $('#place').onclick=place}
let timers=[];
function place(){timers.forEach(clearTimeout);
 S.last={no:'SB-'+(100+Math.floor(Math.random()*900)),items:S.cart.map(c=>({n:M[c.i].n,q:c.q,p:M[c.i].v[c.o][1]*c.q})),total:total(),pay:S.pay,mode:S.mode,step:0};
 S.cart=[];go('status');timers=[1,2,3].map((s,i)=>setTimeout(()=>{S.last.step=s;if(S.scr=='status')renderStatus()},(i+1)*4000))}
function renderStatus(){const o=S.last;
 if(!o){$('#sb').innerHTML='<p class="empty">No active order yet.</p>';return}
 const st=['Order received','Preparing your order',o.mode=='Dine In'?'Ready to serve':'Ready for pickup'];
 $('#sb').innerHTML=`<p class="sub" style="text-align:center;margin:0">Order Number</p><div class="num">${o.no}</div>
 <p style="text-align:center;margin:6px 0 26px;font-weight:300">${o.step>=3?(o.mode=='Dine In'?'Your order is ready!':'Your order is ready for pickup!'):(o.mode=='Dine In'?'We will bring it to your table.':'We will call your number.')}</p>
 ${st.map((t,i)=>`<div class="step ${i<o.step?'done':i==o.step?'on':''}"><i>${i<o.step?'✓':''}</i>${t}</div>`).join('')}
 <div class="sum">${o.items.map(i=>`<div><span>${i.q}x ${i.n}</span><span>${peso(i.p)}</span></div>`).join('')}<div class="t"><span>Total</span><span>${peso(o.total)}</span></div><small>${o.pay=='Cash'?'Pay cash at the counter':'Paid via '+o.pay}</small></div>
 <button class="gold" id="nw">Start a new order</button>`;
 $('#nw').onclick=()=>go('menu')}
/* chat */
function bot(t,picks){const d=document.createElement('div');d.className='b';d.innerHTML=t+(picks?picks.map(n=>{const i=M.findIndex(m=>m.n==n);return `<div class="pick"><div class="th">${M[i].e}</div><span>${n}</span><button data-a="${i}">Add</button></div>`}).join(''):'');
 $('#msgs').append(d);$$('#msgs [data-a]').forEach(b=>b.onclick=()=>{addCart(+b.dataset.a,0,1);toast('Added to your order')});$('#msgs').scrollTop=1e5}
function reply(t){t=t.toLowerCase();
 const R=[[/sweet|dessert|chocolate/,['Spanish Coffee','Nutty Hazelnut Latte','European Chocolate']],[/strong|bold|espresso|kick/,['Cafe Americano','Cappuccino','Caramel Macchiato']],[/caffeine|decaf|tea|non/,['European Chocolate','Chamomile Red Berry Iced Tea','Lemon Cucumber Blend']],[/matcha|green/,['Hot Matcha Latte','Ice Matcha','Matcha Ice Blend']],[/cold|iced|blend|frozen/,['Java Chips','Ferrero Blends','Cookies & Cream']],[/hungry|food|fill|meal|eat|rice/,['Beef Humba','Filipino Pork Steak','Beyond Chicken Inasal']],[/pasta|noodle/,['Cajun Shrimp Pasta','Aglio Olio Pasta','Beef Pomodoro']],[/snack|sandwich|light/,['Tuna Melt','Nacho Bake','Ham & Cheese']]];
 const r=R.find(x=>x[0].test(t));setTimeout(()=>r?bot('Here are my top picks:',r[1]):bot('Try “something sweet”, “strong coffee”, “no caffeine”, “matcha”, or “something filling”.'),450)}
function say(t){if(!t.trim())return;const d=document.createElement('div');d.className='b me';d.textContent=t;$('#msgs').append(d);$('#ci').value='';reply(t)}
$('#send').onclick=()=>say($('#ci').value);$('#ci').onkeydown=e=>{if(e.key=='Enter')say($('#ci').value)};
$$('.quick button').forEach(b=>b.onclick=()=>say(b.textContent));
go('splash');
