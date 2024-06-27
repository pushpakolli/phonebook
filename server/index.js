const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/idcards', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema and model
const idCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/, // 10 digit phone number validation
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
  },
  branch: {
    type: String,
    required: true,
  },
});

const IdCard = mongoose.model('IdCard', idCardSchema);

// Routes
app.post('/add-id', async (req, res) => {
  try {
    const { name, phone, email, branch } = req.body;
    const newIdCard = new IdCard({ name, phone, email, branch });
    await newIdCard.save();
    res.status(200).json({ message: 'Data added successfully', data: newIdCard });
  } catch (error) {
    res.status(400).json({ message: 'Error adding data', error });
  }
});

app.get('/get-id', async (req, res) => {
  try {
    const idCards = await IdCard.find();
    res.status(200).json({ data: { idCards } });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving data', error });
  }
});

app.patch('/update-id/:id', async (req, res) => {
  try {
    const { phone, email, branch } = req.body;
    const updatedIdCard = await IdCard.findByIdAndUpdate(
      req.params.id,
      { phone, email, branch },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: 'Data updated successfully', data: updatedIdCard });
  } catch (error) {
    res.status(400).json({ message: 'Error updating data', error });
  }
});

app.delete('/delete-id/:id', async (req, res) => {
  try {
    await IdCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting data', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
