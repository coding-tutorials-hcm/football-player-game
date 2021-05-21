import * as admin from "firebase-admin";
import * as Joi from "joi";
import { result, pick, inRange, clone, remove } from "lodash";
import { Question } from "../models/question.model";

export const validateQuestion = (body) => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    image_url: Joi.string(),
    type: Joi.number().required(),
    rank: Joi.number().required(),
    answer: Joi.object().required(),
  });

  const { error, value } = schema.validate(body);
  if (error && error.details) {
    return {
      error,
    };
  }
  return {
    value,
  };
};

export const isAlreadyQuestion = (body) => {};

export const getAllQuestionsByRank = async (db, collectionName, rank) => {
  const questionsRef = db.collection(collectionName);
  const snapshot: Array<Question> = await questionsRef
    .where("rank", "==", rank)
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    })
    .then((querySnapshot) => querySnapshot)
    .catch((err) => err);
  return snapshot;
};

export const getAllQuestionsByType = async (db, collectionName, type) => {
  const questionsRef = db.collection(collectionName);
  const snapshot: Array<Question> = await questionsRef
    .where("type", "==", type)
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    })
    .then((querySnapshot) => querySnapshot)
    .catch((err) => err);
  return snapshot;
};

export const getAllQuestionsByTypeAndRank = async (
  db,
  collectionName,
  type,
  rank
) => {
  const questionsRef = db.collection(collectionName);
  let snapshot = questionsRef.where("type", "==", type);
  snapshot = snapshot.where("rank", "==", rank);

  snapshot = snapshot
    .get()
    .then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    })
    .then((querySnapshot) => querySnapshot)
    .catch((err) => err);
  return snapshot;
};

export const getRandomQuestions = (
  questions: Array<Question>,
  count: number
) => {
  let cloneQuestions: Array<Question> = [...questions];
  let data: Array<Question> = [];
  if (cloneQuestions.length >= count) {
    while (data.length < count) {
      let random = Math.floor(Math.random() * questions.length);
      let pick = cloneQuestions[random];
      if (pick != null) {
        data.push(pick);
      }

      cloneQuestions[random] = null;
    }
  }

  return data;
};
