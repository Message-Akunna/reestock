import uuid from "../../utils/uuid";
import { Op, Transaction } from "sequelize";
import {
  paginate,
  encodeJwt,
  ExistsError,
  NotFoundError,
  InvalidTokenError,
  AuthenticationError,
} from "iyasunday";
//
import db from "../../models";
import { UserAttributes } from "../../utils/interface";

const setUser = async (
  userId: string,
  transaction: Transaction | null = null
) => {
  try {
    // Find the user
    let user = await db.User.findOne({
      where: { id: userId },
      attributes: [
        "id",
        "role",
        "email",
        "status",
        "surname",
        "firstname",
        "phoneNumber",
      ],
      transaction,
    });

    if (!user) throw new NotFoundError("User account not found");

    const tokenRef = uuid.get(); // generate a new UUID
    // Generate the JWT token
    const token = await encodeJwt({
      data: { tokenRef, createdAt: new Date() },
      secreteKey: process.env.APP_KEY as string,
      duration: process.env.JWT_TOKEN_VALIDITY as string,
    });

    // Update the user
    await db.User.update(
      { tokenRef, lastLoginAt: new Date() },
      { where: { id: user.id }, transaction }
    );

    // Convert the Sequelize instance to a plain JavaScript object
    user = user.toJSON();

    // Add the token to the user object
    user.token = token;

    return user;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: Omit<UserAttributes, "id">) => {
  try {
    return await db.sequelize.transaction(async (transaction: Transaction) => {
      let user = await db.User.findOne({
        where: {
          [Op.or]: {
            email: body.email,
            phoneNumber: body.phoneNumber,
          },
        },
        transaction,
      });
      if (user) {
        if (user.email === body.email)
          throw new ExistsError("User with email already exists");
        if (user.phoneNumber === body.phoneNumber)
          throw new ExistsError("User with email already exists");
      }
      user = await db.User.create(body, { transaction });

      return {
        success: true,
        message: "Account created successfully",
        data: await setUser(user.id, transaction),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (
  body: Pick<UserAttributes, "email" | "password">
) => {
  const { email, password } = body;
  try {
    const user = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) throw new AuthenticationError("User with email not found, please register to get an account");
    if (!(await user.checkPassword(password)))
      throw new AuthenticationError("Login credentials not correct");
    return {
      success: true,
      message: "Logged in successfully",
      data: await setUser(user.id),
    };
  } catch (error) {
    throw error;
  }
};

export const update = async (id: string, body: Record<string, string>) => {
  try {
    return await db.sequelize.transaction(async (transaction: Transaction) => {
      let user = await db.User.findByPk(id, {
        attributes: ["id", "tokenRef"],
      });
      if (!user) throw new NotFoundError("User not found");

      user = await user.update(body, { transaction, return: true });

      return {
        success: true,
        message: "data update successfully",
        data: await getUserWithToken(user.tokenRef, transaction),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (
  id: string,
  body: Record<string, string>
) => {
  try {
    let user = await db.User.findByPk(id, {
      attributes: ["password", "tokenRef"],
    });
    if (!user) throw new NotFoundError("user not found");

    const { oldPassword, newPassword, confirmNewPassword } = body;

    if (!(await user.checkPassword(oldPassword)))
      throw new AuthenticationError("Old password not correct");
    else if (newPassword !== confirmNewPassword)
      throw new AuthenticationError("Passwords do not matched");

    await db.User.update({ password: newPassword }, { where: { id } });

    return {
      success: true,
      message: "Password changed successfully",
      data: await getUserWithToken(user.tokenRef),
    };
  } catch (error) {
    throw error;
  }
};

export const list = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    const totalUsers = await db.User.count();
    const { offset, pageCount } = paginate(totalUsers, page, limit);
    const allUsers = await db.User.findAll({
      attributes: [
        "id",
        "role",
        "email",
        "status",
        "surname",
        "firstname",
        "phoneNumber",
      ],
      limit: limit,
      offset: offset,
      transaction,
    });
    return {
      success: true,
      data: allUsers,
      page,
      pageCount,
      limit,
    };
  });
};

export const view = async (userId: string) => {
  const user = await db.User.findByPk(userId, {
    attributes: [
      "id",
      "role",
      "email",
      "status",
      "surname",
      "firstname",
      "phoneNumber",
    ],
    include: [{ model: db.Order, as: "orders" }],
  });
  if (!user) throw new NotFoundError("Users not found");

  return {
    success: true,
    message: "User's details fetched successfully",
    data: user,
  };
};

export const remove = async (userId: string) => {
  const user = await db.User.findByPk(userId);
  if (!user) throw new NotFoundError("User not found");
  await user.destroy();

  return {
    success: true,
    message: `User account deleted successfully`,
  };
};

export const getUserWithToken = async (
  tokenRef: string,
  transaction: Transaction | null = null
) => {
  try {
    const user = await db.User.findOne({
      where: { tokenRef: tokenRef },
      attributes: [
        "id",
        "role",
        "email",
        "status",
        "surname",
        "firstname",
        "phoneNumber",
      ],
      transaction,
    });
    if (!user)
      throw new InvalidTokenError("User with token not found. Please login");
    return user;
  } catch (error) {
    throw error;
  }
};

export default {
  list,
  view,
  login,
  create,
  update,
  remove,
  changePassword,
  getUserWithToken,
};
