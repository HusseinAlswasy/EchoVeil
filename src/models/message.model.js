import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10000,
        trim: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: {
        type: [String],
    },
}, {
    strict: true,
    strictQuery: true,
    timestamps: true,

})

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel
