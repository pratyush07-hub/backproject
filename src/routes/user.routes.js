import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
// console.log("User router loaded");

router.route("/register").post(
    upload.fields([ 
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post( verifyJWT , logoutUser )
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-accountdetails").patch(verifyJWT, updateAccountDetails) // post me saara details update ho jaayega isiliye patch
router.route("/update-useravatar").patch(verifyJWT, upload.single("avatar") , updateUserAvatar)
router.route("/update-usercoverimage").patch(verifyJWT, upload.single("coverImage") ,updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watchhistory").get(verifyJWT, getWatchHistory)



export default router