import NoteRepository from "../repositories/note.repository";

const NoteServices = {
  getAll: async () => {
    try {
      const allNotes = await NoteRepository.getAll();
      return allNotes;
    } catch (error) {
      console.log("Note Services Error");
    }
  },
};
export default NoteServices;
