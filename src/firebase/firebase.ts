import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from 'dotenv';
dotenv.config()

initializeApp({
  credential: applicationDefault(),
});

export const verifyFirebaseToken = async ({ idToken }: { idToken: string }) => {
  try {
    // uid
    const uid = (await getAuth().verifyIdToken(idToken)).uid;

    // user data
    return await getAuth().getUser(uid);
  } catch (error) {
    // TODO: handle error 
    throw error;
  }
};
