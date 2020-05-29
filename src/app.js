import express from "express";
import path from "path";
import Youch from "youch";
import * as Sentry from "@sentry/node";
import "express-async-errors"; //Obrigatorio ver antes das rotas
import routes from "./routes";
import sentryConfig from "./config/sentry";
import "./database"; //conexao com o bd
import cors from "cors";
class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }
  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler()); //obrigatoriamente vem antes das rotas !
    this.server.use(cors());
    //this.server.use(cors({"www.meuapp.com.br"}))
    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }
  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler()); //obrigatoriamente vem depois das rotas!
  }
  //cadastrar novo middleware para tratamento de excecao
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();
      return res.status(500).json(errors);
    });
  }
}
export default new App().server;
