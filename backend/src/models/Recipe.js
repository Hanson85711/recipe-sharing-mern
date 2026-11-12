import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },

    ingredients: {
      type: [
        {
          type: String,
          required: true,
          trim: true
        }
      ],
      required: true,
      validate: {
        validator: (ingredients) =>
          ingredients.length > 0 &&
          ingredients.every((ingredient) => ingredient.length > 0),
        message: "A recipe must have at least one non-empty ingredient"
      }
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;