/*
 * Static Sariventory data layer.
 * All app data is saved in this browser's localStorage; no API or database is used.
 * This is suitable for a demo/prototype, not for sensitive production data.
 */
const DB_KEY = 'sariventory_static_db_v1'
const COFFEE_DB_KEY = 'sariventory_static_coffee_db_v2'
const OLD_COFFEE_DB_KEY = 'sariventory_static_coffee_db_v1'

export const DEMO_ACCOUNTS = [
  { name: 'Maria Santos', role: 'Owner', email: 'owner@saristore.local', password: 'owner1234' },
  { name: 'Juan Dela Cruz', role: 'Manager', email: 'manager@saristore.local', password: 'manager1234' },
  { name: 'Ana Reyes', role: 'Cashier', email: 'cashier@saristore.local', password: 'cashier1234' },
  { name: 'Mark Garcia', role: 'Inventory staff', email: 'inventory@saristore.local', password: 'inventory1234' },
  { name: 'Liza Mendoza', role: 'Viewer', email: 'viewer@saristore.local', password: 'viewer1234' },
]

const ROLES = {
  owner: {
    label: 'Owner',
    perms: ['sell', 'products', 'stock', 'suppliers', 'costs', 'team', 'history', 'void', 'analytics']
  },
  manager: {
    label: 'Manager',
    perms: ['sell', 'products', 'stock', 'suppliers', 'costs', 'history', 'void', 'analytics']
  },
  cashier: { label: 'Cashier', perms: ['sell', 'history'] },
  inventory: { label: 'Inventory', perms: ['products', 'stock', 'suppliers'] },
  viewer: { label: 'Viewer', perms: [] },
}

const nowIso = () => new Date().toISOString()
const copy = value => JSON.parse(JSON.stringify(value))
const fullName = u => [u.first_name, u.middle_name, u.last_name].filter(Boolean).join(' ').trim()

const clientUser = (db, user) => {
  const role = ROLES[user.role] || ROLES.viewer

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    age: user.birthdate
      ? Math.floor((Date.now() - new Date(user.birthdate).getTime()) / 31557600000)
      : null,
    roleLabel: role.label,
    store: db.store.name,
    storeType: db.store.store_type,
    perms: [...role.perms],
    storeId: db.store.id,
    storeFoundedOn: db.store.established_on || null,
  }
}

const fail = (message, status = 422, data = {}) => {
  const error = new Error(message)
  error.status = status
  error.data = data
  throw error
}

const makeSeed = () => {
  const users = [
    {
      id: 1, first_name: 'Maria', middle_name: '',
      last_name: 'Santos', name: 'Maria Santos',
      email: 'owner@saristore.local', password: 'owner1234',
      birthdate: '1990-03-14', role: 'owner',
      profile: { phone: '09171234567', address: 'Main Street', city: 'Zamboanga City', zip_code: '7000' }
    },
    {
      id: 2, first_name: 'Juan', middle_name: 'Reyes',
      last_name: 'Dela Cruz', name: 'Juan Reyes Dela Cruz',
      email: 'manager@saristore.local', password: 'manager1234',
      birthdate: '1993-07-22', role: 'manager',
      profile: { phone: '09181234567', address: '', city: 'Zamboanga City', zip_code: '7000' }
    },
    {
      id: 3, first_name: 'Ana', middle_name: '',
      last_name: 'Reyes', name: 'Ana Reyes',
      email: 'cashier@saristore.local', password: 'cashier1234',
      birthdate: '1998-11-05', role: 'cashier',
      profile: { phone: '', address: '', city: '', zip_code: '' }
    },
    {
      id: 4, first_name: 'Mark', middle_name: '',
      last_name: 'Garcia', name: 'Mark Garcia',
      email: 'inventory@saristore.local', password: 'inventory1234',
      birthdate: '1996-02-18', role: 'inventory',
      profile: { phone: '', address: '', city: '', zip_code: '' }
    },
    {
      id: 5, first_name: 'Liza', middle_name: '',
      last_name: 'Mendoza', name: 'Liza Mendoza',
      email: 'viewer@saristore.local', password: 'viewer1234',
      birthdate: '1999-09-09', role: 'viewer',
      profile: { phone: '', address: '', city: '', zip_code: '' }
    },
  ]

  const products = [
    { id: 1, name: 'Coca-Cola 1.5L', description: 'Bottled soft drink', cat: 'Beverages', cost_price: 48, price: 75, qty: 24, low_stock: 8, is_active: true },
    { id: 2, name: 'Lucky Me Pancit Canton', description: 'Instant noodles', cat: 'Snacks', cost_price: 12, price: 16, qty: 60, low_stock: 15, is_active: true },
    { id: 3, name: '555 Sardines', description: '155g canned sardines', cat: 'Canned Goods', cost_price: 22, price: 30, qty: 30, low_stock: 8, is_active: true },
    { id: 4, name: 'Safeguard Soap', description: '90g bar soap', cat: 'Household', cost_price: 30, price: 38, qty: 8, low_stock: 10, is_active: true },
    { id: 5, name: 'Kopiko Brown 10s', description: 'Instant coffee sachets', cat: 'Beverages', cost_price: 52, price: 65, qty: 18, low_stock: 6, is_active: true },
    { id: 6, name: 'Rice 1kg', description: 'Well-milled rice', cat: 'Canned Goods', cost_price: 43, price: 50, qty: 35, low_stock: 10, is_active: true },
  ]

  return {
    next: { user: 6, product: 7, category: 5, supplier: 3, sale: 1, move: 7 },
    store: { id: 1, name: 'Sari Store', store_type: 'sari_sari', join_code: 'SARI2026' },
    users,

    categories: [
      { id: 1, name: 'Beverages' },
      { id: 2, name: 'Snacks' },
      { id: 3, name: 'Canned Goods' },
      { id: 4, name: 'Household' },
    ],

    products,
    archived: [],

    suppliers: [
      { id: 1, name: 'Zamboanga General Merchandise', contact: 'R. Lim', phone: '09190001111', email: 'sales@example.com', address: 'Zamboanga City' },
      { id: 2, name: 'Southway Trading', contact: 'M. Cruz', phone: '09190002222', email: 'orders@example.com', address: 'Zamboanga City' },
    ],

    orders: [],

    moves: products.filter(p => p.qty > 0).map((p, i) => ({
      id: i + 1,
      pid: p.id,
      type: 'IN',
      qty: p.qty,
      remarks: 'Opening stock',
      at: new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }),
      who: 'Mark Garcia'
    })),
  }
}

