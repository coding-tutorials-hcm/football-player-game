import { Router } from "express";

// Controller
import * as userController from "../controllers/users.controller";
import * as firebaseController from "../controllers/login.controller";

class UsersRoutes {
  public routes: Router;

  constructor() {
    this.routes = Router();
    this._init();
  }

  _init() {
    this.routes.get("/", userController.getAllUsers);
    this.routes.get("/:userId", userController.getUser);
    this.routes.post("/", userController.createUser);
    this.routes.patch("/", userController.updateUser);
    this.routes.delete("/:userId", userController.deleteUser);
    this.routes.post("/login", firebaseController.login);
  }
}

export const usersRoutes = new UsersRoutes().routes;
