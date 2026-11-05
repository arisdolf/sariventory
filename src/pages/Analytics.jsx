import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { peso } from '../utils/format'
import Empty from '../components/Empty'
import { PageSkeleton } from '../components/Skeleton'

const OPTIONS = [
  ['7', 'Last 7 days'],
  ['30', 'Last 30 days'],
  ['90', 'Last 90 days'],
  ['365', 'Last 12 months'],
  ['1827', 'Last 5 years']
]

const num = value => Number(value || 0)

function Metric({ label, value, detail }) {
  return (
    <div className="analytics-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}

function SalesChart({ daily }) {
  const max = Math.max(1, ...daily.map(d => num(d.revenue)))

  return (
    <div className="an-chart">
      {daily.map((d, i) => {
        const percent = num(d.revenue) / max * 100
        const showLabel =
          daily.length <= 7 ||
          i % (daily.length <= 30 ? 5 : daily.length <= 90 ? 15 : 60) === 0

        return (
          <div className="an-col" key={d.day}>
            <div className="an-plot">
              <div
                className="an-bar"
                style={{ height: `${percent}%` }}
                title={`${d.day}: ${peso(d.revenue)}`}
              />
            </div>

            {showLabel && (
              <small>
                {new Date(`${d.day}T00:00:00`).toLocaleDateString(
                  'en-PH',
                  { month: 'short', day: 'numeric' }
                )}
              </small>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Analytics({ user }) {
  const [range, setRange] = useState('30')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    api(`/analytics?days=${range}`)
      .then(result => {
        if (active) setData(result)
      })
      .catch(err => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [range])

 if (loading && !data) {
  return <PageSkeleton page="analytics" />
}

  const summary = data?.summary || {}
  const payments = data?.payments || []
  const maxPayment = Math.max(
    1,
    ...payments.map(p => num(p.revenue))
  )

  return (
    <>
      <div className="analytics-heading">
        <div>
          <h1>Analytics</h1>
          <p className="sub">
            Store performance and sales insights for {user?.store}.
          </p>
        </div>

        <label className="analytics-range">
          <span>Period</span>
          <select
            value={range}
            onChange={e => setRange(e.target.value)}
          >
            {OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="analytics-error">{error}</div>}

      {loading && <p className="sub">Updating analytics...</p>}

      <div className="analytics-metrics">
        <Metric
          label="Revenue"
          value={peso(summary.revenue)}
          detail="Completed sales"
        />
        <Metric
          label="Gross profit"
          value={peso(summary.profit)}
          detail="Revenue less item cost"
        />
        <Metric
          label="Orders"
          value={num(summary.orders)}
          detail="Completed transactions"
        />
        <Metric
          label="Items sold"
          value={num(summary.items)}
          detail={`Average order: ${peso(summary.averageOrder)}`}
        />
      </div>

      <section className="card analytics-section">
        <div className="analytics-section-head">
          <div>
            <h3>Sales trend</h3>
            <p>Daily revenue</p>
          </div>
          <strong>{peso(summary.revenue)}</strong>
        </div>

        {summary.orders
          ? <SalesChart daily={data?.daily || []} />
          : <Empty>No completed sales in this period.</Empty>
        }
      </section>

      <div className="analytics-columns">
        <section className="card analytics-section">
          <h3>Top-selling products</h3>

          {data?.topProducts?.length
            ? data.topProducts.map((p, i) => (
              <div className="analytics-list-row" key={p.id}>
                <b>{i + 1}</b>
                <div className="analytics-product-name">
                  <b>{p.name}</b>
                  <small>{p.units} units sold</small>
                </div>
                <strong>{peso(p.revenue)}</strong>
              </div>
            ))
            : <Empty>No product sales yet.</Empty>
          }
        </section>

        <section className="card analytics-section">
          <h3>Payment methods</h3>

          {payments.length
            ? payments.map(p => (
              <div className="analytics-breakdown" key={p.method}>
                <div className="analytics-breakdown-label">
                  <b>{p.method.toUpperCase()}</b>
                  <span>{peso(p.revenue)}</span>
                </div>

                <div className="analytics-track">
                  <span style={{
                    width: `${p.revenue / maxPayment * 100}%`
                  }} />
                </div>

                <small>{p.orders} orders</small>
              </div>
            ))
            : <Empty>No payment data yet.</Empty>
          }
        </section>
      </div>

      <section className="card analytics-section">
        <h3>Sales by category</h3>

        {data?.categories?.length
          ? (
            <div className="analytics-category-grid">
              {data.categories.map(c => (
                <div className="analytics-category" key={c.name}>
                  <span>{c.name}</span>
                  <strong>{peso(c.revenue)}</strong>
                  <small>{c.units} units sold</small>
                </div>
              ))}
            </div>
          )
          : <Empty>No category sales yet.</Empty>
        }
      </section>
    </>
  )
}