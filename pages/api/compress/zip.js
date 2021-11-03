import fs from "fs";
import path from "path";
import multer from "multer";
import archiver from "archiver";

export const config = {
  api: {
    bodyParser: false,
    //externalResolver: true,
  },
};

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //console.log("here1", file);
    const dir = "./tmp/" + file.fieldname;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    //console.log("here2", file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("uploaded_file");

export default function handleUpload(req, res) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("MulterError", err);
      try {
        console.log(req.file);
        if (req.file.path) {
          await fs.unlinkSync(req.file.path);
          res.status(400).json({ err: err });
        }
      } catch (error) {
        res.status(400).json({ error: error, err: err });
      }
    } else if (err) {
      console.log("Erro", err);
      try {
        console.log(req.file);
        if (req.file.path) {
          await fs.unlinkSync(req.file.path);
          res.status(400).json({ err: err });
        }
      } catch (error) {
        res.status(400).json({ error: error, err: err });
      }
    } else {
      console.log("file", req.file);

      // create a file to stream archive data to.
      const output = fs.createWriteStream(req.file.path + ".zip");
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
      });

      output.on("close", async () => {
        /*  delete the uploaded files
        try {
          console.log("unlinkSync file", req.file.path);
          fs.unlinkSync(req.file.path);
        } catch (error) {
          console.log("unlinkSync ", error);
        }
        */

        try {
          const buffer = fs.createReadStream(req.file.path + ".zip");
          await new Promise(function (resolve) {
            res.setHeader("Content-Type", "application/zip");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename=${req.file.originalname}.zip`
            );
            buffer.pipe(res);
            buffer.on("end", resolve);
          });
        } catch (e) {
          res.status(400).json(e);
        }

        /* delete the compressed file
        try {
          console.log(
            "unlinkSync zip",
            req.file.path + ".zip",
            archive.pointer()
          );
          fs.unlinkSync(req.file.path + ".zip");
        } catch (error) {
          console.log("unlinkSync zip", error);
        }
        */
      });

      output.on("end", () => {
        console.log("Data has been drained");
      });

      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          // log warning
        } else {
          // throw error
          throw err;
        }
      });

      // good practice to catch this error explicitly
      archive.on("error", (err) => {
        throw err;
      });

      // pipe archive data to the file
      archive.pipe(output);

      // append a file from stream
      archive
        .append(fs.createReadStream(req.file.path), { name: req.file.filename })
        .finalize();
    }
  });
}
