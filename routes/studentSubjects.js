const express = require('express')
const router = express.Router()

const {getAllStudentSubject, createStudentSubject, getStudentSubject, updateStudentSubject, deleteStudentSubject} = require('../controllers/studentSubjects')

router.route('/').get(getAllStudentSubject).post(createStudentSubject)
router.route('/:id').get(getStudentSubject).patch(updateStudentSubject).delete(deleteStudentSubject)

module.exports = router