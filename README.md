# Sariventory — Static Demo

This version runs as a **static React/Vite website**. It does not need Laravel, PHP, MySQL, SQLite, or a backend server. The app saves its store data and accounts in the browser's `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Create a deployable build:

```bash
npm run build
```

Deploy the generated `dist/` folder to Netlify, Vercel, GitHub Pages, or another static host. For Vercel/Netlify, use `npm run build` as the build command and `dist` as the output directory.

## Demo store accounts

The first run automatically creates one demo store named **Sari Store**, with sample products, categories, suppliers, and five team accounts. The login page includes one-click quick login buttons.

| Role | Email | Password |
|---|---|---|
| Owner | `owner@saristore.local` | `owner1234` |
| Manager | `manager@saristore.local` | `manager1234` |
| Cashier | `cashier@saristore.local` | `cashier1234` |
| Inventory staff | `inventory@saristore.local` | `inventory1234` |
| Viewer | `viewer@saristore.local` | `viewer1234` |

You can also create an account from the login page. New accounts automatically join the demo store as a cashier. The owner can change a member's role from the Team page.

## Important limitations

- Data is stored only in the current browser and device. It is not synchronized between different users' devices or browsers.
- Clearing browser site data removes the locally stored store data and accounts.
- This is a demo/prototype authentication system, not secure production authentication. Browser storage can be inspected or edited by the person using the device. Do not use real customer, payment, or business-sensitive data with this version.
- If you need multiple people on different devices to share live inventory and sales, a backend/database is still required.

## Reset the demo data

In the browser developer console, run:

```js
localStorage.removeItem('sariventory_static_db_v1');
localStorage.removeItem('token');
localStorage.removeItem('user');
location.reload();
```

The app recreates the original demo store on the next login.
