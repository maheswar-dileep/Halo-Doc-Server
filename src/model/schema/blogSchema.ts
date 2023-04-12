import mongoose, { Schema } from 'mongoose'

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    comment: {
        type: {
            userName: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            profileURL: {
                type: String,
                required: true
            }
        },
        required: false
    }
})

const blogModel = mongoose.model('blog', blogSchema);
export default blogModel;