const makeCoffeeSeed = () => {
  const users = [
    {
      id: 1,
      first_name: 'Mia',
      middle_name: 'Isabel',
      last_name: 'Villanueva',
      name: 'Mia Isabel Villanueva',
      email: 'owner@brewandbloom.local',
      password: 'BrewOwner2021!',
      birthdate: '1988-04-16',
      role: 'owner',
      joined_at: '2021-11-05'
    },
    {
      id: 2,
      first_name: 'Lorenzo',
      middle_name: '',
      last_name: 'Cruz',
      name: 'Lorenzo Cruz',
      email: 'manager@brewandbloom.local',
      password: 'BrewManager2021!',
      birthdate: '1991-08-23',
      role: 'manager',
      joined_at: '2021-11-05'
    },
    {
      id: 3,
      first_name: 'Sofia',
      middle_name: '',
      last_name: 'Reyes',
      name: 'Sofia Reyes',
      email: 'leadbarista@brewandbloom.local',
      password: 'LeadBarista2021!',
      birthdate: '1995-02-11',
      role: 'cashier',
      joined_at: '2021-11-12'
    },
    {
      id: 4,
      first_name: 'Gabriel',
      middle_name: '',
      last_name: 'Santos',
      name: 'Gabriel Santos',
      email: 'barista@brewandbloom.local',
      password: 'CoffeeBarista2021!',
      birthdate: '1997-06-19',
      role: 'cashier',
      joined_at: '2022-01-10'
    },
    {
      id: 5,
      first_name: 'Chloe',
      middle_name: '',
      last_name: 'Mendoza',
      name: 'Chloe Mendoza',
      email: 'cashier@brewandbloom.local',
      password: 'CafeCashier2021!',
      birthdate: '1999-12-03',
      role: 'cashier',
      joined_at: '2022-05-16'
    },
    {
      id: 6,
      first_name: 'Noah',
      middle_name: '',
      last_name: 'Garcia',
      name: 'Noah Garcia',
      email: 'inventory@brewandbloom.local',
      password: 'CafeStock2021!',
      birthdate: '1994-09-27',
      role: 'inventory',
      joined_at: '2022-02-01'
    },
  ].map(u => ({
    ...u,
    profile: {
      phone: '',
      address: '',
      city: 'Zamboanga City',
      zip_code: '7000'
    }
  }))

  // name, category, capital, selling price, stock
  const menu = [
    ['Espresso Single', 'Espresso & Coffee', 28, 65, 90],
    ['Espresso Double', 'Espresso & Coffee', 38, 85, 80],
    ['Americano Hot 12oz', 'Espresso & Coffee', 35, 95, 70],
    ['Americano Iced 16oz', 'Espresso & Coffee', 42, 110, 75],
    ['Cappuccino Hot 12oz', 'Espresso & Coffee', 48, 125, 65],
    ['Cappuccino Iced 16oz', 'Espresso & Coffee', 54, 140, 60],
    ['Cafe Latte Hot 12oz', 'Espresso & Coffee', 50, 130, 75],
    ['Cafe Latte Iced 16oz', 'Espresso & Coffee', 55, 145, 85],

    ['Spanish Latte Hot', 'Signature Coffee', 58, 150, 55],
    ['Spanish Latte Iced', 'Signature Coffee', 62, 165, 90],
    ['Vanilla Latte Hot', 'Signature Coffee', 58, 150, 45],
    ['Vanilla Latte Iced', 'Signature Coffee', 62, 165, 60],
    ['Caramel Macchiato', 'Signature Coffee', 64, 165, 45],
    ['Cafe Mocha', 'Signature Coffee', 62, 160, 45],
    ['White Chocolate Mocha', 'Signature Coffee', 76, 195, 38],
    ['Hazelnut Latte', 'Signature Coffee', 68, 180, 45],
    ['Brown Sugar Oat Latte', 'Signature Coffee', 76, 195, 40],

    ['Cold Brew 16oz', 'Brewed Coffee', 48, 145, 65],
    ['Vietnamese Iced Coffee', 'Brewed Coffee', 55, 155, 55],

    ['Matcha Latte Hot', 'Non-Coffee', 65, 165, 45],
    ['Iced Matcha Latte', 'Non-Coffee', 70, 180, 55],
    ['Strawberry Matcha', 'Non-Coffee', 78, 195, 40],
    ['Hot Chocolate', 'Non-Coffee', 48, 125, 40],
    ['Iced Chocolate', 'Non-Coffee', 54, 140, 50],
    ['Strawberry Milk', 'Non-Coffee', 52, 145, 40],

    ['Chai Latte', 'Tea & Refreshers', 52, 140, 35],
    ['Lemon Iced Tea', 'Tea & Refreshers', 28, 85, 75],

    ['Butter Croissant', 'Pastries', 42, 95, 24],
    ['Almond Croissant', 'Pastries', 58, 135, 18],
    ['Chocolate Croissant', 'Pastries', 48, 115, 22],
    ['Cinnamon Roll', 'Pastries', 52, 120, 20],
    ['Blueberry Muffin', 'Pastries', 38, 90, 20],
    ['Banana Bread', 'Pastries', 34, 85, 24],
    ['Chocolate Chip Cookie', 'Pastries', 28, 70, 30],

    ['Fudge Brownie', 'Desserts', 38, 95, 24],
    ['Blueberry Cheesecake', 'Desserts', 72, 165, 14],
    ['Basque Burnt Cheesecake', 'Desserts', 76, 175, 14],
    ['Carrot Cake', 'Desserts', 62, 150, 16],
    ['Affogato', 'Desserts', 58, 150, 25],

    ['Classic Waffle', 'Breakfast & Brunch', 58, 145, 18],
    ['Belgian Pancakes', 'Breakfast & Brunch', 72, 175, 15],
    ['Bacon & Egg Sandwich', 'Breakfast & Brunch', 78, 185, 15],
    ['Garlic Cream Cheese Toast', 'Breakfast & Brunch', 48, 125, 18],
    ['Sausage Egg Croissant', 'Breakfast & Brunch', 82, 190, 12],

    ['Ham & Cheese Sandwich', 'Sandwiches', 62, 155, 18],
    ['Tuna Melt Sandwich', 'Sandwiches', 68, 165, 16],
    ['Chicken Pesto Panini', 'Sandwiches', 82, 195, 16],

    ['Mac & Cheese', 'Light Meals', 65, 155, 16],
    ['Creamy Mushroom Pasta', 'Light Meals', 92, 210, 12],
  ]

  const categories = [...new Set(menu.map(p => p[1]))]
    .map((name, i) => ({ id: i + 1, name }))

  const products = menu.map((p, i) => ({
    id: i + 1,
    name: p[0],
    cat: p[1],
    cost_price: p[2],
    price: p[3],
    qty: p[4],
    low_stock: Math.max(6, Math.floor(p[4] * 0.25)),
    description: 'Freshly prepared ' + p[0].toLowerCase(),
    is_active: true,
  }))

  const suppliers = [
    { id: 1, name: 'Highland Roastery Supply', contact: 'A. Navarro', phone: '09181110001', email: 'orders@example.com', address: 'Coffee beans' },
    { id: 2, name: 'Daily Crumb Bakery', contact: 'M. Lim', phone: '09181110002', email: 'bakes@example.com', address: 'Pastries and bread' },
    { id: 3, name: 'Fresh Fields Dairy', contact: 'R. Torres', phone: '09181110003', email: 'hello@example.com', address: 'Milk and dairy' },
    { id: 4, name: 'Cafe Essentials Trading', contact: 'J. Dizon', phone: '09181110004', email: 'supply@example.com', address: 'Cups and packaging' },
  ]

  // Generate realistic-looking sample sales across five years.
  let seed = 20261105

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  const pick = list => list[Math.floor(random() * list.length)]
  const orders = []
  const start = new Date(2021, 10, 5, 8)
  const today = new Date()
  today.setHours(19, 0, 0, 0)

  const dayCount = Math.max(
    1,
    Math.floor((today - start) / 86400000) + 1
  )

  const cashiers = users.filter(u =>
    ['cashier', 'manager'].includes(u.role)
  )

  let orderId = 1

  for (let dayIndex = 0; dayIndex < dayCount; dayIndex++) {
    const day = new Date(start)
    day.setDate(start.getDate() + dayIndex)

    const weekend = day.getDay() === 0 || day.getDay() === 6
    let count = 2 + Math.floor(random() * 2) + (weekend ? 1 : 0)

    if ([10, 11].includes(day.getMonth())) count++

    const priceScale = 0.78 + 0.22 * (
      dayIndex / Math.max(1, dayCount - 1)
    )

    for (let n = 0; n < count; n++) {
      const chosen = []
      const used = new Set()
      const lineCount = 1 + Math.floor(random() * 3)

      for (let j = 0; j < lineCount; j++) {
        let p = pick(products)

        while (used.has(p.id)) p = pick(products)
        used.add(p.id)

        const qty = random() > 0.82 ? 2 : 1

        chosen.push({
          id: p.id,
          name: p.name,
          cat: p.cat,
          qty,
          price: Math.round(p.price * priceScale * 100) / 100,
          cost: Math.round(p.cost_price * priceScale * 100) / 100,
        })
      }

      const total = chosen.reduce(
        (sum, item) => sum + item.price * item.qty, 0
      )

      const soldAt = new Date(day)
      soldAt.setHours(
        7 + Math.floor(random() * 13),
        Math.floor(random() * 60)
      )

      const roll = random()
      const method = roll < 0.48 ? 'cash'
        : roll < 0.82 ? 'gcash'
        : roll < 0.95 ? 'maya' : 'other'

      const cashier = pick(cashiers)

      orders.push({
        id: orderId++,
        status: 'completed',
        total: Math.round(total * 100) / 100,
        method,
        paid: method === 'cash' ? Math.ceil(total / 50) * 50 : total,
        date: soldAt.toISOString(),
        cashier: cashier.name,
        items: chosen,
      })
    }
  }

  const moves = products.map((p, i) => ({
    id: i + 1,
    pid: p.id,
    type: 'IN',
    qty: p.qty,
    remarks: 'Opening stock',
    at: new Date(start).toLocaleDateString(),
    who: 'Noah Garcia',
  }))

  return {
    next: {
      user: 7,
      product: products.length + 1,
      category: categories.length + 1,
      supplier: suppliers.length + 1,
      sale: orderId,
      move: moves.length + 1,
    },
    store: {
      id: 2,
      name: 'Brew & Bloom Coffee House',
      store_type: 'cafe',
      join_code: 'BREWBLOOM',
      established_on: '2021-11-05',
    },
    users,
    categories,
    products,
    archived: [],
    suppliers,
    orders,
    moves,
  }
}

