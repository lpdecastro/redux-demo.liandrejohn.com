import { Alert, Input, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSearch, setSort } from './features/filters/filterSlice';
import { useGetProductsQuery } from './services/productsApi';

const App = () => {
  const dispatch = useDispatch();
  const { search, sortBy, order, page } = useSelector((state) => state.filters);

  const [searchInput, setSearchInput] = useState('');

  const limit = 10;

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    search,
    sortBy,
    order,
    page,
    limit,
  });

  const columns = [
    {
      title: 'Product',
      dataIndex: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearch(searchInput));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, dispatch]);

  return (
    <div className='container py-4'>
      <h1 className='mb-4'>Products</h1>

      <div className='row g-3 mb-4'>
        <div className='col-md-8'>
          <Input
            placeholder='Search products...'
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              dispatch(setPage(1));
            }}
          />
        </div>

        <div className='col-md-4'>
          <Select
            className='w-100'
            value={`${sortBy}-${order}`}
            onChange={(value) => {
              const [sortBy, order] = value.split('-');

              dispatch(
                setSort({
                  sortBy,
                  order,
                })
              );
            }}
            options={[
              {
                value: 'title-asc',
                label: 'Name A-Z',
              },
              {
                value: 'title-desc',
                label: 'Name Z-A',
              },
              {
                value: 'price-asc',
                label: 'Price: Low to High',
              },
              {
                value: 'price-desc',
                label: 'Price: High to Low',
              },
              {
                value: 'rating-desc',
                label: 'Highest Rated',
              },
            ]}
          />
        </div>
      </div>

      {isLoading && <p className='text-center py-5 text-muted'>Loading...</p>}

      {isError && <Alert type='error' message='Failed to load products.' className='mb-3' />}

      {!isLoading && !isError && data?.products.length === 0 && (
        <p className='text-center py-5 text-muted'>No products found.</p>
      )}

      {!isLoading && !isError && data?.products.length > 0 && (
        <>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={data?.products ?? []}
            loading={isLoading || isFetching}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.total ?? 0,
              showSizeChanger: false,
              onChange: (newPage) => dispatch(setPage(newPage)),
            }}
          />
        </>
      )}
    </div>
  );
};

export default App;
