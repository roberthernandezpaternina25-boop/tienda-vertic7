const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

app.get("/productos", async (req, res) => {
    try {
        // En MySQL con promesas, el primer elemento del arreglo son tus filas
        const [rows] = await pool.query("SELECT * FROM productos");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos de la base de datos" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));