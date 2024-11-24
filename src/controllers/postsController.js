import {
  getTodosPosts,
  criarPost,
  atualizarPost,
} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
  // Obtém todos os posts do banco de dados utilizando a função getTodosPosts()
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON com status 200 (sucesso)
  res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
  // Extrai os dados do novo post do corpo da requisição
  const novoPost = req.body;
  try {
    // Chama a função criarPost() para inserir o novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta com status 500 (erro interno do servidor)
    console.error(erro.message);
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome da imagem
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: "",
  };
  try {
    // Cria o novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Constrói o novo nome da imagem com o ID do post
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Renomeia o arquivo da imagem para o novo nome
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta com status 500 (erro interno do servidor)
    console.error(erro.message);
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;

  try {
    const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imageBuffer);

    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt,
    };

    const postCriado = await atualizarPost(id, post);
    res.status(200).json(postCriado);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}
