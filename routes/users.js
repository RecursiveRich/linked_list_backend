const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser, verifyToken, ensureCorrectUser } = require('../handlers');
const router = express.Router();

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:username')
    .get(verifyToken, getUser)
    .patch(ensureCorrectUser, updateUser)
    .delete(ensureCorrectUser, deleteUser);

module.exports = router;