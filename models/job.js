const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// This is what Michael meant, yes?
const Company = mongoose.model('Company');

const jobSchema = new mongoose.Schema({
    title: { type: String, minlength: 1, maxlength: 55, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    salary: { type: Number, required: true },
    equity: { type: Number, required: true },
}, { timestamps: true });

// Add job to company jobs
jobSchema.post('save', function (next) {
    const job = this;
    Company.findByIdAndUpdate(job.company, { $addToSet: { jobs: job._id } })
        .then(() => next())
        .catch(e => next(e))
})

// Remove job from company jobs
// JOB DOES NOT EQUAL THIS IN A QUERY
// Does this work as a post-hook?  Won't the user already be deleted?
jobSchema.post('findOneAndRemove', function (next) {
    const job = Job.findById(this._conditions._id);
    Company.findByIdAndUpdate(job.company, { $pull: { jobs: job._id } })
        .then(() => next())
        .catch(e => next(e))
})

// Went with middleware instead: ensureCorrectJob
// pre-hook to verify company owns jobId before updating
// jobSchema.pre('findByIdAndUpdate', function (next) {
//     // 'this' refers to the query object for a query
//     const token = req.headers.authorization.split(' ')[1];
//     jwt.verify(token, SECRET_KEY, (err, decoded) => {
//         if (err) return res.json(err);
//         Job.findById(req.params.jobId)
//             .then(job => {
//                 if (decoded.companyId === job.company) return next();
//                 return res.status(401).json({ message: "Not Authorized" });
//             })
//             .catch(err => next(err));
//     })
// });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;