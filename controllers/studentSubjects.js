const StudentSubject = require("../models/StudentSubject");

const getAllStudentSubject = async (req, res) => {
  try {
    const studentSubjects = await StudentSubject.find({});
    res.status(200).json({ studentSubjects });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createStudentSubject = async (req, res) => {
  try {
    const studentSubject = await StudentSubject.create(req.body);
    res.status(201).json("");
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getStudentSubject = async (req, res) => {
  try {
    //const {id:studentID} = req.params
    const { id: ids } = req.params;

    const studentID = ids.split("&")[0];
    const subjectID = ids.split("&")[1];

    let studentSubject = "";
    if (studentID == "" && subjectID != "")
      studentSubject = await StudentSubject.find({ subject_id: subjectID });
    else if (studentID != "" && subjectID == "")
      studentSubject = await StudentSubject.find({ student_id: studentID });
    else
      studentSubject = await StudentSubject.find({
        student_id: studentID,
        subject_id: subjectID,
      });

    //const studentSubject = await StudentSubject.find({student_id: studentID})

    if (!studentSubject) {
      return res
        .status(404)
        .json({ msg: `No studentSubject with id: ${studentID}` });
    }

    res.status(200).json({ studentSubject });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateStudentSubject = async (req, res) => {
  try {
    //const {id:studentID} = req.params
    const { id: ids } = req.params;

    const studentID = ids.split("&")[0];
    const subjectID = ids.split("&")[1];

    let studentSubject = "";
    if (studentID == "" && subjectID != "")
      studentSubject = await StudentSubject.findOneAndUpdate(
        { subject_id: subjectID },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    else if (studentID != "" && subjectID == "")
      studentSubject = await StudentSubject.findOneAndUpdate(
        { student_id: studentID },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    else
      studentSubject = await StudentSubject.findOneAndUpdate(
        { student_id: studentID, subject_id: subjectID },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    /*const studentSubject = await StudentSubject.findOneAndUpdate({student_id:studentID}, req.body, {
            new: true, 
            runValidators: true
        })*/

    if (!studentSubject) {
      return res
        .status(404)
        .json({ msg: `No studentSubject with id: ${subjectID}` });
    }

    res.status(200).json("");
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const deleteStudentSubject = async (req, res) => {
  try {
    const { id: ids } = req.params;

    const studentID = ids.split("&")[0];
    const subjectID = ids.split("&")[1];

    let studentSubject = "";
    if (studentID == "" && subjectID != "")
      studentSubject = await StudentSubject.deleteMany({
        subject_id: subjectID,
      });
    else if (studentID != "" && subjectID == "")
      studentSubject = await StudentSubject.deleteMany({
        student_id: studentID,
      });
    else
      studentSubject = await StudentSubject.findOneAndDelete({
        student_id: studentID,
        subject_id: subjectID,
      });

    if (!studentSubject) {
      return res
        .status(404)
        .json({ msg: `No studentSubject with id: '${subjectID}'` });
    }

    res.status(200).json("");
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllStudentSubject,
  createStudentSubject,
  getStudentSubject,
  updateStudentSubject,
  deleteStudentSubject,
};
