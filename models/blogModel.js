import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blogBy: {
      type: String,
    },
    blogCategory: {
      type: String,
    },
    image: {
      name: {
        type: String,
      },
      path: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
