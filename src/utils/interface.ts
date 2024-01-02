import {
  ROLES,
  ORDER_STATUS,
  ACCOUNT_STATUS,
  DELIVERY_TYPES,
  PAYMENT_STATUS,
} from "@/src/utils/constants";

export interface UserAttributes {
  id: string;
  surname: string;
  firstname: string;
  email: string;
  password: string;
  role?: keyof typeof ROLES;
  status?: keyof typeof ACCOUNT_STATUS;
  lastLogin?: Date;
  token?: string;
  avatar?: string;
}

export interface ProductAttributes {
  name: string;
  brandName: string;
  description: string;
  slug: string;
  price: number;
  sku: string;
  id: string;
  reorderLevel: number;
  reorderQuantity: number;
}

export interface AddressAttributes {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string | null;
}

export interface CartAttributes {
  id: number;
}

export interface CartItemAttributes {
  id: number;
  quantity: number;
}

export interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  categoryId: number | null;
  description: string | null;
  imageUrl: string | null;
}

export interface InventoryAttributes {
  id: number;
  quantity: number;
  reorderQuantity: number;
  reorderLevel: number;
}

export interface OrderAttributes {
  id: number;
  orderTotal: number;
  status?: keyof typeof ORDER_STATUS;
  deliveryType: keyof typeof DELIVERY_TYPES;
}

export interface OrderItemAttributes {
  id: number;
  quantity: number;
}

export interface PaymentAttributes {
  id: number;
  amount: number;
  trans_ref: string;
  transactionId: number | null;
  status: keyof typeof PAYMENT_STATUS;
}

export interface TagAttributes {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
}

export interface TrackingAttributes {
  id: number;
}