function selectedStoreId() {
  try {
    const saved = JSON.parse(localStorage.getItem('user') || 'null')
    const id = Number(saved?.storeId || 1)
    return id === 2 ? 2 : 1
  } catch {
    return 1
  }
}

function storageKey(storeId) {
  return Number(storeId) === 2 ? COFFEE_DB_KEY : DB_KEY
}

function isValidDatabase(db, storeId) {
  return Boolean(
    db &&
    Number(db.store?.id) === Number(storeId) &&
    Array.isArray(db.users) &&
    Array.isArray(db.products) &&
    Array.isArray(db.categories) &&
    Array.isArray(db.suppliers) &&
    Array.isArray(db.orders) &&
    Array.isArray(db.moves)
  )
}

function readDb(storeId = null) {
  const id = Number(storeId || selectedStoreId()) === 2 ? 2 : 1
  const key = storageKey(id)

  if (id === 2) {
    try {
      localStorage.removeItem(OLD_COFFEE_DB_KEY)
    } catch {
      // Ignore cleanup errors; the new store key is checked below.
    }
  }

  try {
    const raw = localStorage.getItem(key)

    if (raw) {
      const saved = JSON.parse(raw)
      if (isValidDatabase(saved, id)) return saved
    }
  } catch {
    // Rebuild the demo database if stored data cannot be read.
  }

  const db = id === 2 ? makeCoffeeSeed() : makeSeed()

  try {
    localStorage.setItem(key, JSON.stringify(db))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      fail(
        'Your browser storage is full. Clear this site’s old Sariventory demo data, then sign in again.',
        507
      )
    }
    throw error
  }

  return db
}

