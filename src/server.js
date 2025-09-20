import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import {errorHandler} from  './middlewares/errorHandler.js' ;
import { notFoundHandler } from  './middlewares/notFoundHandler.js' ;


const app = express();
const PORT = process.env.PORT || 3000;

//  cors
app.use(cors());

// //  pino-http для логування
app.use(pino());

// Мідлварка,щоб розпарсити обьект боді
app.use(express.json());

// Додаємо кореневий маршрут
app.get("/", (req, res) => {
  res.send("Welcome to Contacts API!");
});

app.use('/contacts', contactsRouter);  // Додаємо роутер до app як middleware

// Handle 404
app.use( notFoundHandler);
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
