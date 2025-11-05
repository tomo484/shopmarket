export interface Item {
  ID: number;
  Name: string;
  Price: number;
  Description: string;
  SoldOut: boolean;
  UserID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  price: number;
  description?: string;
}

export interface UpdateItemRequest {
  name?: string;
  price?: number;
  description?: string;
  soldOut?: boolean;
}
