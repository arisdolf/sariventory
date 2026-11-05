export const Sk = ({ w = '100%', h = 14, r = 8, style }) =>
  <span
    className="sk"
    style={{
      display: 'block',
      width: w,
      height: h,
      borderRadius: r,
      ...style
    }}
  />

export function PageSkeleton({ title = true, stats = true, cards = 4, page }) {
  // Analytics loading skeleton
  if (page === 'analytics') {
    const heights = [35, 55, 40, 70, 50, 85, 60, 45, 75, 55, 65, 40]

    return (
      <div role="status" aria-label="Loading">
        {title && <>
          <Sk w={200} h={26} style={{ marginBottom: 8 }} />
          <Sk w={280} h={14} style={{ marginBottom: 22 }} />
        </>}

        <div className="analytics-heading">
          <Sk w={180} h={40} />
          <Sk w={170} h={40} />
        </div>

        <div className="analytics-metrics">
          {Array.from({ length: 4 }, (_, i) => (
            <div className="analytics-metric" key={i}>
              <Sk w={100} h={12} />
              <Sk w={130} h={26} />
              <Sk w={110} h={12} />
            </div>
          ))}
        </div>

        <div className="card analytics-section">
          <Sk w={140} h={18} style={{ marginBottom: 16 }} />

          <div className="an-chart">
            {heights.map((h, i) => (
              <div className="an-col" key={i}>
                <div className="an-plot">
                  <Sk
                    w="100%"
                    h={h + '%'}
                    r={6}
                    style={{ maxWidth: 36 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-columns">
          {[0, 1].map(i => (
            <div className="card analytics-section" key={i}>
              <Sk w={150} h={18} style={{ marginBottom: 16 }} />
              {[0, 1, 2, 3, 4].map(j => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0'
                  }}
                >
                  <Sk w="45%" h={14} />
                  <Sk w={70} h={14} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="card analytics-section">
          <Sk w={150} h={18} style={{ marginBottom: 16 }} />

          <div className="analytics-category-grid">
            {[0, 1, 2, 3].map(i => (
              <div className="analytics-category" key={i}>
                <Sk w={90} h={12} />
                <Sk w={120} h={22} />
                <Sk w={80} h={12} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default skeleton for other pages
  return (
    <div role="status" aria-label="Loading">
      {title && <>
        <Sk w={200} h={26} style={{ marginBottom: 8 }} />
        <Sk w={280} h={14} style={{ marginBottom: 22 }} />
      </>}

      {stats && <div className="stats">
        {[0, 1, 2].map(i => (
          <div className="stat" key={i}>
            <Sk w={90} h={26} style={{ marginBottom: 8 }} />
            <Sk w={120} h={12} />
          </div>
        ))}
      </div>}

      {Array.from({ length: cards }, (_, i) => (
        <div className="card" key={i} style={{ marginBottom: 10 }}>
          <Sk w="45%" h={16} style={{ marginBottom: 10 }} />
          <Sk w="75%" h={12} />
        </div>
      ))}
    </div>
  )
}