
import { DEMO_ACCOUNTS, INITIAL_DATA } from './staticDemo'
const KEY='sariventory_static_db'
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(INITIAL_DATA)}catch{return structuredClone(INITIAL_DATA)}}
const save=d=>localStorage.setItem(KEY,JSON.stringify(d))
const user=()=>{try{return JSON.parse(localStorage.getItem('user'))}catch{return null}}
const fail=(message)=>{const e=new Error(message);e.data={message};throw e}
const roleDefs=[
 {key:'manager',label:'Manager',perms:['sell','products','stock','suppliers','costs','history','void','analytics']},
 {key:'cashier',label:'Cashier',perms:['sell','history']},
 {key:'inventory',label:'Inventory',perms:['products','stock','suppliers']},
 {key:'viewer',label:'Viewer',perms:[]}
]
const dateLabel=()=>new Date().toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})
export async function api(path,method='GET',body){
 const me=user(), d=read(), id=Number((path.match(/\/(\d+)/)||[])[1])
 if(path==='/login'&&method==='POST'){
  const a=DEMO_ACCOUNTS.find(x=>x.email.toLowerCase()===body.email?.toLowerCase()&&x.password===body.password)
  if(!a)fail('Invalid email or password')
  const client={...a};delete client.password
  const token='static-'+a.id+'-'+Date.now()
  localStorage.setItem('token',token);localStorage.setItem('user',JSON.stringify(client))
  return {token,user:client}
 }
 if(path==='/logout'){localStorage.removeItem('token');localStorage.removeItem('user');return {ok:true}}
 if(!me||!localStorage.getItem('token'))fail('Please log in again')
 const allowed=p=>{if(!me.perms?.includes(p))fail('You do not have permission to do that')}
 if(path==='/data'){
  const today=new Date().toDateString()
  const todays=d.orders.filter(o=>new Date(o.date).toDateString()===today)
  const sales=todays.reduce((s,o)=>s+o.total,0)
  const items=todays.reduce((s,o)=>s+o.items.reduce((a,i)=>a+i.qty,0),0)
  const cost=todays.reduce((s,o)=>s+o.items.reduce((a,i)=>a+(i.cost||0)*i.qty,0),0)
  return {...d,me,products:d.products.filter(p=>!p.archived).map(p=>{const x={...p};if(!me.perms.includes('costs'))delete x.cost_price;return x}),today:{sales,cost:me.perms.includes('costs')?cost:null,items,orders:todays.length}}
 }
 if(path==='/team'){
  allowed('team');return {store:{name:me.store,join_code:'DEMO2026'},members:DEMO_ACCOUNTS.map(a=>({id:a.id,name:a.name,email:a.email,role:a.role})),roles:roleDefs}
 }
 if(path==='/team/code'&&method==='POST'){allowed('team');return {join_code:'DEMO2026'}}
 if(path.startsWith('/team/')&&method==='PUT'){allowed('team');fail('Demo account roles are fixed in this static demo')}
 if(path.startsWith('/team/')&&method==='DELETE'){allowed('team');fail('Demo team accounts cannot be removed in this static demo')}
 if(path==='/sales'&&method==='GET'){allowed('history');return d.orders.slice().reverse().slice(0,100)}
 if(path.startsWith('/sales/')&&path.endsWith('/void')){
  allowed('void');const o=d.orders.find(x=>x.id===id);if(!o||o.status==='cancelled')fail('Sale cannot be voided')
  o.status='cancelled';o.items.forEach(i=>{const p=d.products.find(p=>p.id===i.id);if(p)p.qty+=i.qty;d.moves.unshift({id:d.nextMoveId++,pid:i.id,type:'IN',qty:i.qty,remarks:'Voided sale #'+o.id,at:dateLabel(),who:me.name})});save(d);return {ok:true}
 }
 if(path==='/profile'&&method==='GET'){return {first_name:me.first_name,middle_name:me.middle_name||'',last_name:me.last_name,email:me.email,birthdate:me.birthdate,phone:'',address:'',city:'',zip_code:''}}
 if(path==='/profile'&&method==='PUT'){const updated={...me,...body,name:[body.first_name,body.middle_name,body.last_name].filter(Boolean).join(' ')};localStorage.setItem('user',JSON.stringify(updated));return {ok:true}}
 if(path==='/profile/password'&&method==='PUT'){if(body.current_password!=='Demo12345!')fail('Your current password is wrong');fail('Password changes are disabled for fixed demo accounts')}
 if(path==='/store'&&method==='PUT'){allowed('team');me.store=body.name;localStorage.setItem('user',JSON.stringify(me));return {ok:true}}
 if(path==='/account'&&method==='DELETE')fail('Account deletion is disabled in the static demo')
 if(path.startsWith('/analytics')){allowed('analytics');return {meta:{age_days:1900,age_months:60,age_years:5},totals:{sales:d.orders.reduce((s,o)=>s+(o.status==='completed'?o.total:0),0),orders:d.orders.length,profit:0},series:[]}}
 if(path==='/products'&&method==='POST'){allowed('products');d.products.push({id:++d.nextProductId,...body,qty:+body.qty,price:+body.price,cost_price:+body.cost_price||0,low_stock:+body.low_stock||10});if(body.qty>0)d.moves.unshift({id:d.nextMoveId++,pid:d.nextProductId,type:'IN',qty:+body.qty,remarks:'Opening stock',at:dateLabel(),who:me.name});save(d);return {ok:true}}
 if(path.startsWith('/products/')&&method==='PUT'){allowed('products');const p=d.products.find(x=>x.id===id);if(!p)fail('Product not found');Object.assign(p,body,{qty:+body.qty,price:+body.price,cost_price:+body.cost_price||p.cost_price});save(d);return {ok:true}}
 if(path.startsWith('/products/')&&method==='DELETE'){allowed('products');const p=d.products.find(x=>x.id===id);if(p)p.archived=true;save(d);return {ok:true}}
 if(path.startsWith('/products/')&&path.endsWith('/restore')){allowed('products');const p=d.products.find(x=>x.id===id);if(p)p.archived=false;save(d);return {ok:true}}
 if(path==='/categories'&&method==='POST'){allowed('products');if(d.categories.some(c=>c.name.toLowerCase()===body.name.toLowerCase()))fail('That category already exists');d.categories.push({id:Math.max(0,...d.categories.map(x=>x.id))+1,name:body.name});save(d);return {ok:true}}
 if(path.startsWith('/categories/')&&method==='PUT'){allowed('products');const c=d.categories.find(x=>x.id===id);if(c)c.name=body.name;save(d);return {ok:true}}
 if(path.startsWith('/categories/')&&method==='DELETE'){allowed('products');if(d.products.some(p=>p.cat===d.categories.find(x=>x.id===id)?.name&&!p.archived))fail('Products still use this category. Move them first.');d.categories=d.categories.filter(c=>c.id!==id);save(d);return {ok:true}}
 if(path==='/stock'&&method==='POST'){allowed('stock');const p=d.products.find(x=>x.id===+body.product_id);if(!p)fail('Product not found');p.qty+=+body.qty;d.moves.unshift({id:d.nextMoveId++,pid:p.id,type:'IN',qty:+body.qty,remarks:body.remarks||'Restock',at:dateLabel(),who:me.name});save(d);return {ok:true}}
 if(path==='/stock/remove'&&method==='POST'){allowed('stock');const p=d.products.find(x=>x.id===+body.product_id);if(!p||p.qty<body.qty)fail('Not enough stock');p.qty-=+body.qty;d.moves.unshift({id:d.nextMoveId++,pid:p.id,type:'OUT',qty:+body.qty,remarks:body.reason+(body.remarks?': '+body.remarks:''),at:dateLabel(),who:me.name});save(d);return {ok:true}}
 if(path==='/sales'&&method==='POST'){
  allowed('sell');let total=0,items=[]
  for(const i of body.items){const p=d.products.find(x=>x.id===+i.id);if(!p||p.qty<+i.qty)fail('Not enough stock for '+(p?.name||'a product'));total+=p.price*+i.qty;items.push({id:p.id,name:p.name,qty:+i.qty,price:p.price,cost:p.cost_price})}
  if(body.method==='cash'&&+body.amount_paid<total)fail('Cash received is less than the total')
  items.forEach(i=>{const p=d.products.find(x=>x.id===i.id);p.qty-=i.qty;d.moves.unshift({id:d.nextMoveId++,pid:p.id,type:'OUT',qty:i.qty,remarks:'Sale #'+d.nextOrderId,at:dateLabel(),who:me.name})})
  const order={id:d.nextOrderId++,status:'completed',total,method:body.method,paid:body.method==='cash'?+body.amount_paid:total,at:dateLabel(),date:new Date().toISOString(),cashier:me.name,items};d.orders.push(order);save(d);return {ok:true,order_id:order.id}
 }
 if(path==='/suppliers'&&method==='POST'){allowed('suppliers');d.suppliers.push({id:++d.nextSupplierId,...body});save(d);return {ok:true}}
 if(path.startsWith('/suppliers/')&&method==='PUT'){allowed('suppliers');const s=d.suppliers.find(x=>x.id===id);if(s)Object.assign(s,body);save(d);return {ok:true}}
 if(path.startsWith('/suppliers/')&&method==='DELETE'){allowed('suppliers');d.suppliers=d.suppliers.filter(x=>x.id!==id);save(d);return {ok:true}}
 fail('This action is not available in the static demo')
}
