import adminManageRolesModel from "../models/adminManageRolesModel.js";


export const addUserOnAdmin = async (req, res) => {
    try {
      const { name, companyName, email, phone, role, setPermission } = req.body;
  
      
      const user = await adminManageRolesModel.findOne({ email });
  
      if (user) {
        return res
          .status(400)
          .json({ message: "User already exist with this email, please enter another email !" });
      }

      const newUser = await adminManageRolesModel({
        name, companyName, email, phone, role, setPermission
      });  
  
      const result = await newUser.save();
      return res
        .status(201)
        .json({ message: "User added successfully !", result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error !" });
    }
  };

  
export const getUsersOnAdmin = async (req, res) => {
    try {
      const user = await adminManageRolesModel.find()
      if(!user) {
        return res.status(404).json({message: 'No user found !'})
      }
      
      return res
        .status(200)
        .json({ message: "Users fetched successfully !", user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error !" });
    }
  };
  
    
export const deleteUserOnAdmin = async (req, res) => {
    const { id } = req.params
    try {
      const user = await adminManageRolesModel.findById(id)
      if(!user) {
        return res.status(404).json({message: 'No user found !'})
      }
      await adminManageRolesModel.findByIdAndDelete(id)
      
      return res
        .status(200)
        .json({ message: "Users deleted successfully !" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error !" });
    }
  };
  