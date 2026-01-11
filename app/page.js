import NoteClient from "@/components/NoteClient";
import Note from "@/model/Note";
import dbConnect from "@/lib/db";

export const revalidate = 0;

async function getNotes() {
  await dbConnect();
  const notes = await Note.find({}).sort({ createdAt: -1 }).lean();
  return notes.map((note) => ({
    ...note,
    _id: note._id.toString(),
  }));
}

export default async function Home() {
  const notes = await getNotes();
  return (
    <div>
      <NoteClient initialNotes={notes} />
    </div>
  );
}
