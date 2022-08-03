/** @format */

import express from "express"
import createHttpError from "http-errors"
import BlogPostsModel from "./model.js"
import ReviewsModal from "./reviewsModal.js"

const blogPostsRouter = express.Router()

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPosts = new BlogPostsModel(req.body) // here it happens the validation (thanks to Mongoose) of request body, if it is not ok Mongoose will throw an error (if it is ok it is NOT saved yet)
    const { _id } = await newBlogPosts.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find()
    res.send(blogPosts)
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:postId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostsModel.findById(req.params.postId)
    if (blogPost) {
      res.send(blogPost)
    } else {
      next(
        createHttpError(
          404,
          `Blog Post with id ${req.params.postId} not found!`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:postId", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.findByIdAndUpdate(
      req.params.postId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly update record you should use the option new: true
      // By default validation is off here --> runValidators: true
    )
    // ************************************************* ALTERNATIVE METHOD *******************************************************

    // const user = await BlogPostsModel.findById(req.params.userId) // when you do a findById, findOne, etc,... you get back a MONGOOSE DOCUMENT which is NOT a normal object but an object with some superpowers (like the .save() method) that will be useful in the future

    // user.firstName = "Diego"

    // await user.save()

    // res.send(user)

    if (blogPosts) {
      res.send(blogPosts)
    } else {
      next(createHttpError(404, `User with id ${req.params.postId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deleteBlogPost = await BlogPostsModel.findByIdAndDelete(
      req.params.postId
    )
    if (deleteBlogPost) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with id ${req.params.postId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.post("/:postId/reviews", async (req, res, next) => {
  try {
    const blogIndex = await BlogPostsModel.findByIdAndUpdate(
      req.params.postId,
      req.body.reviews
    )
    const newReview = new ReviewsModal(req.body)
    console.log(blogIndex)
    console.log(newReview)
    if (blogIndex !== -1) {
      blogIndex.reviews.push(newReview)
    } else {
      return null
    }

    // if (blogPosts) {
    //   res.send(blogPosts)
    // } else {
    //   next(createHttpError(404, `User with id ${req.params.postId} not found!`))
    // }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter
