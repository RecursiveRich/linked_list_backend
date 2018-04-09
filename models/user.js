const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, minlength: 1, maxlength: 55, required: true },
    lastName: { type: String, minlength: 1, maxlength: 55, required: true },
    username: { type: String, minlength: 1, maxlength: 55, required: true },
    email: { type: String, minlength: 1, maxlength: 55, required: true },
    password: { type: String, minlength: 1, maxlength: 55, required: true },
    currentCompanyName: { type: String, minlength: 1, maxlength: 55 },
    // If it exists
    currentCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    photo: String,
    experience: [{
        jobTitle: String,
        companyName: { type: String, minlength: 1, maxlength: 55 },
        // If it exists
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        startDate: Date,
        endDate: Date
    }],
    education: [{
        institution: String,
        degree: String,
        endDate: Date
    }],
    applied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
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
            // REMOVE THIS!!!!!!!!!!!!!!!!!
            console.log('pre-hook invoked');
            console.log(next);
            return next();
        })
        .catch(err => next(err));
});

// pre-hook to hash password before updating
userSchema.pre('findOneAndUpdate', function (next) {
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

// Add username to company employees
// http://mongoosejs.com/docs/middleware.html#post-async
// "If your post hook function takes at least 2 parameters, mongoose will assume the second parameter is a next() function that you will call to trigger the next middleware in the sequence."
userSchema.post('save', function (user, next) {
    if (user.currentCompanyId) {
        // Can't require('Company') above, else stuck in circular loop
        mongoose.model('Company').findByIdAndUpdate(user.currentCompanyId, { $addToSet: { employees: user.username } })
    }
    return next();
})

// Update username if user changes company
userSchema.post('findOneAndUpdate', function (user, next) {
    // 'this' is the query Object
    // I'm finding user by id.  Daniel searched by username. Daniel: User.findOne({username: this._conditions.username})
    if (user.isModified('currentCompanyId')) {
        // Can't require('Company') above, else stuck in circular loop
        mongoose.model('Company').findByIdAndUpdate(user.currentCompanyId, { $pull: { employees: user.username } });
        let newCurrentCompanyId = this.getUpdate().currentCompanyId;
        mongoose.model('Company').findByIdAndUpdate(newCurrentCompanyId, { $addToSet: { employees: user.username } });
    }
    return next();
})


// Remove username to company employees
// USER DOES NOT EQUAL THIS IN A QUERY
// Does this work as a post-hook?  Won't the user already be deleted?
userSchema.post('findOneAndRemove', function (user, next) {
    if (user.currentCompanyId) {
        // Can't require('Company') above, else stuck in circular loop
        mongoose.model('Company').findByIdAndUpdate(user.currentCompanyId, { $pull: { employees: user.username } })
    }
    return next();
})

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