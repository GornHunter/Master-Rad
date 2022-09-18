const studentDOM = document.querySelector('.student-form')
const firstNameDOM = document.getElementById('firstName')
const lastNameDOM = document.getElementById('lastName')
const indexDOM = document.getElementById('index')
const formAlertDOM = document.querySelector('.form-alert')

studentDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    const firstName = firstNameDOM.value
    const lastName = lastNameDOM.value
    const index = indexDOM.value
  
    try {
      await axios.post('/api/v1/students', { firstName, lastName, index })
      //showTasks()
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

      //formAlertDOM.innerHTML = `error, please try again`

      if(firstName == ''){
        formAlertDOM.innerHTML += error.response.data.msg.errors.firstName.message + "<br />"
      }

      if(lastName == ''){
        formAlertDOM.innerHTML += error.response.data.msg.errors.lastName.message + "<br />"
      }

      if(index == '' || index != ''){
        formAlertDOM.innerHTML += error.response.data.msg.errors.index.message
      }

      formAlertDOM.classList.remove('text-success')
      formAlertDOM.classList.add('text-danger')
    }

    setTimeout(() => {
      formAlertDOM.style.display = 'none'
    }, 3000)
})