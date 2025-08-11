import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/async-handler.js";
// const healthCheck = (req, res) => {
//     try {
//         res.status(200).json(new ApiResponse(200, { status: "OK" }, "Server is running"));
//     } catch (error) {

//     }
// }

const healthCheck = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, { status: "OK" }, "Server is running"));
})


export { healthCheck };