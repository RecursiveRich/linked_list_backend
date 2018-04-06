const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, minlength: 1, maxlength: 55, required: true },
    lastName: { type: String, minlength: 1, maxlength: 55, required: true },
    username: { type: String, minlength: 1, maxlength: 55, required: true },
    email: { type: String, minlength: 1, maxlength: 55, required: true },
    password: { type: String, minlength: 1, maxlength: 55, required: true },
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

// pre-hook to hash password before saving
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    return bcrypt
        .hash(user.password, 10)
        .then(hashedPassword => {
            user.password = hashedPassword;
            return next();
        })
        .catch(err => next(err));
});

// pre-hook to hash password before updating
userSchema.pre('findOneAndUpdate', function (next) {
    // 'this' refers to the query object for a query
    // Example: this.getUpdate() === { skills: [ 'orator' ],
    // '$set': { updatedAt: 2018 - 04 - 06T18: 35: 59.893Z },
    // '$setOnInsert': { createdAt: 2018 - 04 - 06T18: 35: 59.893Z }}
    const password = this.getUpdate().password;
    if (!password) return next();
    return bcrypt
        .hash(password, 10)
        .then(hashedPassword => {
            this.getUpdate().password = hashedPassword;
            return next();
        })
        .catch(err => next(err));
});

// comparePassword instance method
userSchema.methods.comparePassword = function (candidatePassword, next) {
    return bcrypt
        .compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return next(err);
            return next(null, isMatch);
        })
}

const User = mongoose.model('User', userSchema);

module.exports = User;