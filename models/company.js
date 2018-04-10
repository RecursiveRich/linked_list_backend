const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
companySchema.post('findOneAndRemove', function (company, next) {
    // Could use updateMany here instead of forEach
    company.jobs.forEach(jobId => {
        // Can't require('Job') above, else stuck in circular loop
        mongoose.model('Job').findByIdAndRemove(jobId, { $pull: { jobs: jobId } })
            .then(() => next())
            .catch(e => next(e));
    })
    mongoose.model('User').updateMany({ currentCompanyId: company._id }, { currentCompanyId: null })
        .then(() => next())
        .catch(e => next(e));
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