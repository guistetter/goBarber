//agenda para prestador de servico
//lembrar de alterar token no insomnia para um prestador de servico
import Appointment from "../models/Appointment";
import User from "../models/User";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Op } from "sequelize";
class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      return res.status(401).json({ error: "user is not a provider" });
    }
    //validação pegar os agendametnos entre a primeira hora do dia e a ultima
    // hora do dia 2019-06-22 00:00:00 até 2019-06-22 23:59:00
    const { date } = req.query;
    const parsedDate = parseISO(date);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ["date"],
    });
    return res.json(appointments);
  }
}
export default new ScheduleController();
