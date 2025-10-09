import { Contact } from "../models/contact.js";
//import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export async function getContacts({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
 }) {

  const skip = page > 0 ? (page - 1) * perPage : 0;
  const limit = perPage;


 const [contacts, totalItems] = await Promise.all([
  Contact.find({ userId })
  .skip(skip)
  .limit(perPage)
  .sort({ [sortBy]: sortOrder })
  .exec(),
  Contact.countDocuments({ userId }),
 ]);

 const totalPages = Math.ceil(totalItems / perPage );

 return {
  data:  contacts,
  page,
  perPage,
  totalItems,
  totalPages,
  hasPreviousPage: page > 1,
  hasNextPage: totalPages > page,
 };
};

export async function getContactById(id, userId) {
 const contact = await Contact.findOne({_id: id, userId});
 return contact;
}

export async function createContact(payload) {
 return Contact.create(payload);
}

export async function deleteContact(id, userId) {
 const contact = await Contact.findOneAndDelete({_id: id, userId});
 return contact;
}

export async function updateContact(id, payload, userId, options = {}) {
 const updatedContact = await Contact.findOneAndUpdate(
  {
    _id: id, userId
  },
    payload,
    {
      new: true,
      ...options,
    },);

    if (!updatedContact) return null;

    return {
    contact: updatedContact,
    isNew: false,
  };
}
