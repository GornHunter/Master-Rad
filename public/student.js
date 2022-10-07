const studentFormDOM = document.querySelector('.student-form')
const firstNameDOM = document.getElementById('firstName')
const lastNameDOM = document.getElementById('lastName')
const indexDOM = document.getElementById('index')
const studentFormAlertDOM = document.querySelector('.studentForm-alert')

const studentsDOM = document.querySelector('.students')

const studenth5 = document.getElementById('studentModalLabel')
const btnAddStudent = document.getElementById('btnAddStudent')

const studentSubjectFormDOM = document.querySelector('.studentSubject-form')
const studentSubjectPointsFormDOM = document.querySelector('.studentSubjectPoints-form')

let id = ''

document.querySelector('.load').addEventListener('click', async () => {
  try{
    const {data: {students}} = await axios.get('students.json')

    for(let i = 0;i < students.length;i++){
      await axios.post('/api/v1/students', { firstName: students[i].firstName, lastName: students[i].lastName, index: students[i].index})
    }

    showStudents()
  } catch(error){
    console.log(error)
  }
})

document.getElementById('aAddStudent').addEventListener('click', (e) => {
  studenth5.innerHTML = 'Dodavanje studenta'
  btnAddStudent.innerHTML = 'Dodaj studenta'
  document.getElementById('stu-form').className = 'student-form'
  firstNameDOM.value = ''
  lastNameDOM.value = ''
  indexDOM.value = ''
})

//dobavljanje svih studenata
const showStudents = async () => {
  try{
    const {data: {students}} = await axios.get('/api/v1/students')

    if(students.length < 1){
      studentsDOM.innerHTML = '<h5 class="empty-list">Lista studenata je prazna</h5>'
      return
    }

    const allStudents = students.map((student) => {
      const {_id: studentID, firstName, lastName, index} = student
      return `
      <div class="single-student">
        <h5 class="fullName" data-bs-toggle="modal" data-bs-target="#informationModal">
          ${firstName}&nbsp;${lastName}
        </h5>
        <h5 class="index-color" data-bs-toggle="modal" data-bs-target="#informationModal">
          ${index}
        </h5>
        <div class="student-links">

          <!-- edit link -->
          <a href="#" class="edit-link" title="Azuriraj studenta" data-bs-toggle="modal" data-bs-target="#studentModal" data-id="${studentID}">
            <i class="fas fa-edit"></i>
          </a>

          <!-- studentSubjectAdd link -->
          <a href="#" class="studentSubject-link" title="Dodeli predmete studentu" data-bs-toggle="modal" data-bs-target="#studentSubjectModal" data-id="${studentID}">
            <i class="fa-solid fa-file-circle-plus"></i>
          </a>

          <!-- studentSubjectPoints link -->
          <a href="#" class="studentSubjectPoints-link" title="Unesi poene" data-bs-toggle="modal" data-bs-target="#studentSubjectPointsModal" data-id="${studentID}">
            <i class="fa-solid fa-plus"></i>
          </a>

          <!-- studentSubjectDelete link -->
          <a href="#" class="studentSubjectDelete-link" title="Ukloni dodeljene predmete" data-bs-toggle="modal" data-bs-target="#studentSubjectModal" data-id="${studentID}">
            <i class="fa-solid fa-folder-minus"></i>
          </a>

          <!-- delete btn -->
          <button type="button" class="delete-btn" data-id="${studentID}" title="Ukloni studenta">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>`
    }).join('')
    studentsDOM.innerHTML = allStudents
  }catch(error){
    console.log(error)
    studentsDOM.innerHTML = '<h5 class="empty-list">Greska, probajte kasnije...</h5>'
  }
}

showStudents()

