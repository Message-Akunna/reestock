export const USERS_TABLE = "users";

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  POS: "POS",
};

export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  UNVERIFIED: "UNVERIFIED",
  DEACTIVATED: "DEACTIVATED",
  BLOCKED: "BLOCKED",
};

export const DELIVERY_TYPES = {
  PICKUP: "PICKUP",
  DELIVERY: "DELIVERY",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESSFUL: "SUCCESSFUL",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
};

export const ORDER_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  PENDING: "PENDING",
};

export const ALLOWED_IMAGE_FORMAT = ["jpg", "jpeg", "png"];

const date = new Date();
export const FILE_LOCATION =
  process.env.STORAGE_PATH +
  `/${date.getFullYear()}/${
    parseInt(String(date.getMonth())) + 1
  }/${date.getDate()}`;
