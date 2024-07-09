import userRequestModel from "../models/userRequestModel.js";

export const createUserRequest = async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
  
      const newUserRequest = await userRequestModel({
        name, email, phone, message
      });
  
      const result = await newUserRequest.save();
      return res
        .status(201)
        .json({ message: "User request added successfully !", result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error !" });
    }
  };

  export const getUserRequest = async (req, res) => {
    try {
      const userRequest = await userRequestModel.find() 
      if(!userRequest) {
        return res.status(404).json({message: "No user request found !"})
      }

      return res
        .status(200)
        .json({ message: "User requests fetched successfully !", userRequest });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error !" });
    }
  };