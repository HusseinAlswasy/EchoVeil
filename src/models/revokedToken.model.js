
import mongoose from "mongoose";

const revokedTokenSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        trim: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expireAt: Date,
},
    {
        timestamps: true,
        strict: true,
        strictQuery :true
    }
)

revokedTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const revokedTokenModel = mongoose.models.revokeToken || mongoose.model("revokeToken", revokedTokenSchema);

export default revokedTokenModel;