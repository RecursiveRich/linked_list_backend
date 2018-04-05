const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser } = require('../handlers');
const router = express.Router();

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:username')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;