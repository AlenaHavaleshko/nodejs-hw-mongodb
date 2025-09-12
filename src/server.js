import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getContacts, getContactById } from './services/contacts.js';

const app = express();
const PORT = process.env.PORT || 3000;

//  cors
app.use(cors());

// //  pino-http для логування
app.use(pino());

// Роут для отримання контактів
app.get('/contacts', async (req, res) => {
  const contact = await getContacts();

  res.json({
    status: 200,
    message: 'Contacts get successfully!',
    data: contact, //додати реальні дані з БД
  });
});

// Роут для отримання контакту по id
app.get("/contacts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await getContactById(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });

  } catch (error) {
    console.error("Error while getting contact:", error);
    res.status(500).json({ message: "Server error" });
  }

  // const contact = await Contact.findById(id);

  // console.log(contact);

  //   res.json({
  //     status:200,
  //     message: "Contact get successfully",
  //     data: {
  //       id,
  //       name: `Contact ${id}`
  //     },
  //   });
});

// Обробник для неіснуючих маршрутів
app.use((req, res, next) => {
  res.status(404).json({ status: 404, message: "Not found" });
});

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
