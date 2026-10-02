import multer from "multer";
import path from "path";
import fs from "fs";

const pastaUploads = path.resolve("uploads/produtos");

if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, { recursive: true });
}

const extensoesPermitidas = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
];

const tiposPermitidos = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, pastaUploads);
  },

  filename: (_req, file, callback) => {
    const extensao = path.extname(file.originalname).toLowerCase();

    const nomeSeguro = path
      .basename(file.originalname, extensao)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const nomeArquivo = `${Date.now()}-${nomeSeguro}${extensao}`;

    callback(null, nomeArquivo);
  },
});

export const uploadProduto = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    const extensao = path.extname(file.originalname).toLowerCase();

    if (
      extensoesPermitidas.includes(extensao) &&
      tiposPermitidos.includes(file.mimetype)
    ) {
      callback(null, true);
      return;
    }

    callback(
      new Error(
        "Formato de imagem não permitido. Use JPG, JPEG, PNG, WEBP ou GIF."
      )
    );
  },
});