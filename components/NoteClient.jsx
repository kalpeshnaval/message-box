"use client";
import { motion } from "motion/react";
import { useState } from "react";
import toast from "react-hot-toast";

const NoteClient = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState(null);

  async function handleSubmitForm(e) {
    e.preventDefault();
    try {
      if (!title.trim() || !content.trim()) return;
      setLoading(true);
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setTitle("");
        setContent("");
        setNotes([result.data, ...notes]);
        toast.success("Your message is added 😁");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("failed to create note");
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Your message is deleted 😢");
      }
    } catch (error) {
      console.error("Error deleting note");
    }
  }

  async function handleUpdate(id) {
    try {
      if (!editTitle.trim() || !editContent.trim()) return;

      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNotes(notes.map((note) => (note._id === id ? result.data : note)));
        setEditId(null);
        setEditTitle("");
        setEditContent("");
        toast.success("Your message updated ✨");
      }
    } catch (error) {
      console.error("failed to edit");
    }
  }

  function handleEdit(note) {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function handleCancleEdit() {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  }

  const inputcss =
    "border w-full border-gray-300 px-4 py-2 focus:outline-none focus:ring-blue-500 focus:ring-1 rounded-lg shadow-md mb-2 text-gray-600";

  return (
    <>
      <div className="min-h-screen p-6 flex items-center justify-center flex-col">
        <div className="mb-6">
          <h1 className="text-3xl text-gray-800 font-bold">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, x: -40 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: "easeIn" },
              }}
              whileHover={{ y: 2 }}
            >
              Message
            </motion.span>{" "}
            <motion.span
              className="text-blue-500 transition-colors inline-block"
              whileHover={{ y: -2 }}
            >
              Box
            </motion.span>
          </h1>
        </div>

        <div className="">
          <motion.div
            className="px-4 border w-sm md:w-lg border-gray-300 rounded-lg p-4 text-center shadow-lg"
            initial={{ opacity: 0, x: 40 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeIn" },
            }}
          >
            <form onSubmit={handleSubmitForm} className="mb-4">
              <motion.div className="text-xl text-gray-600 font-semibold mb-3 space-x-2">
                <motion.span
                  className="inline-block hover:text-blue-500"
                  whileHover={{ y: -3 }}
                >
                  Leave
                </motion.span>
                <motion.span
                  className="inline-block hover:text-green-500"
                  whileHover={{ y: 3 }}
                >
                  {" "}
                  your
                </motion.span>
                <motion.span
                  className="inline-block hover:text-orange-500"
                  whileHover={{ y: -3 }}
                >
                  {" "}
                  message
                </motion.span>
                <span>
                  {loading ? (
                    <span>😁</span>
                  ) : (
                    <motion.span
                      whileHover={{
                        opacity: 0,
                        transition: { ease: "circInOut" },
                      }}
                    >
                      👀👌
                    </motion.span>
                  )}
                </span>
              </motion.div>

              {/* title input */}
              {editId === null ? (
                <div>
                  <motion.input
                    className={inputcss}
                    placeholder="TITLE"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8 },
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />

                  {/*Text area content */}

                  <motion.textarea
                    className={inputcss}
                    placeholder="CONTENT..."
                    initial={{ opacity: 0, y: 40 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8 },
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                  />

                  {/* button submit */}

                  <motion.button
                    className="text-white bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-700 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8 },
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.9, y: 0 }}
                    type="submit"
                  >
                    {loading ? "Creating Notes..." : "Create Note"}
                  </motion.button>
                </div>
              ) : null}
            </form>

            {/* start with the mapping items getting from the database */}

            <div>
              {notes.map((note) => (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="border border-gray-300 p-4 mb-2 rounded-lg shadow-lg"
                  key={note._id}
                >
                  {editId === note._id ? (
                    <div>
                      <motion.input
                        className={inputcss}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.8 },
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                      />
                      <motion.textarea
                        initial={{ opacity: 0, y: 40 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.8 },
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={inputcss}
                        onChange={(e) => setEditContent(e.target.value)}
                        value={editContent}
                      />

                      <div className="space-x-2 text-start">
                        <motion.button
                          className="text-white bg-green-500 px-4 py-2 font-semibold hover:bg-green-700 rounded-lg shadow-lg"
                          initial={{ opacity: 0, y: 40 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.8 },
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.9, y: 0 }}
                          onClick={() => handleUpdate(note._id)}
                        >
                          save
                        </motion.button>
                        <motion.button
                          className="text-white bg-gray-500 px-4 py-2 font-semibold hover:bg-gray-700 rounded-lg shadow-lg"
                          initial={{ opacity: 0, y: 40 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.8 },
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.9, y: 0 }}
                          onClick={handleCancleEdit}
                        >
                          cancle
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* title data */}
                      <div className="flex justify-between items-center">
                        <div className="uppercase text-lg font-semibold text-gray-700">
                          {note.title}
                        </div>
                        <div className="space-x-2">
                          <motion.button
                            className="text-blue-500 hover:text-blue-700 uppercase"
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                            onClick={() => handleEdit(note)}
                          >
                            edit
                          </motion.button>
                          <motion.button
                            className="text-red-500 hover:text-red-700 uppercase"
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                            onClick={() => handleDelete(note._id)}
                          >
                            delete
                          </motion.button>
                        </div>
                      </div>
                      {/* content data */}

                      <div className="text-start text-gray-600 border-t border-gray-200">
                        <p className="mt-2">{note.content}</p>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NoteClient;
