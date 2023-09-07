const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCategory = mapProperties({
  critic_id: "critics.critic_id",
  preferred_name: "critics.preferred_name",
  surname: "critics.surname",
  organization_name: "critics.organization_name",
})

function list() {
    return knex("movies").select("*")
}

function moviesShowing() {
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .distinct("m.movie_id")
    .where({"mt.is_showing": true}) //check to see if this is correct
}

function read(movie_id) {
  return knex("movies").select("*").where({movie_id}).first();
}

function theatersWithMovie(movie_id) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ movie_id: movie_id});  
}

function getCritic(criticId){
    return knex("critics")
    .select("*")
    .where({"critic_id":criticId})
}
function movieReviews(movie_id) {
return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id" )
    .select("r.*")
    .where({ "r.movie_id":movie_id })
}
/*
function movieReviews(movie_id) {
  return knex("movies as m")
  .join("reviews as r", "r.movie_id", "m.movie_id")
  .join("critics as c", "r.critic_id", "c.critic_id")
  .select("*")
  .where({"r.movie_id": movie_id})
  .first()
  .then((reviews) => {
    const reviewsCriticDetails = [];
    reviews.forEach((review) => {
        const addedCritic = addCategory(review);
        reviewsCriticDetails.push(addedCritic);
      });
      return reviewsCriticDetails;
    });
}
*/
module.exports = {
    list,
    moviesShowing,
    read,
    theatersWithMovie,
    movieReviews,
    getCritic,
}