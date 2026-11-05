import { useState, useEffect } from 'react'
import { api } from './services/api'
import Login from './pages/Login'
import Nav from './components/Nav'
import Modal from './components/Modal'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import NewSale from './pages/NewSale'
import StockMovements from './pages/StockMovements'
import Suppliers from './pages/Suppliers'
import Team from './pages/Team'
import Sales from './pages/Sales'
import Profile from './pages/Profile'
import { PageSkeleton } from './components/Skeleton'

const EMPTY = { products: [], categories: [], suppliers: [], orders: [], moves: [], archived: [] }

function savedUser() {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user?.id && token === `static-${user.id}`) return user
  } catch { /* start signed out if storage is unavailable */ }
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  return null
}

export default function App() {
  const [user, setUser] = useState(savedUser)
  const [loading, setLoading] = useState(Boolean(savedUser()))
  const [D, setD] = useState(EMPTY)
  const [view, setView] = useState('dash')
  const [cart, setCart] = useState([])
  const [modal, setModal] = useState(null)
  const [msg, setMsg] = useState('')

  const toast = m => { setMsg(m); setTimeout(() => setMsg(''), 2500) }
  const refresh = () => api('/data').then(setD).catch(e => toast(e.message || 'Unable to load store data')).finally(() => setLoading(false))

  useEffect(() => {
    if (user) {
      setLoading(true)
      refresh()
    } else {
      setLoading(false)
      setD(EMPTY)
    }
  }, [user?.id])

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setD(EMPTY)
      setView('dash')
      setCart([])
      setModal(null)
    }
    window.addEventListener('logout', handleLogout)
    return () => window.removeEventListener('logout', handleLogout)
  }, [])

  const login = ({ token, user: nextUser }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(nextUser))
    setD(EMPTY)
    setView('dash')
    setCart([])
    setUser(nextUser)
  }

  const logout = async () => {
    try { await api('/logout', 'POST') } catch { /* a local logout should always work */ }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setD(EMPTY)
    setView('dash')
    setCart([])
    setModal(null)
  }

  const run = async (fn, message) => {
    try {
      await fn()
      await refresh()
      setModal(null)
      toast(message)
      return true
    } catch (e) {
      toast(e.message)
      return false
    }
  }

  if (!user) return <Login onLogin={login} />

  const me = D.me || user
  const perms = me.perms || []
  const allowed = {
    profile: true,
    sales: perms.includes('history'),
    dash: true,
    prod: perms.includes('products'),
    sale: perms.includes('sell'),
    stock: perms.includes('stock'),
    sup: perms.includes('suppliers'),
    team: perms.includes('team'),
  }
  const page = allowed[view] ? view : 'dash'
  const shared = { D, run, toast, setModal, user: me, onLogout: logout }
  const busy = loading && ['dash', 'prod', 'sale', 'stock', 'sup'].includes(page)

  return (
    <>
      <Nav view={page} setView={setView} perms={perms} store={me.store} user={me} onLogout={logout} />
      <main>
        {busy && <PageSkeleton />}
        {page === 'profile' && <Profile {...shared} />}
        {page === 'sales' && <Sales {...shared} />}
        {page === 'team' && <Team {...shared} />}
        {!busy && page === 'dash' && <Dashboard {...shared} />}
        {!busy && page === 'prod' && <Products {...shared} />}
        {!busy && page === 'sale' && <NewSale {...shared} cart={cart} setCart={setCart} />}
        {!busy && page === 'stock' && <StockMovements {...shared} />}
        {!busy && page === 'sup' && <Suppliers {...shared} />}
      </main>
      {modal && <Modal {...modal} onSave={modal.save} onClose={() => setModal(null)} />}
      <Toast msg={msg} />
    </>
  )
}
