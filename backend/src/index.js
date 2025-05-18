import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes.js";
import { config } from "dotenv";
config();
const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Mô hình Node
const nodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  position: Object,
  data: Object,
});

const Node = mongoose.model("Node", nodeSchema);

// Mô hình Edge
const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
});

export const Edge = mongoose.model("Edge", edgeSchema);

// API Lưu node
app.post("/api/nodes", async (req, res) => {
  try {
    const { id, type, position, data } = req.body;
    const node = new Node({ id, type, position, data });
    await node.save();
    res.json(node);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Lấy tất cả node
app.get("/api/nodes", async (req, res) => {
  try {
    const nodes = await Node.find();
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edge Routes
app.post("/api/edges", async (req, res) => {
  try {
    const { id, source, target } = req.body;
    const edge = new Edge({ id, source, target });
    await edge.save();
    res.json(edge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/edges", async (req, res) => {
  try {
    const edges = await Edge.find();
    res.json(edges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// api email
app.use("/api", emailRoutes);
// 131231231231231231231
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Controllers
// Tạo mới Edge
// export const createEdge = async (req, res) => {
//   try {
//     const { id, source, target } = req.body;
//     const edge = new Edge({ id, source, target });
//     await edge.save();
//     res.json(edge);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Lấy tất cả Edge
// export const getEdges = async (req, res) => {};
