import express from "express";
import NoteController from "../controllers/note.controller";

export const noteRouter = express.Router();

noteRouter.get("/", NoteController.handleGetAllNotes);

noteRouter.post("/", NoteController.handleCreateNotes);

noteRouter.patch("/:id", NoteController.handleUpdateNotes);

noteRouter.delete("/:id", NoteController.handleDeleteNotes);
