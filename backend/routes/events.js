import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getEvents)           // Public: all users
  .post(protect, createEvent); // Protected: admin only

router.route("/:id")
  .get(getEvent)              // Public
  .put(protect, updateEvent)  // Protected
  .delete(protect, deleteEvent); // Protected

export default router;
