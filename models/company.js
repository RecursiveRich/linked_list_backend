const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// This is what Michael meant, yes?
// Do I need to import User as well?  B/c of the refs?
const Job = mongoose.model('Job');

const companySchema = new mongoose.Schema({
    name: { type: String, minlength: 1, maxlength: 55, required: true },
    password: { type: String, minlength: 1, maxlength: 55, required: true },
    email: { type: String, minlength: 1, maxlength: 55, required: true },
    handle: { type: String, minlength: 1, maxlength: 55, required: true },
    logo: String,
    // employees is an array of usernames
    employees: [String],
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
// 'this' refers to the query object for a query
companySchema.pre('findOneAndUpdate', function (next) {
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

// Delete all the jobs when a company is deleted
// 'this' refers to the query object for a query
companySchema.post('findOneAndRemove', function (next) {
    const company = Company.findById(this._conditions._id);
    company.jobs.forEach(jobId => {
        Job.findByIdAndRemove(jobId, { $pull: { jobs: jobId } })
            .then(() => next())
            .catch(e => next(e));
    })
    return next();
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