import type { Request, Response } from "express";
import { Note } from "../models/note.schema";
import NoteServices from "../services/note.services";

const BookController = {
  handleGetAllNotes: async (req: Request, res: Response) => {
    const allNotes = await NoteServices.getAll();
    return res.json({ data: allNotes });
  },

  handleCreateNotes: async (req: Request, res: Response) => {
    const { title, content } = req.body;

    //*logic to insert note to database

    const createNote = new Note({
      title,
      content,
    });
    await createNote.save();

    return res.status(201).json({ message: "Create note success" });
  },

  handleUpdateNotes: async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const authKey = req.headers.authorization;
    const noteId = req.params.id;

    if (authKey !== "12345") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updateNote = await Note.findByIdAndUpdate(noteId, {
      title,
      content,
    });

    return res.json({ message: "Update Note Success" });
  },

  handleDeleteNotes: async (req: Request, res: Response) => {
    const noteId = req.params.id;

    //*logic untuk delete data
    const deleteNote = await Note.findByIdAndDelete(noteId);

    return res.json({ message: "Note deleted" });
  },
};

export default BookController;
