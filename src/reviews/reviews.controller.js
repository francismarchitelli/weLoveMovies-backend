const reviewService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const data = await reviewService.list();
  res.json({data: data});
}

async function reviewExists(req, res, next) {
  const review = await reviewService.read(req.params.reviewId);
  if(review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.`});
}

async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await reviewService.update(updatedReview);
  res.json({data: await reviewService.read(updatedReview.review_id)});
}

async function destroy(req, res) {
  const {review} = res.locals;
  await reviewService.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}