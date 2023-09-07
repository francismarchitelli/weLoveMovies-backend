const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function list() {
    return knex("reviews")
    .select("*");
}

function read(review_id) {
  return knex ("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*", "c.*")
    .where({"review_id": review_id})
    .first()
    .then(addCritic);
}


function destroy(review_id) {
  return knex("reviews").where({review_id}).del();
}

function update(review) {
  return knex("reviews")
  .select("*")
  .where({review_id: review.review_id})
  .update(review, "*")
  .then((updatedRecords) => updatedRecords[0]);
}



module.exports = {
  list,
  read,
  update,
  delete: destroy,
}