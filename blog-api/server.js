const express = require("express");
const app = express();
const port = 4000
const session = require("express-session");
require("dotenv").config();
const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use((req, res, next)=>{
    res.on("finish", ()=>{
        console.log(`${req.method} ${req.originalUrl} ${req.statusCode}`);
    });
    next();
});

app.use(express.json());

// session building
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000
        },
    })
);

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");


app.get('/', (req, res)=>{
    res.send("hello");
});


// routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/comment', commentRouter);

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
})