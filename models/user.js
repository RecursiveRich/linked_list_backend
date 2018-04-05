const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, minlength: 1, maxlength: 55 },
    lastName: { type: String, minlength: 1, maxlength: 55 },
    username: { type: String, minlength: 1, maxlength: 55, required: true },
    email: { type: String, minlength: 1, maxlength: 55, required: true },
    // currentCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    photo: String,
    experience: [{
        jobTitle: String,
        // company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        startDate: Date,
        endDate: Date
    }],
    education: [{
        institution: String,
        degree: String,
        endDate: Date
    }],
    skills: [String]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;