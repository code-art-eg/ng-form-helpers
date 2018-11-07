
export interface Product {
    name: string|null;
    price: number|null;
    quantity: number|null;
}

export interface ProductList {
    name: string|null;
    products: Product[];
}
