console.log("Server file started...");
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const mockTestRoutes = require("./routes/mockTestRoutes");

const app = express();

// ── Core Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB ──────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ── Routes ───────────────────────────────────────────────────
app.get('/', (req, res) => res.send('CareerTrack API running'));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use("/api/mocktests", mockTestRoutes);

// ── Global Error Handler (must be last) ──────────────────────
app.use(errorMiddleware);

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));