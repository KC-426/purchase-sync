import mongoose from "mongoose";

const eBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    ebook: {
      name: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return v.endsWith('.pdf');
          },
          message: props => `${props.value} is not a valid PDF file!`
        },
      },
      path: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ebook", eBookSchema);
