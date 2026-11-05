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
import Analytics from './pages/Analytics'

const EMPTY = {
  products: [],
  categories: [],
  suppliers: [],
  orders: [],
  moves: [],
  archived: [],
}

function savedUser() {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const storeId = Number(user?.storeId || 1)

    const newToken = `static-${storeId}-${user?.id}`
    const oldSariStoreToken = storeId === 1 && token === `static-${user?.id}`

    if (user?.id && (token === newToken || oldSariStoreToken)) {
      return user
    }
  } catch {
    // Invalid saved login; show the login form.
  }

  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch {
    // Ignore storage cleanup errors.
  }

  return null
}

export default function App() {
  const [user, setUser] = useState(() => savedUser())
  const [loading, setLoading] = useState(() => {
    try {
      return Boolean(localStorage.getItem('token'))
    } catch {
      return false
    }
  })
  const [D, setD] = useState(EMPTY)
  const [view, setView] = useState('dash')
  const [cart, setCart] = useState([])
  const [modal, setModal] = useState(null)
  const [msg, setMsg] = useState('')

  const toast = message => {
    setMsg(message)
    window.setTimeout(() => setMsg(''), 3000)
  }

  const refresh = async () => {
    try {
      const data = await api('/data')
      setD(data)
      return data
    } catch (error) {
      setD(EMPTY)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    if (!user) {
      setLoading(false)
      setD(EMPTY)
      return () => { active = false }
    }

    setLoading(true)

    api('/data')
      .then(data => {
        if (active) setD(data)
      })
      .catch(error => {
        if (!active) return

        setD(EMPTY)
        toast(error.message || 'Unable to load store data. Please log in again.')

        if (error.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [user?.id, user?.storeId])

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
    setLoading(true)
    setView('dash')
    setCart([])
    setModal(null)
    setUser(nextUser)
  }

  const logout = async () => {
    try {
      await api('/logout', 'POST')
    } catch {
      // Local logout still works if the saved session is already invalid.
    }

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
    } catch (error) {
      toast(error.message || 'Something went wrong')
      return false
    }
  }

  if (!user) return <Login onLogin={login} />

  const me = D.me || user
  const perms = me.perms || []

  const allowed = {
    analytics: perms.includes('analytics'),
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
      <Nav
        view={page}
        setView={setView}
        perms={perms}
        store={me.store}
        user={me}
        onLogout={logout}
      />

      <main>
        {page === 'analytics' && <Analytics {...shared} />}

        {busy && <PageSkeleton page={page} />}

        {page === 'profile' && <Profile {...shared} />}
        {page === 'sales' && <Sales {...shared} />}
        {page === 'team' && <Team {...shared} />}

        {!busy && page === 'dash' && <Dashboard {...shared} />}
        {!busy && page === 'prod' && <Products {...shared} />}
        {!busy && page === 'sale' && (
          <NewSale {...shared} cart={cart} setCart={setCart} />
        )}
        {!busy && page === 'stock' && <StockMovements {...shared} />}
        {!busy && page === 'sup' && <Suppliers {...shared} />}
      </main>

      {modal && (
        <Modal
          {...modal}
          onSave={modal.save}
          onClose={() => setModal(null)}
        />
      )}

      <Toast msg={msg} />
    </>
  )
}
