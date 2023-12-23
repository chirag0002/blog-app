const zod = require('zod')

// validator function for user registration credentials
const validator = (email, password) =>{

    // define a Zod schema for user registration data
    const userSchema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(6)
    });
    
    // validate the provided email and password using the Zod schema
    const response = userSchema.safeParse({email, password});
    
    // return whether the validation was successful
    return response.success;
}

// validator function for blog creation data
const blogVaidator = (title, description, imageLink) => {

    // Define a Zod schema for blog creation data
    const blogSchema = zod.object({
        title: zod.string().min(1).max(100),
        description: zod.string().min(1).max(1000),
        imageLink: zod.string().url(),
    });

    // validate the provided title, description, and imageUrl using the Zod schema
    const response = blogSchema.safeParse({title, description, imageLink});
    
     // return whether the validation was successful
    return response.success;
}

module.exports = {
    validator,
    blogVaidator
};