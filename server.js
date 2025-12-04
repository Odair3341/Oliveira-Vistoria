import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inspectionsHandler from './api/inspections.js';
import vehiclesHandler from './api/vehicles.js';
import usersHandler from './api/users.js';
import branchesHandler from './api/branches.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Helper to adapt Vercel handler to Express
const adapt = (handler) => async (req, res) => {
  // Vercel functions often use res.status(code).json(body)
  // Express supports this too.
  try {
      await handler(req, res);
  } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
  }
};

app.all('/api/inspections', adapt(inspectionsHandler));
app.all('/api/vehicles', adapt(vehiclesHandler));
app.all('/api/users', adapt(usersHandler));
app.all('/api/branches', adapt(branchesHandler));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
