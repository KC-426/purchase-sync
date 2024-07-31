import ebookModel from "../models/ebookModel.js";
import { uploadEbookToFirebaseStorage } from "../utils/helperFuntions.js";

export const addEbook = async (req, res) => {
    try {
      const { title, description } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ message: "Ebook PDF is required." });
      }
  
      const ebookDetails = await uploadEbookToFirebaseStorage(req, res);
  
      const ebook = new ebookModel({
        title,
        description,
        ebook: ebookDetails,
      });
  
      const result = await ebook.save();
      res.status(201).json({ message: "Ebook added successfully!", result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };







export const fetchEbooks = async (req, res) => {
  try {
    const ebooks = await ebookModel.find();
    if (!ebooks || ebooks.length === 0) {
      return res.status(404).json({ message: "No ebook found !" });
    }
    res.status(200).json({ message: "Ebooks fetched successfully!", ebooks });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
