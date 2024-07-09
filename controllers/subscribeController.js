import subscribeModel from "../models/subscribeModel.js";

export const addSubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const findSubscribedUser = await subscribeModel.findOne({ email });
    if (findSubscribedUser) {
      return res.status(400).json({ message: "You have already subscribed !" });
    }

    const newUser = await subscribeModel({email})

    const result = await newUser.save();
    return res
      .status(201)
      .json({ message: "You have subscribed successfully !", result});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};
