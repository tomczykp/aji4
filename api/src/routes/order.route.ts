import {Router} from "express";
import OrderController from "../controllers/order.controller";
import {checkJwt, checkRole} from "../middlewares/jwt.checkers";

const router : Router  = Router();
router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getOne);
router.put("/", [checkJwt, checkRole(['user'])],OrderController.makeOrder);
router.put("/:id", [checkJwt, checkRole(['user'])],OrderController.addSubOrder);
router.post("/:id/inc", [checkJwt, checkRole(['admin'])], OrderController.incStatus);
router.post("/:id/dec", [checkJwt, checkRole(['admin'])], OrderController.decStatus);
router.delete("/:id", [checkJwt, checkRole(['admin'])],OrderController.deleteOrder);

export default router;