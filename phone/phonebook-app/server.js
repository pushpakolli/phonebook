const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PhoneBook = require('./model/phonebook');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8080;
const DB = 'mongodb://localhost:27017/phonebook';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected..');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`);
});

app.post('/add-phone', async (req, res) => {
    const phoneNumber = new PhoneBook(req.body);
    try {
        await phoneNumber.save();
        res.status(201).json({
            status: 'Success',
            data: { phoneNumber }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.get('/get-phone', async (req, res) => {
    try {
        const phoneNumbers = await PhoneBook.find({});
        res.status(200).json({
            status: 'Success',
            data: { phoneNumbers }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.patch('/update-phone/:id', async (req, res) => {
    try {
        const updatedPhone = await PhoneBook.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'Success',
            data: { updatedPhone }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});

app.delete('/delete-phone/:id', async (req, res) => {
    try {
        await PhoneBook.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'Success',
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
});
