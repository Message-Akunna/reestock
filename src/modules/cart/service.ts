import db from "../../models";
import { Transaction, fn } from "sequelize";
import { NotFoundError, successMessage } from "iyasunday";

export const addToCart = async (userId: string, body: Record<string, any>) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    // Check if the product exists
    const product = await db.Product.findByPk(body.productId, { transaction });
    if (!product)
      throw new NotFoundError(
        `Product with ID ${body.productId} does not exist`
      );

    // Find or create a cart for the user
    const [cart] = await db.Cart.findOrCreate({
      where: { userId: userId },
      transaction,
    });

    // Find an existing cart item for the product
    let cartItem = await db.CartItem.findOne({
      where: { productId: body.productId, cartId: cart.id },
      transaction,
    });

    let message = "";

    if (cartItem) {
      // If the cart item exists, update it
      message = "Cart updated successfully";
      cartItem.quantity += body.quantity;
      await cartItem.save({ transaction });
    } else {
      // If the cart item doesn't exist, create it
      message = "Product added to cart";
      cartItem = await db.CartItem.create(
        {
          ...body,
          cartId: cart.id,
        },
        { transaction }
      );
    }

    return {
      success: true,
      message,
      data: cartItem,
    };
  });
};

export const update = async (cartId: number, body: Record<string, any>) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    const cartItem = await db.CartItem.findOne({
      where: { cartId: cartId },
      transaction,
    });
    if (!cartItem) throw new NotFoundError("Item not found");

    await cartItem.update(body, { transaction });
    return {
      success: true,
      message: "Cart updated successfully",
      data: cartItem,
    };
  });
};

export const list = async (userId: string) => {
  let cartItems = await db.Cart.findAll({
    where: { userId: userId },
    include: [
      {
        model: db.CartItem,
        as: "items",
        include: [
          {
            model: db.Product,
            as: "product",
            attributes: ["id", "description", "name", "slug"],
          },
        ],
      },
    ],
  });

  return {
    success: true,
    message: `Cart items fetched`,
    data: cartItems,
  };
};

export const remove = async (cartItemId: number) => {
  let cartItem = await db.CartItem.findByPk(cartItemId);
  if (!cartItem) throw new NotFoundError("Item not found in cart");
  await cartItem.destroy();
  return successMessage("Item removed from cart successfully");
};

export async function emptyCart(userId: string) {
  try {
    const cart = await db.Cart.findOne({
      where: { userId: userId },
    });
    if (!cart) throw new NotFoundError("Cart not found");
    await cart.destroy();
    return successMessage(`Cart successfully deleted`);
  } catch (error) {
    throw error;
  }
}

export default { addToCart, update, list, remove, emptyCart };
