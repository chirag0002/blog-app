const express = require('express');
const bodyParser = require('body-parser');
const router = require("./routes/routes");
const rateLimit = require('express-rate-limit');


const app = express();
let requestCount = 0;
const PORT = process.env.PORT || 3000;

// global middleware for parsing request bodies
app.use(bodyParser.json());

// global middleware for logging request count
app.use(function(req, res, next) {
    requestCount++;
    next();
});

// rate limiter middleware
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { msg: 'Too many requests' },
});
  
// apply the rate limiter to all routes or a specific route
app.use(limiter);

// global middleware for handling routes
app.use("/", router)

// global middleware for handling requests count
app.get('/requestCount', function(req, res) {
    res.status(200).json({ requestCount });
  });

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
