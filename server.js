require("dotenv").config();

const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const cors = require("cors");
const path = require("path");

const app = express();

const upload = multer({
  storage: multer.memoryStorage()
});

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const form = new FormData();

    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    form.append("uploaded_by", req.body.uploaded_by || "Unknown");
    form.append("document_type", req.body.document_type || "receipt");
    form.append("transaction_type", req.body.transaction_type || "expense");
    form.append("category", req.body.category || "ทั่วไป");

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: form.getHeaders(),
      body: form
    });

    const data = await response.json();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const port = process.env.PORT || 3000;

app.get("/api/transactions", async (req, res) => {
  try {
    const response = await fetch(process.env.N8N_TRANSACTIONS_URL);
    const data = await response.json();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
