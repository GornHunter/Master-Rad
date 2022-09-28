const subjectFormDOM = document.querySelector('.subject-form')
const nameDOM = document.getElementById('name')
const subjectFormAlertDOM = document.querySelector('.subjectForm-alert')

const subjectsDOM = document.querySelector('.subjects')

const subjecth5 = document.getElementById('subjectModalLabel')
const btnAddSubject = document.getElementById('btnAddSubject')

let subj = []
let parentCat = ''
let child1Cat = ''
let child2Cat = ''
let token = 0
let categoryDOM = ''

document.getElementById('aAddSubject').addEventListener('click', () => {
    subjecth5.innerHTML = 'Dodavanje predmeta'
    btnAddSubject.innerHTML = 'Dodaj predmet'
    subjectFormDOM.className = 'subject-form'
    nameDOM.value = ''
    if(token == 1){
      removeCategoryElement()
    }
})

//dobavljanje svih predmeta
const showSubjects = async () => {
    try{
        const {data: {subjects}} = await axios.get('/api/v1/subjects')
        //subj = subjects

        if(subjects.length < 1){
            subjectsDOM.innerHTML = '<h5 class="empty-list">Lista predmeta je prazna</h5>'
            return
        }

        const allSubjects = subjects.map((subject) => {
            const {_id: subjectID, name} = subject
            return `
            <div class="single-subject">
                <h5 class="subjectName">
                    ${name}
                </h5>

                <div class="subject-links">

                    <!-- edit link -->
                    <a href="#" class="edit-link" title="Azuriraj predmet" data-bs-toggle="modal" data-bs-target="#subjectModal" data-id="${subjectID}">
                        <i class="fas fa-edit"></i>
                    </a>

                    <!-- delete btn -->
                    <button type="button" class="delete-btn" data-id="${subjectID}" title="Ukloni predmet">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`
        }).join('')
        subjectsDOM.innerHTML = allSubjects
    }catch(error){
        console.log(error)
        subjectsDOM.innerHTML = '<h5 class="empty-list">Greska, probajte kasnije...</h5>'
    }
}

showSubjects()

//brisanje odredjenog predmeta
subjectsDOM.addEventListener('click', async (e) => {
    const element = e.target
  
    if (element.parentElement.classList.contains('delete-btn')) {
      const id = element.parentElement.dataset.id
      try {
        await axios.delete(`/api/v1/subjects/${id}`)
        showSubjects()
      } catch (error) {
        console.log(error)
      }
    }
})

//dobavljanje odredjenog predmeta
subjectsDOM.addEventListener('click', async (e) => {
    e.preventDefault()
    subjectFormDOM.className = 'updateSubject-form'
    const element = e.target
    subjecth5.innerHTML = 'Azuriranje predmeta'
    btnAddSubject.innerHTML = 'Azuriraj predmet'

    if(token == 0){
      addCategoryElement()
    }
  
    if (element.parentElement.classList.contains('edit-link')) {
      const {data: {subject}} = await axios.get(`/api/v1/subjects/${element.parentElement.dataset.id}`)
      const {_id: subjectID, name, categories} = subject
  
      id = subjectID
      nameDOM.value = name
      if(categories == undefined)
        categoryDOM.value = ''
      else
        categoryDOM.value = categories
    }
})

//dodavanje novog predmeta/azuriranje postojeceg
subjectFormDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = nameDOM.value
    //const category = categoryDOM.value
  
    try {
      if(subjectFormDOM.className == 'subject-form'){
        await axios.post('/api/v1/subjects', { name })
        showSubjects()
        nameDOM.value = ''

        subjectFormAlertDOM.style.display = 'block'
        subjectFormAlertDOM.textContent = 'Predmet uspesno dodat'
        subjectFormAlertDOM.classList.remove('text-danger')
        subjectFormAlertDOM.classList.add('text-success')
      }
      else if(subjectFormDOM.className == 'updateSubject-form'){
        const name = nameDOM.value
        let categories = []
        const num = categoryDOM.value.split(',').length - 1
        if(num > 0){
          for (let i = 0;i < num + 1;i++) {
            categories[i] = categoryDOM.value.split(',')[i]
          }
        }
        else{
          if(categoryDOM.value == '')
            categories = []
          else
            categories = categoryDOM.value
        }

        const {data: { subject }} = await axios.patch(`/api/v1/subjects/${id}`, {name, categories})
        showSubjects()

        subjectFormAlertDOM.style.display = 'block'
        subjectFormAlertDOM.textContent = 'Predmet uspesno azuriran'
        subjectFormAlertDOM.classList.remove('text-danger')
        subjectFormAlertDOM.classList.add('text-success')
      }
    } catch (error) {
      subjectFormAlertDOM.style.display = 'block'
      subjectFormAlertDOM.innerHTML = ''


      if(name == '')
        subjectFormAlertDOM.innerHTML += error.response.data.msg.errors.name.message + "<br />"

      subjectFormAlertDOM.classList.remove('text-success')
      subjectFormAlertDOM.classList.add('text-danger')
    }

    setTimeout(() => {
      subjectFormAlertDOM.style.display = 'none'
    }, 2000)
})

const addCategoryElement = () => {
  parentCat = document.createElement('div')
  child1Cat = document.createElement('label')
  child2Cat = document.createElement('input')

  parentCat.className = 'form-group'

  child1Cat.setAttribute('for', 'category')
  child1Cat.innerHTML = 'Kategorije'

  child2Cat.className = 'form-control category'
  child2Cat.setAttribute('type', 'text')
  child2Cat.setAttribute('id', 'category')

  parentCat.appendChild(child1Cat)
  parentCat.appendChild(child2Cat)
  parentCat.style.marginTop = '10px'

  nameDOM.parentElement.after(parentCat)
  categoryDOM = document.getElementById('category')
  token = 1
}

const removeCategoryElement = () => {
  nameDOM.parentNode.parentElement.removeChild(document.getElementById('category').parentElement)
  categoryDOM = ''
  token = 0
}