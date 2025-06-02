import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler( async (req, res) => {
    const { tweet } = req.body;
    const user = req.user?._id;

    if(!tweet){
        throw new ApiError(400, "Tweet content is required.")
    }
    const newTweet = await Tweet.create({
        content: tweet,
        owner: user
    })
    if(!newTweet){
        throw new ApiError(500, "Failed to create tweet.")
    }
    return res.status(200).json(new ApiResponse(201, newTweet, "Tweet created successfully."))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if(!username?.trim()){
        throw new ApiError(400, "username not found")
    }
    const getTweets = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            },
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "userTweets"
            },
        },  
        {
            $addFields: {
                tweets: "$userTweets"
            },
        },
        {
            $project: {
                username: 1,
                tweets: 1
            }
        }
    ])
    
    return res.status(200).json(new ApiResponse(200, getTweets[0], "All tweets fetched successfully."))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { editedTweet } = req.body;
    if(!editedTweet){
        throw new ApiError(400, "Tweet is not edited")
    }
    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: editedTweet
            }
        },
        {new: true}
    )

    if(!updateTweet){
        throw new ApiError(400, "Tweet is not updated")
    }

    return res.status(200).json(new ApiResponse(200, updateTweet, "tweet is updated sucessfully"))
})


const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if(!tweetId){
        throw new ApiError(400, "tweetId not found")
    }
    const deleteTweet = await Tweet.findByIdAndDelete(tweetId);
    if(!deleteTweet){
        throw new ApiError(400, "Tweet is not deleted")
    }

    return res.status(200).json(new ApiResponse(200, deleteTweet, "tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}