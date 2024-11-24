import express from "express";
import routes from "./src/routes/postsRoutes.js";

// Array de posts de exemplo, utilizado caso a conexão com o banco falhe ou para testes.
const posts = [
  // ... (dados dos posts)
];

// Inicializa o aplicativo Express.
const app = express();
app.use(express.static("uploads"));
routes(app);

// Inicia o servidor na porta 3000 e exibe uma mensagem no console.
app.listen(3000, () => {
  console.log("Servidor escutando...");
});
//vamo ve
