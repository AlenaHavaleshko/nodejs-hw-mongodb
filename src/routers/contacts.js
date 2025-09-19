import { Router } from  "express";
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  deleteContactController,
  patchContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router ();

// Роут для отримання контактів
router.get('/', ctrlWrapper(getContactsController));

// Роут для отримання контакту по id
router.get("/:id", ctrlWrapper(getContactByIdController));

// Створюємо контакт
router.post('/', ctrlWrapper(createContactController));

// Видаляємо контакт
router.delete('/:id', ctrlWrapper(deleteContactController))

// Оновлюємо контакт PATCH
router.patch('/:id', ctrlWrapper(patchContactController))

export default router;