function writeDb(db) {
  const key = storageKey(db.store?.id || 1)

  try {
    localStorage.setItem(key, JSON.stringify(db))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      fail(
        'Your browser storage is full. Export or clear some old demo data before continuing.',
        507
      )
    }
    throw error
  }
}

function currentUser(db) {
  let saved = null

  try {
    saved = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    fail('Your saved login is damaged. Please log in again.', 401)
  }

  const token = localStorage.getItem('token')
  const storeId = Number(db.store?.id || 1)
  const savedStoreId = Number(saved?.storeId || 1)
  const expectedToken = `static-${storeId}-${saved?.id}`
  const legacyPrimaryToken = storeId === 1 && token === `static-${saved?.id}`

  if (
    !saved?.id ||
    savedStoreId !== storeId ||
    (token !== expectedToken && !legacyPrimaryToken)
  ) {
    fail('Your session expired. Please log in again.', 401)
  }

  const user = db.users.find(u => Number(u.id) === Number(saved.id))

  if (!user || user.removed) {
    fail('This account is no longer available. Please log in again.', 401)
  }

  return user
}

function requirePerm(user, perm) {
  if (!(ROLES[user.role]?.perms || []).includes(perm)) {
    fail('You do not have permission to do that', 403)
  }
}

function nextId(db, name) {
  const id = db.next[name] || 1
  db.next[name] = id + 1
  return id
}

function categoryFor(db, name) {
  const label = String(name || '').trim()
  if (!label) return ''

  let cat = db.categories.find(
    c => c.name.toLowerCase() === label.toLowerCase()
  )

  if (!cat) {
    cat = { id: nextId(db, 'category'), name: label }
    db.categories.push(cat)
  }

  return cat.name
}

function addMove(db, user, productId, type, qty, remarks) {
  db.moves.unshift({
    id: nextId(db, 'move'),
    pid: productId,
    type,
    qty,
    remarks: remarks || '',
    at: new Date().toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }),
    who: user.name,
  })
}

