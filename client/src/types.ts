import { Key } from 'react';

export type Token = { csrfToken: string };

export type ID = string | bigint | number | Key;

export type Order = {
  _id: ID;
  products: Product[];
};

export type Product = {
  description: string;
  _id: ID;
  title: string;
  imageUrl: string;
  price: number;
};

export type Item = {
  product: Product;
  quantity: number;
};
