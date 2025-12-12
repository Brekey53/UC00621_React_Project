const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const cowsay = require("cowsay");


const figlet = require('figlet');

// Coloque o texto que você quer converter aqui
const meuTexto = "Olá Mundo"; 

figlet(meuTexto, function(err, data) {
    if (err) {
        console.log('Algo deu errado...');
        console.dir(err);
        return;
    }
    // O 'data' é o texto ASCII. Vamos imprimi-lo no console.
    console.log(data);
});

console.log(cowsay.say({
  text: "Chamo-me Ricardo!",
  e: "oO",
  T: "U"
}))

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const tasksRouter = require("./routes/tasks");
const loginRouter = require("./routes/login"); // Import the login route
const registerRouter = require("./routes/register");

app.use("/api/tasks", tasksRouter);
app.use("/api/login", loginRouter); // Use the login route
app.use("/api/register", registerRouter);

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
