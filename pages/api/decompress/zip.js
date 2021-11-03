import unzipper from "unzipper";

export default async function handle(req, res) {
  if (req.method == "GET") {
    if (req.query.blob) {
      console.log(req.query.blob);
      const blob = Buffer.from(req.query.blob, "base64");
      const zip = await unzipper.Open.buffer(blob);
      res.send(await zip.files[0].buffer());
    }
  } else if (req.method == "POST") {
    res.status(500).json({});
  }
}
