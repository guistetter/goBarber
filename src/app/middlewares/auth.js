import jwt from "jsonwebtoken";
import { pomisify, promisify } from "util";
import authConfig from "../../config/auth";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }
  const [bearer, token] = authHeader.split(" ");

  try {
    //id
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    console.log(decoded);
    //id foi passado como parametro no sessionController no jwt entao temos ele aqui
    req.userId = decoded.id;
    //passamos o id do usuario para o req, assim sabemos qual usuario editar...
    return next();
  } catch (err) {
    return res.status(401).json({ error: "token invalid" });
  }
  return next();
};
