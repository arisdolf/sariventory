
const PASSWORD = 'Demo12345!'
const STORE = "Kuya Jun's 24/7 Convenience Store"
const perms = {
 owner: ['sell','products','stock','suppliers','costs','team','history','void','analytics'],
 manager: ['sell','products','stock','suppliers','costs','history','void','analytics'],
 cashier: ['sell','history'], inventory: ['products','stock','suppliers'], viewer: []
}
const defs = [
 ['Junnel','Dela','Cruz','owner','owner','1978-04-12'],
 ['Maria Cristina','Lopez','Reyes','manager','manager','1985-09-23'],
 ['Angelica',null,'Ramos','cashier','angelica','1999-02-14'],
 ['Mark Anthony','Cruz','Villanueva','cashier','mark','2000-11-05'],
 ['Joy',null,'Lim','cashier','joy','2001-07-19'],
 ['Paolo','Santos','Fernandez','cashier','paolo','2002-01-30'],
 ['Ricardo',null,'Bautista','inventory','rico','1990-06-08'],
 ['Teresa','Mae','Gomez','viewer','teresa','1988-12-02'],
]
export const DEMO_ACCOUNTS = defs.map(([first,middle,last,role,key,birthdate],i)=>({
 id:i+1, first_name:first, middle_name:middle, last_name:last,
 name:[first,middle,last].filter(Boolean).join(' '), role, birthdate,
 email:`demo.${key}@sariventory.test`, password:PASSWORD,
 roleLabel:({owner:'Owner',manager:'Manager',cashier:'Cashier',inventory:'Inventory',viewer:'Viewer'})[role],
 store:STORE, storeType:'mini_grocery', perms:perms[role]
}))
export const DEMO_PASSWORD = PASSWORD
export const INITIAL_DATA = {
 categories:['Beverages','Snacks','Noodles & Instant Food','Canned Goods','Bread & Dairy','Household','Personal Care','Candy & Sweets','Frozen & Ice'].map((name,i)=>({id:i+1,name})),
 suppliers:[
 ['Metro Beverage Distributors','Ramon Aquino','0917 555 0101','orders@metrobev.example.com','Buhangin, Davao City'],
 ['Golden Harvest Foods','Liza Tan','0918 555 0102','sales@goldenharvest.example.com','Toril, Davao City'],
 ['Sunrise Bakery Supply','Ben Ocampo','0919 555 0103','','Matina, Davao City'],
 ['CleanHome Wholesale','Grace Uy','0920 555 0104','hello@cleanhome.example.com','Agdao, Davao City'],
 ['FreshPoint Dairy & Frozen','Nina Salazar','0921 555 0105','nina@freshpoint.example.com','Lanang, Davao City'],
 ['Davao Snack Traders','Mike Chua','0922 555 0106','','Bangkal, Davao City']
 ].map((s,i)=>({id:i+1,name:s[0],contact:s[1],phone:s[2],email:s[3],address:s[4]})),
 products:[
 ['Coke Mismo 295ml','Beverages',12,18,190],['Royal Tru-Orange 295ml','Beverages',12,18,160],['Sprite 1.5L','Beverages',56,72,115],['Bottled Water 500ml','Beverages',8,15,190],['Bottled Water 1L','Beverages',12,22,145],['C2 Green Tea 355ml','Beverages',19,28,160],['Gatorade 500ml','Beverages',34,48,100],['Zesto Orange 200ml','Beverages',9,14,130],['Nescafe 3-in-1 Sachet','Beverages',6,9,175],['Milo 3-in-1 Sachet','Beverages',9,13,145],
 ['Piattos 40g','Snacks',17,26,160],['Nova Cheddar 40g','Snacks',17,26,145],['Chippy BBQ 27g','Snacks',8,12,160],['Oishi Prawn Crackers 24g','Snacks',7,11,130],['Skyflakes Single Pack','Snacks',5,8,145],['Fita Crackers Pack','Snacks',6,9,115],['Ding Dong Mix Nuts','Snacks',10,15,115],['Rebisco Cream Sandwich','Snacks',6,9,115],
 ['Lucky Me Pancit Canton 60g','Noodles & Instant Food',11,16,190],['Lucky Me Instant Mami 55g','Noodles & Instant Food',8,12,130],['Nissin Cup Noodles','Noodles & Instant Food',28,40,130],['Lucky Me Beef Cup','Noodles & Instant Food',22,32,115],['Quaker Oats Sachet','Noodles & Instant Food',9,14,85],
 ['Century Tuna Flakes 155g','Canned Goods',29,40,145],['555 Sardines 155g','Canned Goods',19,27,145],['Ligo Sardines 155g','Canned Goods',20,28,130],['Argentina Corned Beef 150g','Canned Goods',34,48,115],['Alaska Evap Milk 410ml','Canned Goods',38,52,100],['Del Monte Tomato Sauce 200g','Canned Goods',18,26,85],
 ['Gardenia Classic White Loaf','Bread & Dairy',66,84,130],['Pandesal Pack (10pcs)','Bread & Dairy',24,38,160],['Eggs (per piece)','Bread & Dairy',8,11,175],['Nestle Fresh Milk 1L','Bread & Dairy',98,125,85],['Bear Brand Sachet','Bread & Dairy',12,17,130],['Eden Cheese 165g','Bread & Dairy',52,70,85],
 ['Joy Dishwashing Liquid 250ml','Household',42,58,100],['Surf Powder Sachet','Household',8,12,145],['Downy Sachet','Household',8,12,130],['Zonrox Bleach 250ml','Household',19,28,85],['Tissue Roll (single)','Household',12,20,115],['Eveready AA Battery (2pcs)','Household',42,62,85],
 ['Safeguard Soap 85g','Personal Care',29,40,115],['Colgate Toothpaste 25g','Personal Care',16,24,100],['Head & Shoulders Sachet','Personal Care',7,11,130],['Rexona Sachet','Personal Care',6,10,100],['Modess Napkin Pack','Personal Care',40,56,100],['Alcohol 70% 60ml','Personal Care',26,40,85],
 ['Cloud 9 Chocolate Bar','Candy & Sweets',8,13,145],['Maxx Menthol Candy','Candy & Sweets',1,2,190],['Haw Flakes Roll','Candy & Sweets',6,10,100],['Choco Mucho Bar','Candy & Sweets',9,14,115],
 ['Cornetto Cone','Frozen & Ice',22,32,130],['Magnum Classic','Frozen & Ice',42,58,85],['Ice Bag (small)','Frozen & Ice',8,15,130],['Tender Juicy Hotdog 250g','Frozen & Ice',58,78,100]
 ].map((p,i)=>({id:i+1,name:p[0],cat:p[1],cost_price:p[2],price:p[3],qty:p[4],low_stock:Math.max(5,Math.round(p[4]*.25)),description:''})),
 orders:[], moves:[], archived:[], nextProductId:55, nextSupplierId:6, nextOrderId:1, nextMoveId:1,
 today:{sales:0,cost:0,items:0,orders:0}
}
