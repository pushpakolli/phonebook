const mongoose = require('mongoose');

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const PhoneBook = mongoose.model('PhoneBook', phonebookSchema);

module.exports = PhoneBook;
