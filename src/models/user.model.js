import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// User schema definition
const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            localPath: ""
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false // Exclude password from queries by default
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    forgetPasswordToken: {
        type: String,
    },
    forgetPasswordExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}


userSchema.methods.generateAccessToken = function () {
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
        }
    )
}


userSchema.methods.generateRefereshToken = function () {
    jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }

    )
}

userSchema.methods.generateTemporaryToken = function (){
    const unhashedToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
                            .createHash("sha256")
                            .update(unhashedToken)
                            .digest("hex");

    const tokenExpiry = Date.now() + (20 * 60 * 1000); // 20 minutes from now

    return {
        unhashedToken,
        hashedToken,
        tokenExpiry 
    }
}

export const User = mongoose.model("User", userSchema);