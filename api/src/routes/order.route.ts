import {Router} from "express";
import OrderController from "../controllers/order.controller";
import {checkJwt} from "../middlewares/jwt.checkers";

const router : Router  = Router();
router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getOne);
router.put("/", [checkJwt],OrderController.makeOrder);
router.put("/:id", [checkJwt],OrderController.addSubOrder);
router.post("/:id", OrderController.editOrder);
router.delete("/:id", [checkJwt],OrderController.deleteOrder);

export default router;