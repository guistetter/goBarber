import * as Yup from "yup";
import { startOfHour, parseISO, isBefore } from "date-fns";
import Appointment from "../models/Appointment";
import User from "../models/User";

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }
    const { provider_id, date } = req.body;
    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: "You can onlye create appointments withe providers" });
    }
    //check for past date
    const hourStart = startOfHour(parseISO(date)); //transforma string em obj date "no insomnia date vem como string"
    if (isBefore(hourStart, new Date())) {
      //Compara data que deseja marcar horario, com a data atual, se for antes nao pode...
      return res.status(400).json({ error: "Past dates are not permitted" });
    }

    //check date availability horario livre...
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "Appointment date is not available" });
    }
    //fim check availability

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    return res.json({ appointment });
  }
}
export default new AppointmentController();
