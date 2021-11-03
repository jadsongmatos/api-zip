import fs from "fs";
import path from "path";
import unzipper from "unzipper";

export const config = {
  api: {
    bodyParser: false,
    //externalResolver: true,
  },
};

export default async function handle(req, res) {
  if (req.query.blob) {
    console.log(req.query.blob);
    //const blob = Buffer.from(req.query.blob , 'base64');

    await fs.writeFileSync("/tmp/tmp.zip", req.query.blob,'base64');

    const zip = fs
      .createReadStream("/tmp/tmp.zip")
      .pipe(unzipper.Parse({ forceStream: true }));

    for await (const entry of zip) {
      console.log(entry);
    }
    //const directory = await unzipper.Open.buffer(unescape(req.query.blob));
    //console.log("directory", directory);

    res.json({});
    //console.log(req.query.blob);
    //const zip = decodeURIComponent(req.query.blob)
    //console.log(zip);
  }
}
