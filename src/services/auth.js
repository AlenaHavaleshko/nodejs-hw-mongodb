import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { Session } from '../models/session.js';
import { access } from "fs";
import { th } from "@faker-js/faker";

// реєстрація користувача
export const registerUser = async (payload) => {
 const user = await User.findOne({ email: payload.email });

 if (user !== null) {
  throw createHttpError.Conflict("Email in use");
 }

 // хешування
 const encryptedPassword = await bcrypt.hash(payload.password, 10);
 console.log('Hash', encryptedPassword);

 return User.create({ ...payload, password: encryptedPassword });
};

// логін користувача
export const loginUser = async (payload) => {
 const user = await User.findOne({ email: payload.email });
 if (user === null) {
  throw createHttpError(401, 'User not found');
 }
 const isEqual = await bcrypt.compare(payload.password, user.password);
 if (!isEqual) {
  throw createHttpError(401, 'Unauthorized');
 };
 // Видаляємо всі існуючі сесії користувача перед створенням нової
 await Session.deleteOne({ userId: user._id });
 // Генеруємо токени
 const accessToken = randomBytes(30).toString('base64');

 const refreshToken = randomBytes(30).toString('base64');
 // Зберігаємо сесію в базі даних
 return await Session.create({
  userId: user._id,
  accessToken,
  refreshToken,
  accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
 });

};

// логаут користувача

export const logoutUser = async (sessionId) => {
 await Session.deleteOne({ _id: sessionId });
}

// рефреш токена

const createSession = () => {
 const accessToken = randomBytes(30).toString('base64');
 const refreshToken = randomBytes(30).toString('base64');

 return {
  accessToken,
  refreshToken,
  accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
 };
}

export const refreshUsersSession = async ({sessionId, refreshToken}) => {
 const session = await Session.findOne({
  _id: sessionId,
  refreshToken,
 });

 if(!session) {
  throw createHttpError(401, 'Session not found');
}

if(session.refreshToken !== refreshToken) {
 throw createHttpError(401, 'Invalid refresh token');
}

if(session.refreshTokenValidUntil < new Date()) {
 throw createHttpError(401, 'Refresh token expired');
}

const isSessionTokenExpired = new Date() > session.refreshTokenValidUntil;
 if(isSessionTokenExpired) {
  throw createHttpError(401, 'Refresh token expired');
}

const newSession = createSession();

await Session.deleteOne({ _id: sessionId, refreshToken });
return await Session.create({
 userId: session.userId,
 ...newSession,
});
};
