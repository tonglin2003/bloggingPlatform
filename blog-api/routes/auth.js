const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Users } = require("../models");

// signup a new user
router.post('/signup', async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    try{
        const user = await Users.create({
            username: req.body.username,
            password: hashedPassword
        });
        
        // seting session with user's id
        req.session.userId = user.id;

        return res.status(201).json({
            message: "User Created!",
            user: {
                username: user.username,
            }
        });
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            return res.status(422).json({errors: err.errors.map((e)=> e.message)});
        }
        else if (err.name === "SequelizeUniqueConstraintError")
        {
            return res.status(422).json({errors: "this username is being used by another user"});
        }
        res.status(500).json({
            message: "Error occured while creating user",
            error: err
        });
    }
});

// login user
router.post('/login', async (req, res) =>{
    try{
        const user = await Users.findOne({where: {username: req.body.username}});

        if (user === null){
            return res.status(401).json({
                message: "Incorrect username"
            });
        }

        bcrypt.compare(req.body.password, user.password, (error, result) =>{
            if (result){
                // seting session with user's id
                req.session.userId = user.id;
                return res.status(200).json({
                    message: "Logged in successfully",
                    user:{
                        username: user.username
                    }
                });
            } else {
                res.status(401).json({ message: "incorrect password"});
            }
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({message: "An error occured during the login process"});
    }
});

router.delete("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.sendStatus(500);
      }
  
      res.clearCookie("connect.sid");
      return res.sendStatus(200);
    });
  });

  router.get("/current_user", async (req, res) => {
    if (req.session.userId) {
      const user = await Users.findByPk(req.session.userId);
      return res.status(200).json({
        user: {
          id: user.id,
          username: user.username
        }
      });
    } else {
      return res.status(401).json({user: null})
    }
  });


module.exports = router;