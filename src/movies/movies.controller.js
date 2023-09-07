const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    const {is_showing} = req.query;
    if(is_showing === "true") {
        const data = await moviesService.moviesShowing();
        return res.json({data});
    } else {
    const data = await moviesService.list();
    res.json({data});
}}

async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if(movie) {
    res.locals.movie = movie;
    return next();
  }
  next({status: 404, message: `Movie cannot be found.`})
}

async function read(req, res) {
  const {movieId} = req.params;
  const data = await moviesService.read(movieId);
  res.json({data});
}

async function theatersWithMovie(req, res) {
  const {movieId} = req.params;
  const allTheaters = await moviesService.theatersWithMovie(movieId);
  const data = allTheaters.map((theater) => {
    return { ...theater}});
  res.json({data});
}

async function movieReviews(req, res) {
  const {movieId} = req.params;
  const reviews = await moviesService.movieReviews(movieId);
  const allReviews = [];
  for(const review of reviews) {
    const critic = await moviesService.getCritic(review.critic_id);
    review.critic = critic[0];
    allReviews.push(review);
  }
  res.status(200).json({data: allReviews})
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  theatersWithMovie,
  movieReviews,
};