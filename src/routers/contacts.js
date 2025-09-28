import { Router } from  "express";
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  deleteContactController,
  patchContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import {isValidId} from "../middlewares/isValidId.js";
import {validateBody} from "../middlewares/validateBody.js";
import {contactSchema, updateContactSchema} from "../validation/contacts.js";

const router = Router ();

// Роут для отримання контактів
router.get('/', ctrlWrapper(getContactsController));

// Роут для отримання контакту по id
router.get("/:id", isValidId, ctrlWrapper(getContactByIdController));

// Створюємо контакт
router.post('/', validateBody(contactSchema), ctrlWrapper(createContactController));

// Видаляємо контакт
router.delete('/:id', isValidId, ctrlWrapper(deleteContactController))

// Оновлюємо контакт PATCH
router.patch('/:id', isValidId,validateBody(updateContactSchema), ctrlWrapper(patchContactController))

export default router;
