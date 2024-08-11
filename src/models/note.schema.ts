import { model, Schema } from "mongoose";

//* Schema
const noteSchema = new Schema({
  title: String,
  content: String,
});

//* create collection
export const Note = model("Note", noteSchema);
