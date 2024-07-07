"use server"

import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

export type TestJwtPayload =  {
  characterId: string;
  characterNickName: string;
} & jwt.JwtPayload;

export async function applySocketLogin(characterNickName: string) {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (typeof jwtSecretKey !== 'string') {
    throw new Error(`JWT_SECRET_KEY 가 없습니다.`);
  }

  const access_token = jwt.sign({
    characterId: v4(),
    characterNickName, 
  }, jwtSecretKey, {
    expiresIn: 60 * 60 * 9,
  });

  return {
    access_token,
  };
}

export async function isValidAccessToken(access_token: string) {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (typeof jwtSecretKey !== 'string') {
    throw new Error(`JWT_SECRET_KEY 가 없습니다..`);
  }

  try {
    jwt.verify(access_token, jwtSecretKey);
    return true;
  } catch(e) {
    return false;
  }
}

export async function getJwtPayload(access_token: string): Promise<TestJwtPayload> {
  const payload = jwt.decode(access_token);
  if (typeof payload === 'string' || payload === null) throw new Error(`jwt decode 결과가 올바르지 않습니다.`);
  return payload as TestJwtPayload;
}