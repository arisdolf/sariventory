# Sariventory Static Demo

This version runs entirely in the browser using `localStorage`. It does not call Laravel, PHP, MySQL, or any backend API.

## Run locally
1. Install Node.js.
2. Run `npm install`.
3. Run `npm run dev`.

## Build and deploy
1. Run `npm run build`.
2. Deploy the generated `dist` folder to Netlify, Vercel, GitHub Pages, or any static hosting provider.

## Demo login
All eight demo users from `DemoStoreSeeder.php` are included. Each account uses the same password: `Demo12345!`.

| Role | Email |
|---|---|
| Owner | demo.owner@sariventory.test |
| Manager | demo.manager@sariventory.test |
| Cashier | demo.angelica@sariventory.test |
| Cashier | demo.mark@sariventory.test |
| Cashier | demo.joy@sariventory.test |
| Cashier | demo.paolo@sariventory.test |
| Inventory | demo.rico@sariventory.test |
| Viewer | demo.teresa@sariventory.test |

The login page does not automatically sign in. It only fills the selected account's email and password; press **Log in** to authenticate.

## Important limitations
This is a front-end demonstration, not a secure production system. Demo credentials and data are bundled in public JavaScript, and browser `localStorage` is editable by visitors. Data changes are saved only in the current browser/device and do not synchronize between users. Password changes, account deletion, and changing/removing seeded team accounts are intentionally disabled. Use a real backend and database for production or shared multi-user data.
