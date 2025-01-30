import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import sequelize from './src/config/database.js';
import MovieGeneratorAPI from './src/api/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

const api = new MovieGeneratorAPI();

// Test database connection
try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
} catch (err) {
    console.error('Unable to connect to the database:', err);
}

// API endpoints
app.get('/api/random/movie', async (req, res) => {
    try {
        const movie = await api.getRandomMovie();
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/random/show', async (req, res) => {
    try {
        const show = await api.getRandomShow();
        res.json(show);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 