function formatAt(value) {
  return new Date(value).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function getData(db, user) {
  const canCost = ROLES[user.role].perms.includes('costs')
  const active = db.products.filter(p => p.is_active)
  const todayKey = new Date().toDateString()

  const completedToday = db.orders.filter(
    o => o.status === 'completed' &&
      new Date(o.date).toDateString() === todayKey
  )

  const soldToday = completedToday.flatMap(o => o.items)

  const result = {
    me: clientUser(db, user),

    products: active.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      low_stock: Number(p.low_stock ?? 10),
      cat: p.cat || '',
      ...(canCost ? { cost_price: Number(p.cost_price || 0) } : {}),
      price: Number(p.price),
      qty: Number(p.qty),
    })).sort((a, b) => a.name.localeCompare(b.name)),

    categories: copy(db.categories),
    suppliers: copy(db.suppliers),

    orders: db.orders
      .filter(o => o.status === 'completed')
      .slice()
      .reverse()
      .slice(0, 50)
      .map(o => ({
        id: o.id,
        total: o.total,
        date: o.date
      })),

    moves: copy(db.moves.slice(0, 200)),

    archived: db.products
      .filter(p => !p.is_active)
      .map(p => ({ id: p.id, name: p.name })),

    today: {
      sales: completedToday.reduce((sum, o) => sum + o.total, 0),
      cost: canCost
        ? soldToday.reduce((sum, i) => sum + i.cost * i.qty, 0)
        : null,
      items: soldToday.reduce((sum, i) => sum + i.qty, 0),
      orders: completedToday.length,
    },
  }

  return result
}

function getAnalytics(db, user, days = 30) {
  requirePerm(user, 'analytics')

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - days + 1)

  const orders = db.orders.filter(o => {
    const date = new Date(o.date)

    return o.status === 'completed' &&
      date >= start &&
      date <= end
  })

  const dailyMap = new Map()
  const products = new Map()
  const payments = new Map()
  const categories = new Map()

  let revenue = 0
  let cost = 0
  let items = 0

  const keyFor = d => [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-')

  orders.forEach(o => {
    revenue += Number(o.total || 0)

    const day = keyFor(new Date(o.date))
    dailyMap.set(day, (dailyMap.get(day) || 0) + o.total)

    const method = o.method || 'other'

    const payment = payments.get(method) || {
      method,
      revenue: 0,
      orders: 0
    }

    payment.revenue += o.total
    payment.orders++
    payments.set(method, payment)

    o.items.forEach(i => {
      const qty = Number(i.qty || 0)
      const itemRevenue = i.price * qty

      items += qty
      cost += (i.cost || 0) * qty

      const p = products.get(i.id) || {
        id: i.id,
        name: i.name,
        units: 0,
        revenue: 0
      }

      p.units += qty
      p.revenue += itemRevenue
      products.set(i.id, p)

      const catName = i.cat ||
        db.products.find(x => x.id === i.id)?.cat ||
        'Uncategorized'

      const c = categories.get(catName) || {
        name: catName,
        units: 0,
        revenue: 0
      }

      c.units += qty
      c.revenue += itemRevenue
      categories.set(catName, c)
    })
  })

  const daily = []

  for (let i = 0; i < days; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)

    const key = keyFor(date)

    daily.push({
      day: key,
      revenue: dailyMap.get(key) || 0
    })
  }

  return {
    summary: {
      revenue,
      profit: revenue - cost,
      orders: orders.length,
      items,
      averageOrder: orders.length ? revenue / orders.length : 0
    },

    daily,

    topProducts: [...products.values()]
      .sort((a, b) => b.units - a.units)
      .slice(0, 5),

    payments: [...payments.values()]
      .sort((a, b) => b.revenue - a.revenue),

    categories: [...categories.values()]
      .sort((a, b) => b.revenue - a.revenue)
  }
}

