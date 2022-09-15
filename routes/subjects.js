const express = require('express')
const router = express.Router()

const {getAllSubjects, createSubject, getSubject, updateSubject, deleteSubject} = require('../controllers/subjects')

router.route('/').get(getAllSubjects).post(createSubject)
router.route('/:id').get(getSubject).patch(updateSubject).delete(deleteSubject)

module.exports = router