const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS setup: allow only local dev and deployed frontend
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://task-managers-6not.onrender.com"] // production frontend
  : ["http://localhost:5173", "https://task-managers-6not.onrender.com"]; // dev + prod

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

// ✅ Routes
app.use('/api/tasks', taskRoutes);

// ✅ Default root route (just info, not used by frontend)
app.get('/', (req, res) => {
  res.send('Task API Server is running...');
});

// ✅ 404 handler for other undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
