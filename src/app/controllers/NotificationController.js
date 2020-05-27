import Notification from "../schemas/Notifications"; //banco - mongo
import User from "../models/User"; //banco - sql
class NotificationController {
  async index(req, res) {
    //req.userId checa se o usuario logado é prestador ervico
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: "onlye providers can load notifications" });
    }
    //re.userId recebe usuario logado, concatenar metodos chainning
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: "desc" })
      .limit(20);
    return res.json(notifications);
  }
}
export default new NotificationController();
