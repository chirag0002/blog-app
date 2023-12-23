const { Router } = require("express");
const authMiddleware = require("../middleware/auth");
const {userSchemaMiddleware, userMiddleware} = require("../middleware/user");
const { User, Blog } = require ("../db/db");
const {blogVaidator} = require("../utils/helper");
const bcrypt = require('bcrypt');


// create an Express router
const router = Router();


// user Signup Route
router.post('/signup', userSchemaMiddleware, async(req, res) => {
    const {email, password} = req.body;

    try{
        // hash the password before storing it in the database
        const pass = await bcrypt.hash(password, 10)
        const user = new User({
            email: email,
            password: pass,
            blogs: []
        });
 
        // save the new user to the database
        await user.save();
        res.status(200).send({msg: 'User created successfully'});
    } catch(err){
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    };
});

// user Signin Route
router.post('/signin', userMiddleware, async(req, res) => {
    const token = req.token;
    try{
        res.status(200).json({ message: 'User signed in successfully', token });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    };
});

// get all blogs Route
router.get('/blogs', async(req, res) => {
    try {
        // retrieve all blogs from the database
        const blogs = await Blog.find();
        res.status(200).send(blogs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// get user's blogs Route
router.get('/myBlogs', authMiddleware, async(req, res) => {
    const user = req.user;
    try {
        // retrieve blogs associated with the authenticated user
        const blogs = await Blog.find({ _id: { $in: user.blogs } });
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// get a specific blog by ID Route
router.get('/blogs/:id', async(req, res) => {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(404).json({message: "Id is invalid"});
    }
    if (id < 0 || id > 1000) {
        return res.status(404).json("Id not valid");
    }
    try {
        // retrieve a specific blog by ID from the database
        const blog = await Blog.findOne({ id:id });
        if(!blog) {
            return res.status(404).json({message: "Blog post not found"});
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error'});
    }
});

// create a new blog Route
router.post('/blogs', authMiddleware, async(req, res) => {
    const user = req.user;

    const {title, description, imageLink} = req.body;

    // validate blog creation data using the helper function
    const validation = blogVaidator(title, description, imageLink);
    if (!validation){
        return res.status(500).json({ message: 'Details are not valid' }); 
    }

    try{
        // create a new blog and save it to the database
        const blog = new Blog({ 
            id: Math.floor(Math.random() * 1000),
            title: title,
            description: description,
            imageLink: imageLink,
        })

        // save the new blog to the database
        await blog.save();

        // update the user's blogs array with the new blog ID
        user.blogs.push(blog._id);
        await user.save();
        res.status(200).json({ message: 'Blog created successfully', blogId: blog.id });
    } catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    };
});

// update an existing blog by ID Route
router.put('/blogs/:id', authMiddleware, async(req, res) => {
    const user = req.user;
    const id = Number(req.params.id);
    if (!id) {
        return res.status(404).json({message: "Id is invalid"});
    }
    if (id < 0 || id > 1000) {
        return res.status(404).json("Id not valid");
    }

    const {title, description, imageUrl} = req.body;

    try {
        // find and update the specified blog by ID
        const blog = await Blog.findOne({ id:id });

        if(!blog) {
            return res.status(404).json("Blog post not found");
        }

        // check if the authenticated user is the owner of the blog
        if (!user.blogs.includes(blog._id)) {
            return res.status(403).json("Unauthorized - You can only delete your own blog posts");
        }

        // update the blog properties with provided data or keep existing values
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.imageLink = imageUrl || blog.imageUrl;

        await blog.save();

        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// delete a blog by ID Route
router.delete('/blogs/:id', authMiddleware, async(req, res) => {
    const user = req.user;
    const id = Number(req.params.id);
    if (!id) {
        return res.status(404).json({message: "Id is invalid"});
    }
    if (id < 0 || id > 1000) {
        return res.status(404).json("Id not valid");
    }
    try {
        const blog = await Blog.findOne({ id:id });

        if(!blog) {
            return res.status(404).json("Blog post not found");
        }

        // check if the authenticated user is the owner of the blog
        if (!user.blogs.includes(blog._id)) {
            return res.status(403).json("Unauthorized - You can only delete your own blog posts");
        }

        // delete the specified blog from the database
        await Blog.findOneAndDelete({ id: id });

        res.status(200).json({message: 'Blog post deleted successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;