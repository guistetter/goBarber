import { Router } from "express";
import multer from "multer";
import multerconfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ProviderController from "./app/controllers/ProviderController";
import authMiddleware from "./app/middlewares/auth";
import FileController from "./app/controllers/FileController";
import AppointmentController from "./app/controllers/AppointmentController";
import ScheduleController from "./app/controllers/ScheduleController";
import NotificationController from "./app/controllers/NotificationController";
import AvailableController from "./app/controllers/AvailableController";
const routes = new Router();
const upload = multer(multerconfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware); //tudo que vem apos passara pelo middleware

routes.put("/users", /*authMiddleware*/ UserController.update);

routes.get("/providers", ProviderController.index);
//rota para listar horarios vagos por prestador de servico considerar intervalo de tempo, só depois das 8h da manha ate 17h, entrar com a data...
routes.get("/providers/:providerId/available", AvailableController.index);

routes.get("/appointments", AppointmentController.index);
routes.post("/appointments", AppointmentController.store);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/schedule", ScheduleController.index);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

routes.post("/files", upload.single("file"), FileController.store);

export default routes;
