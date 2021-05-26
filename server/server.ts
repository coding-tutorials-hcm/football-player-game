import * as admin from "firebase-admin";
import * as firebase from "firebase";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

// Key firebase
import * as serviceAccount from "./serviceAccount.json";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

firebase.default.initializeApp({
  apiKey: "AIzaSyCQfYm6CcyofLIQ7GXukyG7txAhmttoiz0",
  authDomain: "football-player-game-880d7.firebaseapp.com",
  projectId: "football-player-game-880d7",
  storageBucket: "football-player-game-880d7.appspot.com",
  messagingSenderId: "791360157679",
  appId: "1:791360157679:web:9df1c7f91c15b06e06a81a",
  measurementId: "G-YPTZ3F2EZE",
});

// Config
import "./configs/config.ts";

// Routes
import { appRoutes } from "./routes/app.routes";

const PORT = process.env.PORT || 3000;

class ExpressApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this._init();
  }

  private _init() {
    this.app.use(cors());
    this.app.use(express.static(__dirname + "/public"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

const app = new ExpressApp().app;

app.use(appRoutes);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

export { app };
