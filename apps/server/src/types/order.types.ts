export type CreateOrderItem = {
  productId: number;
  quantity: number;
};

export type CreateOrderDto = {
  userId: number;
  items: CreateOrderItem[];
};
