import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controller.js";
const router = Router();

// router.get("/health", healthCheck )  //  This is also a valid way to define the route
// but using route method is more consistent with RESTful practices
router.route("/healthcheck").get(healthCheck);
export default router;