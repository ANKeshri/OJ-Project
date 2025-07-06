const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
dotenv.config();


const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input = '' } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = generateFile(language, code);
        const output = await executeCpp(filePath, language, input);
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.listen(PORT, () => {
  console.log(`Compiler server running on port ${PORT}`);
});
