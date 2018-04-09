const express = require('express');
const { getCompanies, createCompany, getCompany, updateCompany, deleteCompany, verifyToken, ensureCorrectCompany } = require('../handlers');
const router = express.Router();

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