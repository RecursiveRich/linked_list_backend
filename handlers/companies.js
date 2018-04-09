const { Company } = require('../models');

function getCompanies(req, res, next) {
    return Company.find()
        .then(companies => {
            let rsp = { data: companies };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function createCompany(req, res, next) {
    return Company.create(req.body)
        .then(company => {
            let rsp = { data: company };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function getCompany(req, res, next) {
    return Company.findOne({ handle: req.params.handle })
        .then(company => {
            let rsp = { data: company };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function updateCompany(req, res, next) {
    return Company.findOneAndUpdate({ handle: req.params.handle }, req.body, { new: true })
        .then(company => {
            let rsp = { data: company };
            return res.json(rsp);
        })
        .catch(err => res.json(err));
}

function deleteCompany(req, res, next) {
    return Company.findOneAndRemove({ handle: req.params.handle })
        .then(company => {
            let rsp = {
                title: 'Success',
                message: "The delete operation was successful"
            };
            return res.json(rsp);
        })
}

module.exports = {
    getCompanies,       // GET to /companies Auth
    createCompany,     // POST to /companies
    getCompany,        // GET to /companies/${handle} User Auth
    updateCompany,     // PATCH to /companies/${handle} Company Auth + Correct Company
    deleteCompany      // DELETE to /companies/${handle} Company Auth + Correct Company
};