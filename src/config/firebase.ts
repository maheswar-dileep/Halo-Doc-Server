import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

initializeApp({
  credential: applicationDefault(),
});

const verifyFirebaseToken = async ({ idToken }: { idToken: string }) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // uid
    const { uid } = (await getAuth().verifyIdToken(idToken)).uid;

    // user data
    return await getAuth().getUser(uid);
  } catch (error) {
    throw error;
  }
};

export default verifyFirebaseToken;
