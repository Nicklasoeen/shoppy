# Shoppy

Shoppy is a small online shop where you can browse products, view product
details, add items to a cart, and try the checkout. It also has a contact form
that demonstrates form validation.

## Run the app

Install the dependencies and start the development server:

```sh
npm ci
npm run dev
```

Run the linter and create a production build with:

```sh
npm run lint
npm run build
```

## How it works

React components make up the pages and reusable parts of the shop. React Router
handles navigation between the home page, product details, cart, contact form,
and checkout result. TypeScript defines the product and cart data shapes and
helps catch mistakes while developing.

The cart uses a shared React context, so product pages and the cart page can
read and update the same items. This keeps the setup simple for a small shop
without adding a separate state-management library. The cart is held in memory,
so it resets when the app is fully refreshed.

## Product data

Shoppy loads catalogue data and product details from the Noroff Online Shop
API:

- Catalogue: <https://v2.api.noroff.dev/online-shop>
- Product details: `https://v2.api.noroff.dev/online-shop/{id}` (replace `{id}`
  with the product ID)

## Demo behavior

Checkout is simulated: it clears the cart and shows a confirmation, but no
payment is processed. The contact form validates its fields, but does not send
a message.
