import { api } from '../services/api'

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '8px 0',
}

export default function Categories({ D, run, setModal }) {
  const list = D.categories || []

  const add = () => setModal({
    title: 'Add category',
    fields: [{ n: 'name', l: 'Category name', req: 1 }],
    save: value => run(
      () => api('/categories', 'POST', value),
      'Category added'
    ),
  })

  const rename = category => setModal({
    title: 'Rename category',
    fields: [{
      n: 'name',
      l: 'Category name',
      v: category.name,
      req: 1,
    }],
    save: value => run(
      () => api('/categories/' + category.id, 'PUT', value),
      'Category renamed'
    ),
  })

  const remove = category => {
    const confirmed = window.confirm(
      `Delete the category "${category.name}"?`
    )

    if (confirmed) {
      run(
        () => api('/categories/' + category.id, 'DELETE'),
        'Category deleted'
      )
    }
  }

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div style={row}>
        <h3 style={{ margin: 0 }}>Categories</h3>
        <button className="btn sm" onClick={add}>
          Add category
        </button>
      </div>

      {list.length ? (
        list.map(category => {
          const count = D.products.filter(
            product => product.cat === category.name
          ).length

          return (
            <div className="category-row" key={category.id}>
              <span className="category-name">
                {category.name}
                <small>
                  {' '}· {count} product{count === 1 ? '' : 's'}
                </small>
              </span>

              <div className="category-actions">
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => rename(category)}
                >
                  Rename
                </button>

                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => remove(category)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })
      ) : (
        <div className="empty">No categories yet. Add one.</div>
      )}
    </div>
  )
}
