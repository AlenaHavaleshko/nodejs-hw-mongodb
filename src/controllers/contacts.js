import { getContacts, getContactById, createContact, deleteContact, updateContact } from '../services/contacts.js';
import createHttpError from 'http-errors';

// GET
export const getContactsController = async (req, res, next) => {
 try {
  const contacts = await getContacts();

  res.json({
   status: 200,
   message: 'Contacts get successfully!',
   data: contacts,
  });
 } catch (error) {
  next(error);
 }
}

// GET id
export const getContactByIdController = async (req, res, next) => {

 const { id } = req.params;

 try {
  const contact = await getContactById(id);

  if (!contact) {
   throw createHttpError(404, 'Contact not found');
  }

  res.json({
   status: 200,
   message: `Successfully found contact with id ${id}!`,
   data: contact,
  });

 } catch (error) {
  next(error);
 }
}

// POST
export async function createContactController(req, res, next) {

 try {

 const contact = await createContact(req.body);

 res.status(201).json({
  status: 201,
  message: 'Contact created successfully!',
  data: contact,
 });
 } catch (error) {
  next(error);
 }
}

// DELETE
export async function deleteContactController(req, res, next) {
 const { id } = req.params;

 try {
  const result = await deleteContact(id);

  if (!result) {
   throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
 } catch (error) {
  next(error);
 }

}

// Update PATCH

export async function patchContactController(req, res, next) {
const { id } = req.params;
 try {
  const result = await updateContact(id, req.body,);
  console.log('result:', result);

  if (!result) {
   next(createHttpError(404, 'Contact not found'));
   return;
  }

 res.status(200).json({
  status: 200,
  message: "Successfully patched a contact!",
  data: result.contact,
 })

 }catch (error) {
  next(error);
 }
}
