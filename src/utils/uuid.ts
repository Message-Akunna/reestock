"use strict";
import Sequelize from "sequelize";
import { v1 as uuidV1, v4 as uuidV4, validate as UUIDValidaton } from "uuid";

const uuid = {
  toBinary: (uuid: string) => {
    if (!uuid) uuid = uuidV1();
    else if (typeof uuid !== "string" && Buffer.isBuffer(uuid)) return uuid;
    const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
    return Buffer.concat([
      buf.slice(6, 8),
      buf.slice(4, 6),
      buf.slice(0, 4),
      buf.slice(8, 16),
    ]);
  },
  toString: (binary: { toString: (arg0: string, arg1: number, arg2: number) => any; }) => {
    if (!binary) throw new Error("Kindly supply binary UUID value");
    if (typeof binary === "string") return binary;
    return [
      binary.toString("hex", 4, 8),
      binary.toString("hex", 2, 4),
      binary.toString("hex", 0, 2),
      binary.toString("hex", 8, 10),
      binary.toString("hex", 10, 16),
    ].join("-");
  },
  mysqlBinary: (value: unknown) => Sequelize.fn("UUID_TO_BIN", value, 1),
  mysqlUUID: (field: string) => [
    Sequelize.fn("BIN_TO_UUID", Sequelize.col(field), 1),
    field,
  ],
  get: () => uuidV4(),
  isValid: (uuid: string) => UUIDValidaton(uuid),
  manyToString: (data: { [x: string]: any; }, keys = []) => {
    if (!data) return;
    keys.forEach((key) => {
      if (data[key]) data[key] = uuid.toString(data[key]);
    });
    return data;
  },
  manyToBinary: (data: { [x: string]: any; }, keys = []) => {
    if (!data) return;
    keys.forEach((key) => {
      if (data[key]) data[key] = uuid.toBinary(data[key]);
    });
    return data;
  },
};

export default uuid;
