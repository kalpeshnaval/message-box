import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
    require: true,
    maxLength: 100
    },

    content: {
        type: String,
        require: true,
        maxLength: 2000
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt : {
        type: Date,
        default: Date.now
    }
    
})

NoteSchema.pre("save", function () {
  this.updatedAt = Date.now(); // Update the timestamp to right now
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);