import express from "express";
import multer from "multer";
import cors from "cors";
import {
  listarPosts,
  postarNovoPost,
  uploadImagem,
  atualizarNovoPost,
} from "../controllers/postsController.js";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200,
};

// Configura o armazenamento para uploads de imagens usando Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Especifica o diretório onde as imagens serão armazenadas
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Utiliza o nome original do arquivo para as imagens
    cb(null, file.originalname);
  },
});

// Cria uma instância do Multer com o armazenamento configurado
const upload = multer({ dest: "./uploads", storage });

// Define as rotas para o aplicativo Express
const routes = (app) => {
  // Permite que o aplicativo processe dados JSON no corpo das requisições
  app.use(express.json());
  app.use(cors(corsOptions));

  // Rota GET para listar todos os posts (implementada no controlador listarPosts)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (implementada no controlador postarNovoPost)
  app.post("/posts", postarNovoPost);

  // Rota POST para fazer upload de uma imagem (utiliza o middleware upload.single e chama o controlador uploadImagem)
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost);
};

export default routes;
