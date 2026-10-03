import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com/',
  }),

  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ search, sortBy, order, page, limit }) => ({
        url: search ? 'products/search' : 'products',

        params: {
          ...(search && { q: search }),
          sortBy,
          order,
          limit,
          skip: (page - 1) * limit,
        },
      }),
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;

// Conceptually, createApi() gives you an object roughly like this:

// const productsApi = {
//   reducerPath: "productsApi",

//   reducer: function apiReducer(state, action) {
//     // manages RTK Query cache/loading/error state
//   },

//   middleware: function apiMiddleware(store) {
//     // handles fetching, caching, refetching, etc.
//   },

//   endpoints: {
//     getProducts: {
//       // endpoint definition
//       query: ({ search, sortBy, order, page, limit }) => ({
//         url: search
//           ? "products/search"
//           : "products",

//         params: {
//           ...(search && { q: search }),
//           sortBy,
//           order,
//           limit,
//           skip: (page - 1) * limit,
//         },
//       }),

//       // generated helpers
//       initiate: function (args) {
//         // starts the request
//       },

//       select: function (args) {
//         // reads cached result from Redux state
//       },
//     },
//   },

//   // generated React hook
//   useGetProductsQuery: function (args) {
//     // internally:
//     // 1. subscribes to Redux state
//     // 2. dispatches the request if needed
//     // 3. returns data/loading/error
//   },

//   util: {
//     // cache utilities, resetApiState, etc.
//   },
// };

// The important generated pieces are basically:
// productsApi.reducer
// productsApi.middleware
// productsApi.endpoints
// productsApi.useGetProductsQuery

// So compared with createSlice():
// createSlice()
// → reducer + action creators
// createApi()
// → reducer + middleware + endpoints + hooks + caching logic
