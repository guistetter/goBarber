import { Router } from "express";
import multer from "multer";
import multerconfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerconfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware); //tudo que vem apos passara pelo middleware

routes.put("/users", /*authMiddleware*/ UserController.update);

routes.post("/files", upload.single("file"), (req, res) => {
  return res.json({ ok: true });
});

export default routes;
