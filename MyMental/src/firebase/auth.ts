import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import app from "./config";

export const auth = getAuth(app);


export function signup(
  email: string,
  password: string
) {
  return createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}


export function login(
  email: string,
  password: string
) {
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}