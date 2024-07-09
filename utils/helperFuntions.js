import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
  } from "firebase/storage";
  import app from "../config/firebaseConfig.js";
  import { v4 as uuidv4 } from 'uuid';
  
  const storage = getStorage(app);
  
  export const generateOTP = () => {
    let digits = "0123456789";
    let OTP = "";
    let len = digits.length;
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
  };
  
  export async function uploadImagesToFirebaseStorage(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send({ error: "Image files are required." });
      }
  
      const uploadPromises = req.files.map(async (file) => {
        const dateTime = giveCurrentDateTime();
        const uniqueFilename = `${uuidv4()}_${file.originalname}_${dateTime}`;
        const storageRef = ref(storage, `product-images/${uniqueFilename}`);
        const metadata = { contentType: file.mimetype };
  
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
          name: file.originalname,
          path: storageRef.fullPath,
          url: downloadURL,
        };
      });
  
      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles;
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while uploading the files.");
    }
  }
  
  export async function deleteImagesFromFirebaseStorage(images) {
    try {
      const deletePromises = images.map(async (image) => {
        if (image.path) {
          const storageRef = ref(storage, image.path);
          try {
            await deleteObject(storageRef);
          } catch (error) {
            if (error.code === 'storage/object-not-found') {
              console.warn(`Image not found, skipping deletion: ${image.path}`);
            } else {
              throw error;  
            }
          }
        } else {
          console.warn(`Skipping image deletion for missing path: ${image.name}`);
        }
      });
  
      await Promise.all(deletePromises);
      console.log("Images deleted from Firebase Storage");
    } catch (error) {
      console.error("Error deleting the images from Firebase Storage:", error);
      throw new Error("An error occurred while deleting the images.");
    }
  }
  
  const giveCurrentDateTime = () => {
    const today = new Date();
    const date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
  };
  
    










  // export async function deleteImageFromFirebaseStorage(imageUrl) {
  //     try {
  //       const storageRef = ref(storage, imageUrl);
    
  //       await deleteObject(storageRef);
    
  //       console.log("Image deleted from Firebase Storage");
  //     } catch (error) {
  //       console.error("Error deleting the image from Firebase Storage:", error);
  //       throw new Error("An error occurred while deleting the image.");
  //     }
  //   }
  