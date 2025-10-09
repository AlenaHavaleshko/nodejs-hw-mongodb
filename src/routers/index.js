import  express from "express";
import contactsRouter from  './contacts.js' ;
import authRouter from  './auth.js';
import { authenticate } from "../middlewares/authenticate.js";

export const router = express.Router();

router.use('/auth', authRouter); // Додаємо роутер для аутентифікації
router.use('/contacts', authenticate, contactsRouter); // Додаємо роутер для контактів

export default router;
