import { format, parseISO } from "date-fns";
import pt from "date-fns/locale/pt";
import Mail from "../../lib/Mail";

class CancellationMail {
  //para cada background job precisamos de chave unica
  get key() {
    return "CancellationMail";
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log("A fila executou --------- ");
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
        date: format(
          parseISO(appointment.date),
          "'dia'dd 'de' MMMM', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}
export default new CancellationMail();
//get permit utilizar import CancellationMail from "..."
//permite fazer CancellationMail.Key()
//é como se estivessemos declarando uma variavel
