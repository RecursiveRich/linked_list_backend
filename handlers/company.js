const { Company } = require('../models');

function getCompanies(req, res, next) {
    return Company.find()
        .then(company => {
            let rsp = { data: company };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function createCompany(req, res, next) {
    return Company.create(req.body)
        .then(company => {
            let rsp = { data: user };
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

function updateUser(req, res, next) {
    return Company.findOneAndUpdate({ handle: req.params.username }, req.body, { new: true })
        .then(company => {
            let rsp = { data: company };
            return res.json(rsp);
        })
        .catch(err => res.json(err));
}

function deleteUser(req, res, next) {
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