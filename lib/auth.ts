import { NextApiRequest, NextApiResponse } from "next";
import { jwt } from "jsonwebtoken";
import prisma from "./prisma";

export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.SPOTICLONE_ACCESS_TOKEN;

    if (token) {
      let user;

      try {
        const { id } = jwt.verify(token, "hello");
        user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
          throw new Error("user not found");
        }
      } catch (error) {
        res.status(401);
        res.json({ error: error.message ?? "not authorized" });
        return;
      }

      return handler(req, res, user);
    }

    res.status(401);
    res.json({ error: "no token" });
  };
};
