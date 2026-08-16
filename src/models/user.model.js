import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 70,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
    },
    provider: {
        type: String,
        enum: ["system", "google"],
        default: "system"
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }
}, {
    strict: true,
    strictQuery: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual("fullName", {})
    .set(function (value) {
        const [firstName, lastName] = value.split(" ");
        this.set({ firstName, lastName });
    }).get(function () {
        return this.firstName + " " + this.lastName;
    })

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel
