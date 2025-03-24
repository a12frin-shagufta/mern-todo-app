import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { generateTokenAndSaveInCookies } from "../json/token.js";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const register = async (req, res) => {
  console.log("Incoming request body:", req.body);
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      const errorMessage = validation.error.issues.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    const confirmToken = await generateTokenAndSaveInCookies(newUser._id, res);
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: confirmToken
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const confirmToken = await generateTokenAndSaveInCookies(user._id, res);
    user.password = undefined;
    res.status(200).json({ 
      message: "Login successful", 
      user,
      token: confirmToken 
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("authToken", { path: "/" });
  res.status(200).json({ message: "Logout successful" });
};




//* for understanding 

// import User from "../model/user.model.js";
// import { z } from "zod";
// import bcrypt from "bcrypt";

// // const {email,username,password} = req.body - ye hota hai destructuring krna
//  // ham iss is trh bhi ikh sakte the 
// // const email = req.body.email - ase hi username or passeord

// //* mera user successfully registred ho gaya but isme validation nhi lagay isme agr koi @ bhul gaya ya password 4 se kam rha to bhi ye accept kr le rha
// //* or ye mujhe nhi chhaiye mujhe validation lagana hoga iske liy ek library hai zod
// // ham zod ko use kr rhe hai ham specific chiz ke liy bhi zod use kr skate hi suppose mujhe bs email validate krna hai to is trh karenge
// // const mySchema = z.string();
// //* mai pure objectec ko jo pura json form mai usse validate kran chahti hu
// const userSchema= z.object({
//    email:z.string().email({message:"Invalid email address"}),
//    username:z.string().min(3,{message:"Username must be at least 3 characters long"}),
//    password:z.string().min(6,{message:"password atleast 6 character"}),
// })

// export const register = async(req,res) => {
//    try{
//       const {email,username,password} = req.body;
//       // age user ye sab nhi deta to ham us dse error message denge
//       if(!email || !username || !password){
//          return res.status(400).json({message: "All field are required"})
//       }
//       // or agr user name email pass or usernam de diya
//       const validation = userSchema.safeParse({email,username,password})
//       if(!validation.success){
//          //*return res.status(400).json({error:validation.error.issues})
//          //mujhe error message to mil rha but uske sath kai or chizein mil rhi jo mujhe nhi chahiye isliy mai map use krungi jitne bhi maine validation lagaya hai bs wo mujhe mile
//            const errorMessage = validation.error.errors.map((err) =>err.message)
//            return res.status(400).json({errors:errorMessage})
//       }
     
//      const user = await User.findOne({email}) // ham check karenge kya user alerady hai uske email adress se
//      if(user){
//         return res.status(400).json({message: "User already existed"})
//      }
//      //ab mujhe krna hai user ke data ko save agr wo exist nhi krta 
//      // Save new user to the database
//      // hashing passowrd
//      const hashedPassword = await bcrypt.hash(password,10)
//      // ye 10 salt value hai ham moslty 10 hi likhte hai
//      const newUser = new User({email,username,password:hashedPassword})
//       await newUser.save()
//       if(newUser){
//          const confirmToken = await generateTokenAndSaveInCookies(newUser._id, res);
//         res.status(201).json({message:"User registerd sucessfully ",
//          user: newUser, 
//          token: confirmToken
//         })
//       }

//    }catch(error){
//      console.log(error)
//      res.status(500).json({message:"User not found"})
//    }
// }

// export const login = async (req,res) => {
//    const { email, password } = req.body;
  
//    try {
//      if (!email || !password) {
//        return res.status(400).json({ message: "Email and password are required" });
//      }
 
//      const user = await User.findOne({ email }).select("+password");
 
//      if (!user || !(await bcrypt.compare(password, user.password))) {
//        return res.status(400).json({ message: "Invalid credentials" });
//      }
 
//      const confirmToken = await generateTokenAndSaveInCookies(user._id, res);
 
//      res.status(200).json({ 
//        message: "Login successful", 
//        user,
//        token: confirmToken 
//      });
 
//    } catch (error) {
//      console.error("Error logging in user:", error);
//      res.status(500).json({ message: "Internal Server Error" });
//    }
// }



// export const logout = (req, res) => {
//    res.clearCookie("authToken", { path: "/" }); // Clear the auth cookie
//    res.status(200).json({ message: "Logout successful" });
//  };


// // agr mai apna data dekhu to mujhe email dikh rha password dikh rha or username mai  nhi chahti mera passord ase dikhe databse mai kyuki fir koi bhi aake ye dekh sakta hai
// /// iske liye mai bycrypt use krungi mai ye password hashing mai kaam aata hai