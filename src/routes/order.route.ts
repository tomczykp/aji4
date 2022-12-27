import {Router} from "express";
import OrderController from "../controllers/order.controller";

const router : Router  = Router();
router.get("/", OrderController.listAll);
router.get("/:id", OrderController.getOneById);
router.put("/", OrderController.makeOrder);
router.put("/:id", OrderController.addSubOrder);
router.post("/:id", OrderController.editOrder);
router.delete("/:id", OrderController.deleteOrder);

export default router;