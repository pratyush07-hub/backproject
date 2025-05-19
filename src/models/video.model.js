import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,  // cloudinary url
        required: true,
    },
    thumbnail: {      // cloudinary url
        type: String,
        reuired: true,
    },
    title: {         // cloudinary url
        type: String,
        reuired: true,
    },
    description: {
        type: String,
        reuired: true,
    },
    duration: {     // cloudinary url
        type: Number,
        reuired: true,
    },
    views: {     // cloudinary url
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

},{timestamps: true})



videoSchema.plugin(mongooseAggregatePaginate)

// module.exports = mongoose.model("video", VideoSchema)
export const Video =  mongoose.model("video", videoSchema);