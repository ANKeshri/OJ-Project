const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  constraints: { type: String, required: true },
  samples: [sampleSchema],
});

module.exports = mongoose.model('Problem', problemSchema); 