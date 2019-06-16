
export interface Product {
  name: string | null;
  price: number | null;
  quantity: number | null;
}

export interface ProductList {
  name: string | null;
  field1: string | null;
  field2: string | null;
  accept: boolean;
  products: Product[];
}
