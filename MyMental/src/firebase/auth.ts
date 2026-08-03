
import {
  // @ts-ignore — getReactNativePersistence exists at runtime via Firebase's
  // React Native entry point, but isn't in the published TS types for
  // "firebase/auth". Known issue: firebase/firebase-js-sdk#9316
  getReactNativePersistence,
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
 
import app from "./config";
 
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
 
export function signup(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}
 
export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}
 