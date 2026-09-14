import { z } from "zod";

// An optional <select> left on its blank "Unspecified" option submits an
// empty string in FormData, not undefined -- z.enum(...).optional() rejects
// that empty string as an invalid enum value. This treats "" the same as
// "not provided" before validating against the enum.
export function optionalEnum<T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(values).optional(),
  );
}
