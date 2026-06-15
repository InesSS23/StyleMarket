require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: "postgres",
});

async function criarBaseDeDados() {
  try {
    await client.connect();

    const dbName = process.env.DB_NAME || "stylemarket";
    const resultado = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (resultado.rows.length > 0) {
      console.log(`A base de dados ${dbName} já existe.`);
      return;
    }

    if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
      throw new Error("O nome da base de dados contém caracteres inválidos.");
    }

    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de dados ${dbName} criada com sucesso.`);
  } catch (error) {
    console.error("Erro ao criar a base de dados:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

criarBaseDeDados();
