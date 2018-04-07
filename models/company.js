const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// This is what Michael meant, yes?
// const Job = mongoose.model('Job');
// Do I need to import User as well?  B/c of the refs?

const companySchema = new mongoose.Schema({
    name: { type: String, minlength: 1, maxlength: 55, required: true },
    password: { type: String, minlength: 1, maxlength: 55, required: true },
    email: { type: String, minlength: 1, maxlength: 55, required: true },
    handle: { type: String, minlength: 1, maxlength: 55, required: true },
    logo: String,
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});

// pre-hook to hash password before saving
companySchema.pre('save', function (next) {
    const company = this;
    if (!company.isModified('password')) return next();
    return bcrypt
        .hash(company.password, 10)
        .then(hashedPassword => {
            company.password = hashedPassword;
            return next();
        })
        .catch(err => next(err));
});

// pre-hook to hash password before updating
companySchema.pre('findOneAndUpdate', function (next) {
    // 'this' refers to the query object for a query
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
companySchema.methods.comparePassword = function (candidatePassword, next) {
    return bcrypt
        .compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return next(err);
            return next(null, isMatch);
        })
}

const Company = mongoose.model('Company', companySchema);

module.exports = Company;