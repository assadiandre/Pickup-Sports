// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var eventSchema = new Schema({
  creator_name: String,
  event_name: String,
  pickup_type: String,
  event_date: String,
  start_time: String,
  end_time: String,
  max_attendance: String,
  location: String,
  description: String,
  subscribers: [String]
});

//attach schema to model
var Event = mongoose.model('PickupEvent', eventSchema);

// make this available to our users in our Node applications
module.exports = Event;
