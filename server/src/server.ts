import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import facultyRoutes from './routes/faculty.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Modular Routes
app.use('/api/auth', authRoutes);       // Handles: /register, /login, /logout, /refresh, /me
app.use('/api/student', studentRoutes); // Handles: /lessons, /lessons/:id, /progress, /progress/update
app.use('/api/faculty', facultyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});