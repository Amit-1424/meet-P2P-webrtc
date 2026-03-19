import { User } from "../models/user.model.js";
import httpStatus from "http-status"
import bcrypt , {hash} from "bcrypt"

import crypto from "crypto"

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "please provide data" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        // TEMP token (later replace with JWT)
            

        user.token = token;
        await user.save();

        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({ message: `something went wrong ${err}` });
    }
};



const register  = async (req,res) => {

    const {name,username,password} = req.body;
    
    try{
        //handle exixting user
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message : "user already exists"});
        }
        
        // hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password,10);

        //create new user
        const newUser = new User({
            name: name,
            username : username,
            password: hashedPassword,
        })
        await newUser.save();

        res.status(httpStatus.CREATED).json({message :"User Registerd"})

    } catch(err){
        res.json({message : `something went wrong ${err} `})
    }
    
}

export {login, register}