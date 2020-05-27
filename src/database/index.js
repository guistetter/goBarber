import Sequelize from "sequelize";
//importar os models para passar a conexao
import User from "../app/models/User";
import File from "../app/models/File";
import Appointment from "../app/models/Appointment";
import mongoose from "mongoose";

import databaseConfig from "../config/database";
const models = [User, File, Appointment];
class Database {
  constructor() {
    this.init();
    this.mongo();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models) //necessario para associar avatar com User
      );
  }
  mongo() {
    this.mongoConnection = mongoose.connect(
      //nao precisamos passar senha, gobarber novo é o nome da database
      "mongodb://localhost:27017/gobarbernovo",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
}
export default new Database();
//chamar Database em app