//dobavljanje odredjenog studenta/brisanje odredjenog studenta/dodavanje predmeta studentu/prikaz informacija o odredjenom studentu
studentsDOM.addEventListener('click', async (e) => {
  e.preventDefault()
  const element = e.target

  if (element.parentElement.classList.contains('edit-link')) {
    document.getElementById('stu-form').className = 'updateStudent-form'
    studenth5.innerHTML = 'Azuriranje studenta'
    btnAddStudent.innerHTML = 'Azuriraj studenta'

    try{
      const {data: {student}} = await axios.get(`/api/v1/students/${element.parentElement.dataset.id}`)
      const {_id: studentID, firstName, lastName, index} = student

      id = studentID
      firstNameDOM.value = firstName
      lastNameDOM.value = lastName
      indexDOM.value = index
    } catch(error){
      console.log(error)
    }
  }
  else if(element.parentElement.classList.contains('delete-btn')){
    id = element.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/studentSubjects/${id}&`)
      await axios.delete(`/api/v1/students/${id}`)
      showStudents()
    } catch (error) {
      console.log(error)
    }
  }
  else if(element.parentElement.classList.contains('studentSubject-link')){
    try {
      if(document.querySelector('.schoolYear-div') == null)
        addElement()
      
      document.getElementById('subj').innerHTML = ''
      document.getElementById('stuSub-form').className = 'studentSubject-form'
      document.getElementById('studentSubjectModalLabel').innerHTML = 'Dodeljivanje predmeta studentu'
      document.getElementById('btnStudentSubject').innerHTML = 'Dodeli predmete studentu'

      const {data: {student}} = await axios.get(`/api/v1/students/${element.parentElement.dataset.id}`)
      const {_id: studentID, firstName, lastName} = student
      document.getElementById('wholeName').innerHTML = `${firstName} ${lastName}`
      id = studentID

      const {data: {studentSubject}} = await axios.get(`/api/v1/studentSubjects/${id}&`)

      const {data: {subjects}} = await axios.get(`/api/v1/subjects`)
      let items = []
      items.push(`<option value="" selected></option>`)
      
      if(studentSubject.length != 0){
        for(let i = 0;i < studentSubject.length;i++){
          for(let j = 0;j < subjects.length;j++){
            if(subjects[j]._id !== '0'){
              if(subjects[j]._id === studentSubject[i].subject_id){
                subjects[j]._id = '0'
              }
            }
          }
        }
      }

      for(let i = 0;i < subjects.length;i++){
        if(subjects[i]._id !== '0')
          items.push(`<option value="${subjects[i]._id}">${subjects[i].name}</option>`)
        else
          items.push(`<option value="${subjects[i]._id}" disabled>${subjects[i].name}</option>`)
      }

      document.getElementById('subj').innerHTML = items
    } catch (error) {
      console.log(error)
    }
  }
  else if(element.parentElement.classList.contains('studentSubjectPoints-link')){
    document.getElementById('c').value = ''
    document.getElementById('p').value = ''

    const {data: {student}} = await axios.get(`/api/v1/students/${element.parentElement.dataset.id}`)
    const {_id: studentID, firstName, lastName} = student
    document.getElementById('wholeNamePoints').innerHTML = `${firstName} ${lastName}`
    id = studentID

    const {data: {studentSubject}} = await axios.get(`/api/v1/studentSubjects/${id}&`)
    let items = []
    items.push(`<option value="" onclick="showPoints()" selected></option>`)

    for(let i = 0;i < studentSubject.length;i++){
      const {data: {subject}} = await axios.get(`/api/v1/subjects/${studentSubject[i].subject_id}`)
      items.push(`<option value="${subject._id}" onclick="showPoints()">${subject.name}</option>`)
    }

    document.getElementById('subjPoints').innerHTML = items
  }
  else if(element.parentElement.classList.contains('studentSubjectDelete-link')){
    try{
      if(document.querySelector('.schoolYear-div') != null)
        studentSubjectFormDOM.removeChild(document.querySelector('.schoolYear-div'))
      
      document.getElementById('subj').innerHTML = ''
      document.getElementById('stuSub-form').className = 'studentSubjectDelete-form'
      document.getElementById('studentSubjectModalLabel').innerHTML = 'Uklanjanje dodeljenih predmeta'
      document.getElementById('btnStudentSubject').innerHTML = 'Ukloni dodeljenje predmete'
      
      const {data: {student}} = await axios.get(`/api/v1/students/${element.parentElement.dataset.id}`)
      const {_id: studentID, firstName, lastName} = student
      document.getElementById('wholeName').innerHTML = `${firstName} ${lastName}`
      id = studentID
  
      const {data: {studentSubject}} = await axios.get(`/api/v1/studentSubjects/${id}&`)
      let items = []

      for(let i = 0;i < studentSubject.length;i++){
        const {data: {subject}} = await axios.get(`/api/v1/subjects/${studentSubject[i].subject_id}`)
        if(i == 0)
          items.push(`<option value="${subject._id}" selected>${subject.name}</option>`)
        else
          items.push(`<option value="${subject._id}">${subject.name}</option>`)
      }

      document.getElementById('subj').innerHTML = items
    } catch(error){
      console.log(error)
    }
  }
  else{
    if(element.classList.contains('fullName') || element.classList.contains('index-color')){
      let tmp = element.parentElement.lastElementChild.lastElementChild.dataset.id

      try{
        const {data: {student}} = await axios.get(`/api/v1/students/${tmp}`)
        const {_id: studentID, firstName, lastName, index} = student

        const {data: {studentSubject}} = await axios.get(`/api/v1/studentSubjects/${tmp}&`)

        document.getElementById('informationModalLabel').innerHTML = `Informacije o studentu ${firstName} ${lastName}`
        let sum = 0

        //ovde treba popraviti proveru kad se uradi funkcionalnost za dodeljivanje predmeta studentim(azurirano 4.10.2022.)
        if(studentSubject.length == 0)
          document.querySelector('.info').innerHTML = `<h5>Student ${firstName} ${lastName} sa brojem indeksa ${index} nema predmeta koje slusa.</h5>`
        else{
          document.querySelector('.info').innerHTML = `<h5>Student ${firstName} ${lastName} sa brojem indeksa ${index} slusa sledece predmete:</h5>`
          for(let i = 0;i < studentSubject.length;i++){
            sum = 0
            const {data: {subject}} = await axios.get(`/api/v1/subjects/${studentSubject[i].subject_id}`)
            document.querySelector('.info').innerHTML += `<h4><ul><li><strong>${subject.name}</strong>&nbsp;(${studentSubject[i].school_year})</li><ul id="cat${subject._id}"></ul></ul></h4>`
            for(let j = 0;j < subject.categories.length;j++){
              let tmp1 = studentSubject[i].points[j] === undefined ? 0 : studentSubject[i].points[j]
              sum += Number(tmp1)
              document.getElementById(`cat${subject._id}`).innerHTML += `<h5><ul><li>${subject.categories[j]} - &nbsp;<strong>${tmp1}</strong> poen/a</li></ul></h5>`
            }
            document.querySelector('.info').innerHTML += `<h5>Ukupan broj poena - <strong>${sum}</strong></h5>`
          }
        }
      } catch(error){
        console.log(error)
      }
    }
  }
})

//dodavanje novog studenta/azuriranje postojeceg
studentFormDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    const firstName = firstNameDOM.value
    const lastName = lastNameDOM.value
    const index = indexDOM.value
  
    try {
      if(document.getElementById('stu-form').className == 'student-form'){
        await axios.post('/api/v1/students', { firstName, lastName, index })
        showStudents()
        firstNameDOM.value = ''
        lastNameDOM.value = ''
        indexDOM.value = ''

        studentFormAlertDOM.style.display = 'block'
        studentFormAlertDOM.textContent = 'Student uspesno dodat'
        studentFormAlertDOM.classList.remove('text-danger')
        studentFormAlertDOM.classList.add('text-success')
      }
      else if(document.getElementById('stu-form').className == 'updateStudent-form'){
        const {data: { student }} = await axios.patch(`/api/v1/students/${id}`, {
          firstName,
          lastName,
          index 
        })
        showStudents()

        studentFormAlertDOM.style.display = 'block'
        studentFormAlertDOM.textContent = 'Student uspesno azuriran'
        studentFormAlertDOM.classList.remove('text-danger')
        studentFormAlertDOM.classList.add('text-success')
      }
    } catch (error) {
      studentFormAlertDOM.style.display = 'block'
      studentFormAlertDOM.innerHTML = ''

      if(firstName == '')
        studentFormAlertDOM.innerHTML += error.response.data.msg.errors.firstName.message + "<br />"

      if(lastName == '')
        studentFormAlertDOM.innerHTML += error.response.data.msg.errors.lastName.message + "<br />"

      if(index == '')
        studentFormAlertDOM.innerHTML += error.response.data.msg.errors.index.message
      
      if(index != '' && error.response.data.msg.errors.index != undefined){
        studentFormAlertDOM.innerHTML += error.response.data.msg.errors.index.message
      }

      studentFormAlertDOM.classList.remove('text-success')
      studentFormAlertDOM.classList.add('text-danger')
    }

    setTimeout(() => {
      studentFormAlertDOM.style.display = 'none'
    }, 2000)
})

//funkcionalnost dodeljivanja predmeta studentu/uklanjanja dodeljenih predmeta
studentSubjectFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const student_id = id
  const subject_id = document.getElementById('subj').options[document.getElementById('subj').selectedIndex].value
  let school_year = ''

  try{
    if(document.getElementById('stuSub-form').className == 'studentSubject-form'){
      school_year = document.getElementById('schoolYear').value
      await axios.post('/api/v1/studentSubjects', { student_id, subject_id, school_year })

      document.querySelector('.studentSubjectForm-alert').style.display = 'block'
      document.querySelector('.studentSubjectForm-alert').textContent = 'Predmet uspesno dodeljen studentu'
      document.querySelector('.studentSubjectForm-alert').classList.remove('text-danger')
      document.querySelector('.studentSubjectForm-alert').classList.add('text-success')
    

      document.getElementById('schoolYear').value = ''
      document.getElementById('subj').options[document.getElementById('subj').selectedIndex].disabled = true
      document.getElementById('subj').options[document.getElementById('subj').selectedIndex].selected = false
      document.getElementById('subj').options[0].selected = true
    }
    else if(document.getElementById('stuSub-form').className == 'studentSubjectDelete-form'){
      await axios.delete(`/api/v1/studentSubjects/${student_id}&${subject_id}`)

      document.querySelector('.studentSubjectForm-alert').style.display = 'block'
      document.querySelector('.studentSubjectForm-alert').textContent = 'Predmet uspesno uklonjen'
      document.querySelector('.studentSubjectForm-alert').classList.remove('text-danger')
      document.querySelector('.studentSubjectForm-alert').classList.add('text-success')

      document.getElementById('subj').removeChild(document.getElementById('subj').options[document.getElementById('subj').selectedIndex])
      document.getElementById('subj').options[0].selected = true
    }
  }catch(error){
    document.querySelector('.studentSubjectForm-alert').style.display = 'block'
    document.querySelector('.studentSubjectForm-alert').innerHTML = ''

    if(subject_id == '')
      document.querySelector('.studentSubjectForm-alert').innerHTML += error.response.data.msg.errors.subject_id.message + "<br />"
    
    if(school_year == '' && document.getElementById('stuSub-form').className != 'studentSubjectDelete-form')
      document.querySelector('.studentSubjectForm-alert').innerHTML += error.response.data.msg.errors.school_year.message
    
    if(school_year != '' && error.response.data.msg.errors.school_year != undefined)
      document.querySelector('.studentSubjectForm-alert').innerHTML += error.response.data.msg.errors.school_year.message

    document.querySelector('.studentSubjectForm-alert').classList.remove('text-success')
    document.querySelector('.studentSubjectForm-alert').classList.add('text-danger')
  }

  setTimeout(() => {
    document.querySelector('.studentSubjectForm-alert').style.display = 'none'
  }, 2000)
})

studentSubjectPointsFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const student_id = id
  const subject_id = document.getElementById('subjPoints').options[document.getElementById('subjPoints').selectedIndex].value
  const pointsStr = document.getElementById('p').value
  const num = pointsStr.split(',').length - 1
  let points = []

  try{
    if(num > 0){
      for(let i = 0;i < num + 1;i++)
        points.push(Number(pointsStr.split(',')[i]))
    }
    else{
      if(pointsStr == '')
        points = []
      else
      points = Number(pointsStr)
    }

    if(subject_id == ''){
      document.querySelector('.studentSubjectPointsForm-alert').style.display = 'block'
      document.querySelector('.studentSubjectPointsForm-alert').innerHTML = ''

      document.querySelector('.studentSubjectPointsForm-alert').innerHTML += 'Predmet mora biti odabran'

      document.querySelector('.studentSubjectPointsForm-alert').classList.remove('text-success')
      document.querySelector('.studentSubjectPointsForm-alert').classList.add('text-danger')

      setTimeout(() => {
        document.querySelector('.studentSubjectPointsForm-alert').style.display = 'none'
      }, 2000)

      return
    }

    const {data: { studentSubject }} = await axios.patch(`/api/v1/studentSubjects/${student_id}&${subject_id}`, {
      points
    })

    document.querySelector('.studentSubjectPointsForm-alert').style.display = 'block'
    document.querySelector('.studentSubjectPointsForm-alert').textContent = 'Uspesno uneti poeni'
    document.querySelector('.studentSubjectPointsForm-alert').classList.remove('text-danger')
    document.querySelector('.studentSubjectPointsForm-alert').classList.add('text-success')
  } catch(error){
    document.querySelector('.studentSubjectPointsForm-alert').style.display = 'block'
    document.querySelector('.studentSubjectPointsForm-alert').innerHTML = ''

    if(subject_id == '')
      document.querySelector('.studentSubjectPointsForm-alert').innerHTML += error.response.data.msg.errors.subject_id.message + "<br />"

    document.querySelector('.studentSubjectPointsForm-alert').classList.remove('text-success')
    document.querySelector('.studentSubjectPointsForm-alert').classList.add('text-danger')
  }

  setTimeout(() => {
    document.querySelector('.studentSubjectPointsForm-alert').style.display = 'none'
  }, 2000)
})

const showPoints = async () => {
  let s = ''
  let ss = ''
  if(document.getElementById('subjPoints').options[document.getElementById('subjPoints').selectedIndex].value !== ''){
    let {data: {subject}} = await axios.get(`/api/v1/subjects/${document.getElementById('subjPoints').options[document.getElementById('subjPoints').selectedIndex].value}`)
    let {data: {studentSubject}} = await axios.get(`/api/v1/studentSubjects/${id}&${document.getElementById('subjPoints').options[document.getElementById('subjPoints').selectedIndex].value}`)
    s = subject
    ss = studentSubject[0]
  }

  let categories = ''
  let points = ''
  let c = ''
  let p = ''
  if(document.getElementById('subjPoints').options[document.getElementById('subjPoints').selectedIndex].value !== ''){
    if(s.categories.length != 0){
      for(let i = 0;i < s.categories.length;i++){
        categories += `${s.categories[i]},`
      }
      c = categories.slice(0, -1)
    }

    if(ss.points.length != 0){
      for(let i = 0;i < ss.points.length;i++){
        points += `${ss.points[i]},`
      }
      p = points.slice(0, -1)
    }
  }
  
  document.querySelector('.c').value = c
  document.querySelector('.p').value = p
}

const addElement = () => {
  parent = document.createElement('div')
  child1 = document.createElement('label')
  child2 = document.createElement('input')

  parent.className = 'form-group schoolYear-div'

  child1.setAttribute('for', 'schoolYear')
  child1.innerHTML = 'Skolska godina'

  child2.className = 'form-control schoolYear'
  child2.setAttribute('type', 'text')
  child2.setAttribute('id', 'schoolYear')

  parent.appendChild(child1)
  parent.appendChild(child2)

  document.querySelector('.wholeName').parentElement.after(parent)
}