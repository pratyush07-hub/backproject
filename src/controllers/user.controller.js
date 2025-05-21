import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend  --> req.body(from,direct json) 
    // validation
    // check if user already exists : usrname,email
    // check for images, check for avatar
    // upload them to cloudinary, check for avatar again
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const { fullname, email, username, password } = req.body
    console.log("email: ", email);

    // if(fullname === ""){
    //     throw new ApiError(400, "fullname is required");
    // }
    if(
        [fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    // User.findOne({email})
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }
// multer access deta hai files ka  (? --> optionally ho sakta hai access ho ya naa ho)
    const avatarLocalPath = req.files?.avatar[0]?.path;   // joh multer ne upload kiya hai uska joh bhi proper path hai woh mil jaayega
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uplaodOnCloudinary(avatarLocalPath);
    const coverImage = await uplaodOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

} )

export { registerUser }

// app.js me import karo user router ko phir user router me routnig karo uski ki kis route pe chalega woh then user controller me response bhejooo usi route pe