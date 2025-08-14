import { body } from "express-validator";
const userRegisterValidator = () =>{
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({ min: 3, max: 20 }),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8, max: 20 })
            .withMessage("Password must be between 8 to 20 characters long"),
      body("fullName")
        .optional()
        .trim()
     
    ]
}



export {
    userRegisterValidator
};