const express = require('express');
const { getCompanies, createCompany, getCompany, updateCompany, deleteCompany, verifyToken, ensureCorrectCompany } = require('../handlers');
// Do I need to mergeParams?  Any drawback?
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(verifyToken, getCompanies)
    .post(createCompany);

router
    .route('/:handle')
    .get(verifyToken, getCompany)
    .patch(ensureCorrectCompany, updateCompany)
    .delete(ensureCorrectCompany, deleteCompany);

module.exports = router;