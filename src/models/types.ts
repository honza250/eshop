export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
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
  