import { Note } from "../models/note.schema";

const NoteRepository = {
  getAll: async () => {
    try {
      const allNotes = await Note.find();
      return allNotes;
    } catch (error) {
      console.log(error);
      console.log("Book Repository Error");
    }
  },
};

export default NoteRepository;
