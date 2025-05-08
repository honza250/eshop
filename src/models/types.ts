export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
  }
  
  export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
  }
  
  export interface Order {
    id: number;
    userEmail: string;
    status: string;
  }
  