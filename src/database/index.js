import Sequelize from "sequelize";
//importar os models para passar a conexao
import User from "../app/models/User";
import File from "../app/models/File";

import databaseConfig from "../config/database";
const models = [User, File];
class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models) //necessario para associar avatar com User
      );
  }
}
export default new Database();
//chamar Database em app
