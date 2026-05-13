import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

const fetchMock = jest.fn();
(global as any).fetch = fetchMock;

const ShopifyProducts = require('../components/ShopifyProducts').default;

beforeEach(() => {
  fetchMock.mockReset();
});

test('loads Shopify products from the backend proxy', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ([
      {
        id: 'gid://shopify/Product/1',
        title: 'Sample T-Shirt',
        description: 'A sample product.',
        online_store_url: 'https://example.com/products/sample',
        price: { amount: '1980.00', currency_code: 'JPY' },
      },
    ]),
  });

  render(<ShopifyProducts maxWidth={720} />);
  fireEvent.press(await screen.findByText('LOAD SHOPIFY PRODUCTS'));

  expect(await screen.findByText('Sample T-Shirt')).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringMatching(/\/shopify\/products$/),
    expect.any(Object),
  );
});
