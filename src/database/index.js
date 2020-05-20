import Sequelize from "sequelize";
//importar os models para passar a conexao
import User from "../app/models/User";
import databaseConfig from "../config/database";
const models = [User];
class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
  }
}
export default new Database();
//chamar Database em app