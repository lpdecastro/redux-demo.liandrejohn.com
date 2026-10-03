# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: start the Vite dev server with HMR
- `npm run build`: production build to `dist/`
- `npm run preview`: serve the production build locally
- `npm run lint`: run ESLint (flat config in `eslint.config.js`: JS recommended, react-hooks, react-refresh)

There is no test runner configured.

## Stack

React 19 + Vite, plain JavaScript/JSX (no TypeScript). State uses Redux Toolkit with RTK Query. The UI mixes two libraries: **Ant Design** components (`Table`, `Input`, `Select`, `Alert`) for widgets, and **Bootstrap** CSS classes (`container`, `row`, `col-md-*`, spacing utilities) for layout. Bootstrap CSS is imported globally in `src/main.jsx`.

## Architecture

A single-page product browser backed by the public DummyJSON API (`https://dummyjson.com/`).

Data flow:
1. `src/features/filters/filterSlice.js` holds the UI query state (`search`, `sortBy`, `order`, `page`). `setSearch` and `setSort` reset `page` to 1.
2. `src/services/productsApi.js` defines the RTK Query API. `getProducts` switches between `products/search` (when `search` is non-empty, sent as `q`) and `products`, and turns `page`/`limit` into DummyJSON's `skip`/`limit` params. The response has the shape `{ products, total, ... }`.
3. `src/app/store.js` registers both the `filters` reducer and the `productsApi` reducer and middleware.
4. `src/App.jsx` reads `filters` from the store and passes them, along with a fixed `limit` of 10, to `useGetProductsQuery`. The search box keeps a local `searchInput` state that is debounced (300ms) before `setSearch` is dispatched. Pagination is server-side, driven through the AntD `Table`'s `pagination.onChange` → `setPage`.

Sort options in the `Select` are encoded as `"<sortBy>-<order>"` strings and split on `-` before `setSort` is dispatched.

The trailing comment blocks in `filterSlice.js` and `productsApi.js` are learning notes that explain what `createSlice` and `createApi` generate. They are not dead code to remove.