export async function api(path, method = 'GET', body) {
  method = String(method || 'GET').toUpperCase()
  body = body || {}

  const [pathname, queryString = ''] = String(path || '').split('?', 2)
  const normalized = pathname.replace(/\/$/, '') || '/'
  const query = new URLSearchParams(queryString)

  // Login checks Sari Store first.
  // The Coffee House demo is loaded only when needed.
  if (normalized === '/login' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!email || !password) {
      fail('Enter your email and password')
    }

    const sariDb = readDb(1)

    const sariUser = sariDb.users.find(u =>
      String(u.email || '').toLowerCase() === email &&
      u.password === password &&
      !u.removed
    )

    if (sariUser) {
      return {
        token: `static-${sariDb.store.id}-${sariUser.id}`,
        user: clientUser(sariDb, sariUser),
      }
    }

    const isCoffeeAccount = email.endsWith('@brewandbloom.local')

    let coffeeExists = false

    try {
      coffeeExists = Boolean(localStorage.getItem(COFFEE_DB_KEY))
    } catch {
      coffeeExists = false
    }

    if (isCoffeeAccount || coffeeExists) {
      const coffeeDb = readDb(2)

      const coffeeUser = coffeeDb.users.find(u =>
        String(u.email || '').toLowerCase() === email &&
        u.password === password &&
        !u.removed
      )

      if (coffeeUser) {
        return {
          token: `static-${coffeeDb.store.id}-${coffeeUser.id}`,
          user: clientUser(coffeeDb, coffeeUser),
        }
      }
    }

    fail('Wrong email or password', 401)
  }

  // New accounts join the original Sari Store demo.
  if (normalized === '/register' && method === 'POST') {
    const db = readDb(1)

    const first = String(body.first_name || '').trim()
    const middle = String(body.middle_name || '').trim()
    const last = String(body.last_name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const birthdate = String(body.birthdate || '').trim()

    if (!first || !last || !email || !birthdate) {
      fail('Please complete all required fields')
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      fail('Enter a valid email address')
    }

    if (password.length < 8) {
      fail('Password must be at least 8 characters')
    }

    const duplicateInSari = db.users.some(u =>
      String(u.email || '').toLowerCase() === email && !u.removed
    )

    let duplicateInCoffee = false

    try {
      if (localStorage.getItem(COFFEE_DB_KEY)) {
        duplicateInCoffee = readDb(2).users.some(u =>
          String(u.email || '').toLowerCase() === email && !u.removed
        )
      }
    } catch {
      // Registration should still be able to report errors from its own store.
    }

    if (duplicateInSari || duplicateInCoffee) {
      fail('An account with this email already exists')
    }

    const user = {
      id: nextId(db, 'user'),
      first_name: first,
      middle_name: middle,
      last_name: last,
      name: [first, middle, last].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(),
      email,
      password,
      birthdate,
      role: 'cashier',
      profile: {
        phone: '',
        address: '',
        city: '',
        zip_code: ''
      },
    }

    db.users.push(user)
    writeDb(db)

    return {
      token: `static-${db.store.id}-${user.id}`,
      user: clientUser(db, user),
    }
  }

  if (normalized === '/rejoin' && method === 'POST') {
    fail('Joining a store by code is not available in this static demo. Use an existing store account.')
  }

  // The stored user selects the correct store-specific database.
  const db = readDb()
  const user = currentUser(db)

  if (normalized === '/logout' && method === 'POST') {
    return { ok: true }
  }

  if (normalized === '/data' && method === 'GET') {
    return getData(db, user)
  }

  if (normalized === '/analytics' && method === 'GET') {
    const requestedDays = Number(query.get('days') || 30)

    const days = [7, 30, 90, 365, 1827].includes(requestedDays)
      ? requestedDays
      : 30

    return getAnalytics(db, user, days)
  }

    // Team
  if (normalized === '/team' && method === 'GET') {
    requirePerm(user, 'team')

    return {
      store: copy(db.store),

      members: db.users
        .filter(u => !u.removed && u.role !== 'removed')
        .map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role
        })),

      roles: Object.entries(ROLES)
        .filter(([key]) => key !== 'owner')
        .map(([key, value]) => ({
          key,
          label: value.label,
          perms: [...value.perms]
        })),
    }
  }

  if (normalized === '/team/code' && method === 'POST') {
    requirePerm(user, 'team')

    db.store.join_code = Math.random()
      .toString(36)
      .slice(2, 10)
      .toUpperCase()

    writeDb(db)

    return { join_code: db.store.join_code }
  }

  let match = normalized.match(/^\/team\/(\d+)$/)

  if (match && method === 'PUT') {
    requirePerm(user, 'team')

    const member = db.users.find(
      u => u.id === Number(match[1]) && !u.removed
    )

    if (!member) fail('Member not found', 404)
    if (member.role === 'owner') fail('The owner cannot be changed', 403)
    if (!ROLES[body.role] || body.role === 'owner') fail('Select a valid role')

    member.role = body.role

    writeDb(db)

    return { ok: true }
  }

  if (match && method === 'DELETE') {
    requirePerm(user, 'team')

    const member = db.users.find(
      u => u.id === Number(match[1]) && !u.removed
    )

    if (!member) fail('Member not found', 404)
    if (member.role === 'owner') fail('The owner cannot be removed', 403)

    member.removed = true
    member.role = 'viewer'

    writeDb(db)

    return { ok: true }
  }

  // Profile and store settings
  if (normalized === '/profile' && method === 'GET') {
    return {
      first_name: user.first_name || '',
      middle_name: user.middle_name || '',
      last_name: user.last_name || '',
      email: user.email,
      birthdate: user.birthdate || '',
      phone: user.profile?.phone || '',
      address: user.profile?.address || '',
      city: user.profile?.city || '',
      zip_code: user.profile?.zip_code || '',
    }
  }

  if (normalized === '/profile' && method === 'PUT') {
    user.first_name = String(body.first_name || '').trim()
    user.middle_name = String(body.middle_name || '').trim()
    user.last_name = String(body.last_name || '').trim()

    if (!user.first_name || !user.last_name) {
      fail('First and last name are required')
    }

    user.name = fullName(user)
    user.birthdate = body.birthdate || user.birthdate

    user.profile = {
      phone: body.phone || '',
      address: body.address || '',
      city: body.city || '',
      zip_code: body.zip_code || ''
    }

    writeDb(db)

    return { ok: true }
  }

  if (normalized === '/profile/password' && method === 'PUT') {
    if (user.password !== body.current_password) {
      fail('Your current password is wrong')
    }

    if (String(body.new_password || '').length < 8) {
      fail('New password must be at least 8 characters')
    }

    if (body.new_password === body.current_password) {
      fail('Choose a password different from your current one')
    }

    user.password = body.new_password

    writeDb(db)

    return { ok: true }
  }

  if (normalized === '/store' && method === 'PUT') {
    requirePerm(user, 'team')

    const name = String(body.name || '').trim()

    if (!name) fail('Store name is required')

    db.store.name = name

    writeDb(db)

    return { ok: true }
  }

  if (normalized === '/account' && method === 'DELETE') {
    if (user.password !== body.password) {
      fail('Your password is wrong')
    }

    if (body.confirm !== 'DELETE') {
      fail('Type DELETE to confirm')
    }

    if (
      user.role === 'owner' &&
      db.users.some(u => !u.removed && u.id !== user.id)
    ) {
      fail('Remove your team members first (Team page).')
    }

    if (user.role === 'owner') {
      db.products = []
      db.archived = []
      db.suppliers = []
      db.categories = []
      db.orders = []
      db.moves = []
    }

    user.removed = true

    writeDb(db)

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    window.dispatchEvent(new Event('logout'))

    return { ok: true }
  }

  // Products
  if (normalized === '/products' && method === 'POST') {
    requirePerm(user, 'products')

    const cost = ROLES[user.role].perms.includes('costs')
      ? Number(body.cost_price || 0)
      : 0

    const price = Number(body.price)
    const qty = Number(body.qty)

    if (!String(body.name || '').trim()) {
      fail('Product name is required')
    }

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(qty) ||
      qty < 0
    ) {
      fail('Enter a valid price and stock quantity')
    }

    if (price < cost) {
      fail('Selling price cannot be below the capital')
    }

    const product = {
      id: nextId(db, 'product'),
      name: String(body.name).trim(),
      description: String(body.description || ''),
      cat: categoryFor(db, body.cat),
      cost_price: cost,
      price,
      qty,
      low_stock: Number(body.low_stock ?? 10),
      is_active: true
    }

    db.products.push(product)

    if (qty > 0) {
      addMove(db, user, product.id, 'IN', qty, 'Opening stock')
    }

    writeDb(db)

    return { ok: true }
  }

  match = normalized.match(/^\/products\/(\d+)$/)

  if (match && method === 'PUT') {
    requirePerm(user, 'products')

    const p = db.products.find(x => x.id === Number(match[1]))

    if (!p) fail('Product not found', 404)

    const oldQty = p.qty
    const canCost = ROLES[user.role].perms.includes('costs')

    const cost = canCost ? Number(body.cost_price || 0) : p.cost_price
    const price = Number(body.price)
    const qty = Number(body.qty)

    if (!String(body.name || '').trim()) {
      fail('Product name is required')
    }

    if (price < cost) {
      fail('Selling price cannot be below the capital')
    }

    if (
      !Number.isFinite(price) ||
      !Number.isInteger(qty) ||
      qty < 0
    ) {
      fail('Enter a valid price and stock quantity')
    }

    Object.assign(p, {
      name: String(body.name).trim(),
      description: String(body.description || ''),
      cat: categoryFor(db, body.cat),
      price,
      qty,
      low_stock: Number(body.low_stock ?? 10)
    })

    if (canCost) p.cost_price = cost

    if (qty !== oldQty) {
      addMove(db, user, p.id, 'ADJUSTMENT', qty - oldQty, 'Edited stock')
    }

    writeDb(db)

    return { ok: true }
  }

  if (match && method === 'DELETE') {
    requirePerm(user, 'products')

    const p = db.products.find(x => x.id === Number(match[1]))

    if (!p) fail('Product not found', 404)

    p.is_active = false

    writeDb(db)

    return { ok: true }
  }

  match = normalized.match(/^\/products\/(\d+)\/restore$/)

  if (match && method === 'POST') {
    requirePerm(user, 'products')

    const p = db.products.find(
      x => x.id === Number(match[1]) && !x.is_active
    )

    if (!p) fail('Product not found', 404)

    p.is_active = true

    writeDb(db)

    return { ok: true }
  }

  // Categories
  if (normalized === '/categories' && method === 'POST') {
    requirePerm(user, 'products')

    const name = String(body.name || '').trim()

    if (!name) fail('Category name is required')

    if (
      db.categories.some(c =>
        c.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      fail('That category already exists')
    }

    db.categories.push({
      id: nextId(db, 'category'),
      name
    })

    writeDb(db)

    return { ok: true }
  }

  match = normalized.match(/^\/categories\/(\d+)$/)

  if (match && method === 'PUT') {
    requirePerm(user, 'products')

    const category = db.categories.find(
      c => c.id === Number(match[1])
    )

    const name = String(body.name || '').trim()

    if (!category) fail('Category not found', 404)
    if (!name) fail('Category name is required')

    if (
      db.categories.some(c =>
        c.id !== category.id &&
        c.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      fail('That category already exists')
    }

    db.products.forEach(p => {
      if (p.cat === category.name) p.cat = name
    })

    category.name = name

    writeDb(db)

    return { ok: true }
  }

  if (match && method === 'DELETE') {
    requirePerm(user, 'products')

    const category = db.categories.find(
      c => c.id === Number(match[1])
    )

    if (!category) fail('Category not found', 404)

    const used = db.products.filter(
      p => p.is_active && p.cat === category.name
    ).length

    if (used) {
      fail(`${used} product(s) still use this category. Move them first.`)
    }

    db.categories = db.categories.filter(
      c => c.id !== category.id
    )

    writeDb(db)

    return { ok: true }
  }

  // Stock movements
  if (normalized === '/stock' && method === 'POST') {
    requirePerm(user, 'stock')

    const p = db.products.find(
      x => x.id === Number(body.product_id) && x.is_active
    )

    const qty = Number(body.qty)

    if (!p) fail('Product not found', 404)
    if (!Number.isInteger(qty) || qty < 1) {
      fail('Quantity must be at least 1')
    }

    p.qty += qty

    addMove(
      db,
      user,
      p.id,
      'IN',
      qty,
      String(body.remarks || '').trim() || 'Restock'
    )

    writeDb(db)

    return { ok: true }
  }

  if (normalized === '/stock/remove' && method === 'POST') {
    requirePerm(user, 'stock')

    const p = db.products.find(
      x => x.id === Number(body.product_id) && x.is_active
    )

    const qty = Number(body.qty)

    if (!p) fail('Product not found', 404)

    if (!Number.isInteger(qty) || qty < 1) {
      fail('Quantity must be at least 1')
    }

    if (p.qty < qty) {
      fail(`Only ${p.qty} in stock`)
    }

    p.qty -= qty

    const reason = [
      'damaged',
      'expired',
      'lost',
      'other'
    ].includes(body.reason) ? body.reason : 'other'

    addMove(
      db,
      user,
      p.id,
      'OUT',
      qty,
      `${reason[0].toUpperCase()}${reason.slice(1)}${body.remarks ? ': ' + body.remarks : ''}`
    )

    writeDb(db)

    return { ok: true }
  }

  // Sales
  if (normalized === '/sales' && method === 'POST') {
    requirePerm(user, 'sell')

    if (!Array.isArray(body.items) || !body.items.length) {
      fail('Add at least one item')
    }

    const items = body.items.map(i => {
      const p = db.products.find(
        x => x.id === Number(i.id) && x.is_active
      )

      const qty = Number(i.qty)

      if (!p || !Number.isInteger(qty) || qty < 1) {
        fail('One of the selected products is invalid')
      }

      if (p.qty < qty) {
        fail(`Not enough stock for ${p.name}`)
      }

      return {
        id: p.id,
        name: p.name,
        qty,
        price: p.price,
        cost: p.cost_price || 0
      }
    })

    const total = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    )

    const methodName = [
      'cash',
      'gcash',
      'maya',
      'other'
    ].includes(body.method) ? body.method : 'cash'

    const paid = methodName === 'cash'
      ? Number(body.amount_paid)
      : total

    if (
      methodName === 'cash' &&
      (!Number.isFinite(paid) || paid < total)
    ) {
      fail('Cash received is less than the total')
    }

    items.forEach(i => {
      const p = db.products.find(x => x.id === i.id)

      p.qty -= i.qty

      addMove(
        db,
        user,
        p.id,
        'OUT',
        i.qty,
        `Sale #${db.next.sale}`
      )
    })

    const id = nextId(db, 'sale')

    const order = {
      id,
      status: 'completed',
      total,
      method: methodName,
      paid,
      date: nowIso(),
      cashier: user.name,
      items,
    }

    db.orders.push(order)

    writeDb(db)

    return {
      ok: true,
      order_id: id
    }
  }

  if (normalized === '/sales' && method === 'GET') {
    requirePerm(user, 'history')

    const canCost = ROLES[user.role].perms.includes('costs')

    return db.orders
      .slice()
      .reverse()
      .slice(0, 100)
      .map(o => ({
        id: o.id,
        status: o.status,
        total: o.total,
        method: o.method,
        paid: o.paid,
        at: formatAt(o.date),
        cashier: o.cashier,

        items: o.items.map(i => ({
          name: i.name,
          qty: i.qty,
          price: i.price,
          ...(canCost ? { cost: i.cost } : {})
        })),
      }))
  }

  match = normalized.match(/^\/sales\/(\d+)\/void$/)

  if (match && method === 'POST') {
    requirePerm(user, 'void')

    const order = db.orders.find(
      o => o.id === Number(match[1])
    )

    if (!order) fail('Sale not found', 404)
    if (order.status === 'cancelled') {
      fail('This sale is already voided')
    }

    order.status = 'cancelled'

    order.items.forEach(i => {
      const p = db.products.find(x => x.id === i.id)

      if (p) p.qty += i.qty

      addMove(
        db,
        user,
        i.id,
        'IN',
        i.qty,
        `Voided sale #${order.id}`
      )
    })

    writeDb(db)

    return { ok: true }
  }

  // Suppliers
  if (normalized === '/suppliers' && method === 'POST') {
    requirePerm(user, 'suppliers')

    if (!String(body.name || '').trim()) {
      fail('Supplier name is required')
    }

    db.suppliers.push({
      id: nextId(db, 'supplier'),
      name: String(body.name).trim(),
      contact: body.contact || '',
      phone: body.phone || '',
      email: body.email || '',
      address: body.address || ''
    })

    writeDb(db)

    return { ok: true }
  }

  match = normalized.match(/^\/suppliers\/(\d+)$/)

  if (match && method === 'PUT') {
    requirePerm(user, 'suppliers')

    const supplier = db.suppliers.find(
      s => s.id === Number(match[1])
    )

    if (!supplier) fail('Supplier not found', 404)

    supplier.name = String(body.name || '').trim()
    supplier.contact = body.contact || ''
    supplier.phone = body.phone || ''
    supplier.email = body.email || ''
    supplier.address = body.address || ''

    if (!supplier.name) {
      fail('Supplier name is required')
    }

    writeDb(db)

    return { ok: true }
  }

  if (match && method === 'DELETE') {
    requirePerm(user, 'suppliers')

    db.suppliers = db.suppliers.filter(
      s => s.id !== Number(match[1])
    )

    writeDb(db)

    return { ok: true }
  }

  fail(`Static app does not recognize ${method} ${normalized}`, 404)
}