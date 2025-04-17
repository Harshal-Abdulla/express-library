// models/author.js
const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function() {
  return `${this.first_name} ${this.last_name}`;
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function() {
  let lifetime = '';
  if (this.date_of_birth) {
    lifetime = this.date_of_birth.getFullYear().toString();
  }
  lifetime += ' - ';
  if (this.date_of_death) {
    lifetime += this.date_of_death.getFullYear().toString();
  }
  return lifetime;
});

module.exports = mongoose.model('Author', AuthorSchema);