const express = require('express');
const bodyParser = require('body-parser');
const router = require("./routes/routes");


const app = express();
const PORT = process.env.PORT || 3000;

// global middleware for parsing request bodies
app.use(bodyParser.json());

// global middleware for handling routes
app.use("/", router)

// 404 Route - Page not found
app.all('*', (req, res) => {
    return res.status(404).send({ error: 'Page not found' });
})

// global middleware for handling exceptions
app.use((err, req, res, next) => {
    return res.status(500).send({ error: err.message });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
