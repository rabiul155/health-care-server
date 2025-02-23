import { skip } from "node:test";

export const sanitizeSearchParam = <
  Obj extends Record<string, unknown>,
  Arr extends (keyof Obj)[]
>(
  obj: Obj,
  fields: Arr
) => {
  const sanitizeSearchParam: Partial<Obj> = {};
  if (Object.keys(obj).length !== 0) {
    for (const keys of fields) {
      if (obj.hasOwnProperty(keys)) {
        sanitizeSearchParam[keys] = obj[keys];
      }
    }
  }
  return sanitizeSearchParam;
};

export const paginateOrder = (options: any) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const orderBy = options.orderBy || "createdAt";
  const order = options.orders || "desc";

  return {
    limit,
    skip,
    orderBy,
    order,
  };
};
