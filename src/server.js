import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import routes from './routers/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

//  cors
app.use(cors());
// pino-http для логування
app.use(pino());
// Мідлварка,щоб розпарсити обьект боді
app.use(express.json());
app.use(cookieParser()); //перед роутами

// Додаємо кореневий маршрут
app.get('/', (req, res) => {
  res.send("Welcome to Contacts API!");
});

app.use("/api", routes); // Використовуємо роутер для всіх маршрутів, що починаються з /api

// Handle 404
app.use(notFoundHandler);
app.use(errorHandler);

// Підключення до MongoDB
export async function setupServer() {
  try {
    await initMongoConnection(); // Підключення до MongoDB

    // Запуск сервера після налаштування маршрутів
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.log('Error:', error);
  }
}

export default app;
