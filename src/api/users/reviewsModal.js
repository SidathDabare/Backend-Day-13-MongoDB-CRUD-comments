/** @format */

import mongoose from "mongoose"

const { Schema, model } = mongoose

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 5 },
  },
  {
    timestamps: true, // this option automatically handles createdAt and updatedAt fields
  }
)

export default model("Review", reviewSchema)
