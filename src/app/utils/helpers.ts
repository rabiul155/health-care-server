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
