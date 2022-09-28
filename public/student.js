const studentFormDOM = document.querySelector('.student-form')
const firstNameDOM = document.getElementById('firstName')
const lastNameDOM = document.getElementById('lastName')
const indexDOM = document.getElementById('index')
const studentFormAlertDOM = document.querySelector('.studentForm-alert')

const studentsDOM = document.querySelector('.students')

const studenth5 = document.getElementById('studentModalLabel')
const btnAddStudent = document.getElementById('btnAddStudent')

let id = ''

document.getElementById('aAddStudent').addEventListener('click', (e) => {
  studenth5.innerHTML = 'Dodavanje studenta'
  btnAddStudent.innerHTML = 'Dodaj studenta'
  studentFormDOM.className = 'student-form'
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
      <div class="single-student" data-bs-toggle="modal" data-bs-target="#informationModal">
        <h5 class="fullName">
          ${firstName}&nbsp;${lastName}
        </h5>
        <h5 class="index-color">
          ${index}
        </h5>
        <div class="student-links">

          <!-- edit link -->
          <a href="#" class="edit-link" title="Azuriraj studenta" data-bs-toggle="modal" data-bs-target="#studentModal" data-id="${studentID}">
            <i class="fas fa-edit"></i>
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

//dobavljanje odredjenog studenta/brisanje odredjenog studenta
studentsDOM.addEventListener('click', async (e) => {
  e.preventDefault()
  const element = e.target

  if (element.parentElement.classList.contains('edit-link')) {
    studentFormDOM.className = 'updateStudent-form'
    studenth5.innerHTML = 'Azuriranje studenta'
    btnAddStudent.innerHTML = 'Azuriraj studenta'

    const {data: {student}} = await axios.get(`/api/v1/students/${element.parentElement.dataset.id}`)
    const {_id: studentID, firstName, lastName, index} = student

    id = studentID
    firstNameDOM.value = firstName
    lastNameDOM.value = lastName
    indexDOM.value = index
  }
  else if(element.parentElement.classList.contains('delete-btn')){
    const id = element.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/students/${id}`)
      showStudents()
    } catch (error) {
      console.log(error)
    }
  }
  else{
    let tmp = ''
    if(element.classList.contains('single-student')){
      tmp = element.lastElementChild.lastElementChild.dataset.id
    }
    else if(element.classList.contains('fullName') || element.classList.contains('index-color'))
      tmp = element.parentElement.lastElementChild.lastElementChild.dataset.id
    
    const {data: {student}} = await axios.get(`/api/v1/students/${tmp}`)
    const {_id: studentID, firstName, lastName, index, subjects} = student

    document.getElementById('informationModalLabel').innerHTML = `Informacije o studentu ${firstName} ${lastName}`
    if(subjects.length == 0)
      document.querySelector('.info').innerHTML = `<h5>Student ${firstName} ${lastName} sa brojem indeksa ${index} nema predmeta koje slusa.</h5>`
    else{
      document.querySelector('.info').innerHTML = `<h5>Student ${firstName} ${lastName} sa brojem indeksa ${index} slusa sledece predmete:</h5>`
      document.querySelector('.info').innerHTML += '<h4><ul><li>1</li><li>2</li><li>3</li></ul></h4>'
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
      if(studentFormDOM.className == 'student-form'){
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
      else if(studentFormDOM.className == 'updateStudent-form'){
        const firstName = firstNameDOM.value
        const lastName = lastNameDOM.value
        const index = indexDOM.value
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