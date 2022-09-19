const formDOM = document.querySelector('.student-form')
const firstNameDOM = document.getElementById('firstName')
const lastNameDOM = document.getElementById('lastName')
const indexDOM = document.getElementById('index')
const formAlertDOM = document.querySelector('.form-alert')

const studentsDOM = document.querySelector('.students')

const showStudents = async () => {
  try{
    const {data: {students}} = await axios.get('/api/v1/students')
    console.log(students)

    if(students.length < 1){
      studentsDOM.innerHTML = '<h5 class="empty-list">Lista studenata je prazna</h5>'
      return
    }

    const allStudents = students.map((student) => {
      const {_id: studentID, firstName, lastName, index, subjects} = student
      return `
      <div class="single-student">
        <h5 class="fullName">
          ${firstName}&nbsp;${lastName}
        </h5>
        <h5 class="index-color">
          ${index}
        </h5>
        <div class="student-links">

          <!-- edit link -->
          <a href="#" class="edit-link" title="Azuriraj studenta">
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

studentsDOM.addEventListener('click', async (e) => {
  const element = e.target

  if (element.parentElement.classList.contains('delete-btn')) {
    const id = element.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/students/${id}`)
      showStudents()
    } catch (error) {
      console.log(error)
    }
  }
})

formDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    const firstName = firstNameDOM.value
    const lastName = lastNameDOM.value
    const index = indexDOM.value
  
    try {
      await axios.post('/api/v1/students', { firstName, lastName, index })
      showStudents()
      firstNameDOM.value = ''
      lastNameDOM.value = ''
      indexDOM.value = ''

      formAlertDOM.style.display = 'block'
      formAlertDOM.textContent = 'Student uspesno dodat'
      formAlertDOM.classList.remove('text-danger')
      formAlertDOM.classList.add('text-success')
    } catch (error) {
      formAlertDOM.style.display = 'block'
      formAlertDOM.innerHTML = ''


      if(firstName == '')
        formAlertDOM.innerHTML += error.response.data.msg.errors.firstName.message + "<br />"

      if(lastName == '')
        formAlertDOM.innerHTML += error.response.data.msg.errors.lastName.message + "<br />"

      if(index == '')
        formAlertDOM.innerHTML += error.response.data.msg.errors.index.message
      
      if(index != '' && error.response.data.msg.errors.index != undefined){
        formAlertDOM.innerHTML += error.response.data.msg.errors.index.message
      }

      formAlertDOM.classList.remove('text-success')
      formAlertDOM.classList.add('text-danger')
    }

    setTimeout(() => {
      formAlertDOM.style.display = 'none'
    }, 3000)
})