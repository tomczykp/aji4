import {Router} from "express";
import OrderController from "../controllers/order.controller";
import {checkJwt} from "../middlewares/jwt.checkers";

const router : Router  = Router();
router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getOne);
router.put("/", [checkJwt],OrderController.makeOrder);
router.put("/:id", [checkJwt],OrderController.addSubOrder);
router.post("/:id/inc", OrderController.incStatus);
router.post("/:id/dec", OrderController.decStatus);
router.delete("/:id", [checkJwt],OrderController.deleteOrder);

export default router;