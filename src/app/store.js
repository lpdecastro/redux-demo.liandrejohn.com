import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../features/filters/filterSlice';
import { productsApi } from '../services/productsApi';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,

    [productsApi.reducerPath]: productsApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
});
