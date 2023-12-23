const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// connect to MongoDB
mongoose.connect(process.env.DB);

// define schemas
const UserSchema = new mongoose.Schema({
    email: String, 
    password: String,
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
});

const BlogSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String, 
    imageLink: String,
});

// create mongoose models based on the defined schemas
const User = mongoose.model('User', UserSchema);
const Blog = mongoose.model('Blog', BlogSchema);

module.exports = {
    User,
    Blog
}