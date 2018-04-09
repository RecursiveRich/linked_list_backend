const express = require('express');
const { getJobs, createJob, getJob, updateJob, deleteJob, verifyToken, ensureCorrectJob, ensureIsCompany } = require('../handlers');
const router = express.Router();

router
    .route('/')
    .get(verifyToken, getJobs)
    .post(ensureIsCompany, createJob);

router
    .route('/:jobId')
    .get(verifyToken, getJob)
    .patch(ensureCorrectJob, updateJob)
    .delete(ensureCorrectJob, deleteJob);

module.exports = router;