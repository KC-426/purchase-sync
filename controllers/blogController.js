import blogModel from "../models/blogModel.js";
import { uploadBlogImageToFirebaseStorage } from "../utils/helperFuntions.js";

export const addBlog = async (req, res) => {
  try {
    const { blogBy, blogCategory, description } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "Blog image is required." });
    }

    const imageDetails = await uploadBlogImageToFirebaseStorage(req, res);

    const blog = new blogModel({
      blogBy,
      blogCategory,
      description,
      image: imageDetails,
    });

    const result = await blog.save();
    res.status(201).json({ message: "Blog added successfully!", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
export const fetchBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blog found !" });
    }
    res.status(200).json({ message: "Blogs fetched successfully!", blogs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
