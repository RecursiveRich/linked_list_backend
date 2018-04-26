const { Job } = require('../models');

function getJobs(req, res, next) {
    return Job.find()
        .then(jobs => {
            let rsp = { data: jobs };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function createJob(req, res, next) {
    // added .data
    return Job.create(req.body.data)
        .then(job => {
            let rsp = { data: job };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function getJob(req, res, next) {
    return Job.findById(req.params.jobId)
        .then(job => {
            let rsp = { data: job };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function updateJob(req, res, next) {
    // added .data
    return Job.findByIdAndUpdate(req.params.jobId, req.body.data, { new: true })
        .then(job => {
            let rsp = { data: job };
            return res.json(rsp);
        })
        .catch(err => res.json(err));
}

function deleteJob(req, res, next) {
    return Job.findByIdAndRemove(req.params.jobId)
        .then(job => {
            let rsp = {
                title: 'Success',
                message: "The delete operation was successful"
            };
            return res.json(rsp);
        })
}

module.exports = {
    getJobs,       // GET to /companies Auth
    createJob,     // POST to /companies
    getJob,        // GET to /companies/${handle} User Auth
    updateJob,     // PATCH to /companies/${handle} Job Auth + Correct Job
    deleteJob      // DELETE to /companies/${handle} Job Auth + Correct Job
};