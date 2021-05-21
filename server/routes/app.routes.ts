import { Router } from "express";

//Routes
import { usersRoutes } from "./users.routes";
import { questionsRoutes } from "./questions.routes";

class AppRoutes {
  public routes: Router;
  constructor() {
    this.routes = Router();
    this._init();
  }

  private _init() {
    this.routes.use("/users", usersRoutes);
    this.routes.use("/questions", questionsRoutes);
    this.routes.get("/", (req, res) => {
      res.send({
        message: "This API for Football App ^^",
      });
    });
  }
}

export const appRoutes = new AppRoutes().routes;
