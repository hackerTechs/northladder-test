import { Response } from "express";

export const response = {
  success: (
    res: Response,
    { data, message, status }: { message: string; data?: any; status?: number }
  ) =>
    res.json({
      status: status || 200,
      data,
      message,
      error: false,
    }),
  error: (
    res: Response,
    params: {
      message?: string;
      status?: number;
    } = {
      message: "Something went wrong",
      status: 500,
    }
  ) =>
    res.json({
      status: params.status,
      message: params.message,
      error: true,
    }),
};

export const trimBody = (body: Record<string, any>) => {
  let temp: typeof body = {};
  const keys = Object.keys(body);
  if (keys.length) {
    for (const key of keys) {
      if (typeof body[key] !== "string") {
        temp[key] = trimBody(body[key]);
      } else temp[key] = body[key].trim();
    }
  }
  return temp;
};
