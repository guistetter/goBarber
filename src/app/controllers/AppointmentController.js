import * as Yup from "yup";
import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import pt from "date-fns/locale/pt";
import Appointment from "../models/Appointment";
import File from "../models/File";
import User from "../models/User";
import Notification from "../schemas/Notifications";

import Mail from "../../lib/Mail";
class AppointmentController {
  //listagem pro usuario, listagem pro prestador de serviço sera criado em outra rota e controller
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ["date"],
      attributes: ["id", "date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["id", "url", "path"],
            },
          ],
        },
      ],
    });
    return res.json(appointment);
  }
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
        .json({ error: "You can onlye create appointments with providers" });
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
    //Notificar prestador de servico, aqui entra o mongodb
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia'dd 'de' MMMM', às' H:mm'h' ",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });
    return res.json({ appointment });
  }
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"],
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      //verificar id do agendamento for diferente do id usuario logado, se for verdade nao pode...
      return res.status(401).json({
        error: "you don't have permission to cancel this appointment.",
      });
    }
    //remover 2 horas antes do agendamento
    const dateWithSub = subHours(appointment.date, 2);
    //verificar se agendamento esta a 2h de distancia de agora Date()
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: "You can only cancel appointments 2 hours in advance",
      });
    }
    appointment.canceled_at = new Date();
    await appointment.save();
    await Mail.sendMail({
      to: `${appointment.provider.name}
      <${appointment.provider.email}
      >`,
      subject: "Agendamento cancelado",
      //text: "Voce tem um novo cancelamento",
      template: "cancellation",
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia'dd 'de' MMMM', às' H:mm'h' ", {
          locale: pt,
        }),
      },
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
