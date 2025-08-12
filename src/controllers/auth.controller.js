import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendMail } from "../utils/mail.js";
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // NOTE: If MongoDB connection isn't established before this query,
    // Mongoose will buffer the operation and eventually time out with:
    // "MongooseError: Operation `users.findOne()` buffering timed out".
    // Likely reasons: DB not connected on app startup (e.g., missing connectDB()),
    // invalid/unreachable process.env.MONGODB_URI, or network/firewall issues.
    // Ensure the app connects to MongoDB before handling requests.
    const existedUser = await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified: false,
    })

    const { unhashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    if (process.env.NODE_ENV === "production") {
        // Send email verification link
        await sendMail({
            email: user.email,
            subject: "Email Verification",
            mailgenContent: emailVerificationMailgenContent(
                user.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`)
        }
        );
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if (!createdUser) {
        throw new ApiError(500, "User creation failed!");
    }

    return res.status(201).json(new ApiResponse(201, { user: createdUser }, "User created successfully"));

})

export { registerUser };