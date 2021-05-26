import * as admin from "firebase-admin";
import * as firebase from "firebase";
import * as firebaseHelper from "firebase-functions-helper/dist";

// Model
import { User } from "../models/user.model";

// Handlers
import {
  isEmailAlreadyExists,
  isUserAlreadyExists,
  validateUser,
} from "../utils/users.util";

const db = admin.firestore();
const collectionName = "users";

export const login = (req, res) => {
  const body = req.body;

  firebase.default
    .auth()
    .signInWithEmailAndPassword(body.email, body.password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(200).send({
        error: null,
        message: "OK",
        data: user,
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(400).send({
        error: errorCode,
        message: errorMessage,
        data: null,
      });
    });
};
