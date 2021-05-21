// Firebase
import * as admin from "firebase-admin";
import * as firebaseHelper from "firebase-functions-helper/dist";
import { Question } from "../models/question.model";
import { TestExam } from "../models/test-exam.model";
import {
  getAllQuestionsByTypeAndRank,
  getRandomQuestions,
  validateQuestion,
} from "../utils/questions.util";

// Model
import { User } from "../models/user.model";

const db = admin.firestore();
const collectionName = "questions";

export const createQuestion = async (req, res) => {
  let body: Question = req.body;

  try {
    const { value, error } = validateQuestion(body);
    if (error) {
      return res.status(400).send({
        error: error,
        data: null,
        message: null,
      });
    }
    if (value) {
      return firebaseHelper.firestore
        .createNewDocument(db, collectionName, body)
        .then((doc) => {
          body._id = doc.id;

          firebaseHelper.firestore
            .updateDocument(db, collectionName, body._id, body)
            .then(() => {
              res.status(200).send({
                message: "Create question successfully",
                error: null,
                data: null,
              });
            })
            .catch((error) =>
              res.status(400).send({
                error: error,
                message: null,
                data: null,
              })
            );
        })
        .catch((error) => {
          return res.status(400).send({
            error: "Create question error" + error,
            data: null,
            message: null,
          });
        });
    }
  } catch (error) {
    return res.status(400).send({
      error: error + " ,Bad Error",
      data: null,
      message: null,
    });
  }
};

export const getQuestionByID = async (req, res) => {
  const _id: string = req.params.questionId;

  try {
    if (_id != undefined) {
      return await firebaseHelper.firestore
        .getDocument(db, collectionName, _id)
        .then((doc) =>
          res.status(200).send({
            message: "OK",
            data: doc,
            error: null,
          })
        )
        .catch((error) =>
          res.status(400).send({
            error: "Invalid question",
            data: null,
            message: null,
          })
        );
    }
  } catch (error) {
    return res.status(400).send({
      error: "Id not valid",
      message: null,
      data: null,
    });
  }
};

export const getAllquestion = async (req, res) => {
  let data = [];
  const questionsRef = db.collection(collectionName);
  try {
    await questionsRef
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          res.status(400).send({
            error: "No question for you",
            data: null,
            message: null,
          });
        } else {
          snapshot.forEach((doc) => data.push(doc.data()));
        }
      })
      .then(() => {
        res.status(200).send({
          message: "OK",
          data: data,
          error: null,
        });
      })
      .catch((err) => {
        res.status(400).send({
          error: "Error from snapshot",
          data: null,
          message: null,
        });
      });
  } catch (error) {}
};

export const updateQuestionById = async (req, res) => {
  const body: Question = req.body;
  const _id = req.params.questionId;

  try {
    const { value, error } = validateQuestion(body);
    if (error) {
      return res.status(400).send({
        error: "Invalid question",
        data: null,
        message: null,
      });
    }
    if (value) {
      return firebaseHelper.firestore
        .checkDocumentExists(db, collectionName, _id)
        .then((result) => {
          if (result.exists) {
            return firebaseHelper.firestore
              .updateDocument(db, collectionName, _id, body)
              .then((doc) =>
                res.status(200).send({
                  message: "Update successfully",
                  data: null,
                  error: null,
                })
              )
              .catch((err) =>
                res.status(400).send({
                  error: "Invalid question",
                  data: null,
                  message: null,
                })
              );
          }

          return res.status(400).send({
            error: "Invalid question",
            data: null,
            message: null,
          });
        });
    }
  } catch (error) {
    return res.status(400).send({
      error: error + " Bad Error",
      data: null,
      message: null,
    });
  }
};

export const deleteQuestionById = async (req, res) => {
  const _id = req.params.questionId;
  try {
    if (_id) {
      return firebaseHelper.firestore
        .checkDocumentExists(db, collectionName, _id)
        .then((result) => {
          if (result.exists) {
            return firebaseHelper.firestore
              .deleteDocument(db, collectionName, _id)
              .then(() =>
                res.status(200).send({
                  message: "Delete question successfully",
                  data: null,
                  error: null,
                })
              )
              .catch((err) =>
                res.status(400).send({
                  error: err,
                  data: null,
                  message: null,
                })
              );
          }

          return res.status(400).send({
            error: "Doesn't have question",
            data: null,
            message: null,
          });
        })
        .catch((err) =>
          res.status(400).send({
            error: err,
            data: null,
            message: null,
          })
        );
    } else {
      return res.status(400).send({
        error: "Id invalid",
        message: null,
        data: null,
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: error + " ,Bad Error",
      data: null,
      message: null,
    });
  }
};

export const getTestExamByTypeAndRankAndCount = async (req, res) => {
  const rank: number = req.query.rank;
  const type: number = req.query.type;
  const count: number = req.query.count;
  const questions: Array<Question> = await getAllQuestionsByTypeAndRank(
    db,
    "questions",
    type,
    rank
  )
    .then((data) => data)
    .catch((err) => null);
  try {
    if (questions) {
      let data = getRandomQuestions(questions, count);

      return await firebaseHelper.firestore
        .createNewDocument(db, "test-exam", {
          questions: data,
          rank: rank,
          type: type,
        } as TestExam)
        .then((doc) => {
          firebaseHelper.firestore
            .updateDocument(db, "test-exam", doc.id, {
              _id: doc.id,
            })
            .then()
            .catch((err) =>
              res.status(400).send({
                error: err,
                message: null,
                data: null,
              })
            );

          return res.status(200).send({
            message: "OK",
            data: {
              _id: doc.id,
              questions: data,
              type: type,
              rank: rank,
              count: count,
            } as TestExam,
            error: null,
          });
        })
        .catch((err) =>
          res.status(400).send({
            error: err,
            message: null,
            data: null,
          })
        );
    }

    return res.send({
      error: "No test exam for you :D",
      message: null,
      data: null,
    });
  } catch (error) {
    return res.status(400).send({
      error: error + " ,Bad Error",
      message: null,
      data: null,
    });
  }
};
