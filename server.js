const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS setup
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.ALLOWED_ORIGIN] // production frontend
  : ["http://localhost:5173", process.env.ALLOWED_ORIGIN]; // dev + prod

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ Task routes
app.use('/api/tasks', taskRoutes);

// ✅ Root route returns JSON
app.get('/', (req, res) => {
  res.json({ message: "Task API Server is running" });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
