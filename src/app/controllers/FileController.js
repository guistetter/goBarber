import File from "../models/File";
class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });
    return res.json(file);
    //return res.json({ ok: true });
  }
}
export default new FileController();
