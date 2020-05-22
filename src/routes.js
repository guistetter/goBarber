import { Router } from "express";
import multer from "multer";
import multerconfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ProviderController from "./app/controllers/ProviderController";
import authMiddleware from "./app/middlewares/auth";
import FileController from "./app/controllers/FileController";

const routes = new Router();
const upload = multer(multerconfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware); //tudo que vem apos passara pelo middleware

routes.put("/users", /*authMiddleware*/ UserController.update);

routes.get("/providers", ProviderController.index);

routes.post("/files", upload.single("file"), FileController.store);

export default routes;
