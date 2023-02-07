const subjectFormDOM = document.querySelector(".subject-form");
const nameDOM = document.getElementById("name");
const categoryDOM = document.getElementById("category");
const subjectFormAlertDOM = document.querySelector(".subjectForm-alert");

const subjectsDOM = document.querySelector(".subjects");

const subjecth5 = document.getElementById("subjectModalLabel");
const btnAddSubject = document.getElementById("btnAddSubject");

document.getElementById("aAddSubject").addEventListener("click", () => {
  subjecth5.innerHTML = "Dodavanje predmeta";
  btnAddSubject.innerHTML = "Dodaj predmet";
  document.getElementById("sub-form").className = "subject-form";
  nameDOM.value = "";
  categoryDOM.value = "";
});

//dobavljanje svih predmeta
const showSubjects = async () => {
  try {
    const {
      data: { subjects },
    } = await axios.get("/api/v1/subjects");

    if (subjects.length < 1) {
      subjectsDOM.innerHTML =
        '<h5 class="empty-list">Lista predmeta je prazna</h5>';
      return;
    }

    const allSubjects = subjects
      .map((subject) => {
        const { _id: subjectID, name } = subject;
        return `
            <div class="single-subject">
                <h5 class="subjectName" data-bs-toggle="modal" data-bs-target="#informationModal">
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
            </div>`;
      })
      .join("");
    subjectsDOM.innerHTML = allSubjects;
  } catch (error) {
    console.log(error);
    subjectsDOM.innerHTML =
      '<h5 class="empty-list">Greska, probajte kasnije...</h5>';
  }
};

showSubjects();

//dobavljanje odredjenog predmeta/brisanje odredjenog predmeta/prikaz informacija o odredjenom predmetu
subjectsDOM.addEventListener("click", async (e) => {
  e.preventDefault();
  const element = e.target;

  if (element.parentElement.classList.contains("edit-link")) {
    document.getElementById("sub-form").className = "updateSubject-form";
    subjecth5.innerHTML = "Azuriranje predmeta";
    btnAddSubject.innerHTML = "Azuriraj predmet";

    try {
      const {
        data: { subject },
      } = await axios.get(
        `/api/v1/subjects/${element.parentElement.dataset.id}`
      );
      const { _id: subjectID, name, categories } = subject;

      id = subjectID;
      nameDOM.value = name;
      if (categories == undefined) categoryDOM.value = "";
      else categoryDOM.value = categories;
    } catch (error) {
      console.log(error);
    }
  } else if (element.parentElement.classList.contains("delete-btn")) {
    id = element.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/studentSubjects/&${id}`);
      await axios.delete(`/api/v1/subjects/${id}`);
      showSubjects();
    } catch (error) {
      console.log(error);
    }
  } else {
    if (element.classList.contains("subjectName")) {
      const tmp =
        element.parentElement.lastElementChild.lastElementChild.dataset.id;

      try {
        const {
          data: { subject },
        } = await axios.get(`/api/v1/subjects/${tmp}`);
        const { _id: subjectID, name, categories } = subject;

        document.getElementById(
          "informationModalLabel"
        ).innerHTML = `Informacije o predmetu ${name}`;
        if (categories.length == 0)
          document.querySelector(
            ".info"
          ).innerHTML = `<h5>Predmet ${name} trenutno nema nijednu definisanu kategoriju.</h5>`;
        else {
          document.querySelector(
            ".info"
          ).innerHTML = `<h5>Predmet ${name} ima sledece kategorije:</h5>`;
          document.querySelector(".info").innerHTML +=
            '<h4><ul class="categories-list"></ul></h4>';

          categories.forEach(
            (item) =>
              (document.querySelector(
                ".categories-list"
              ).innerHTML += `<li>${item}</li>`)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
});

//dodavanje novog predmeta/azuriranje postojeceg
subjectFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameDOM.value;
  let categories = [];
  const num = categoryDOM.value.split(",").length - 1;
  console.log(`Kategorije num: `, num);
  if (num > 0) {
    for (let i = 0; i < num + 1; i++)
      categories[i] = categoryDOM.value.split(",")[i];
  } else {
    if (categoryDOM.value == "") categories = [];
    else categories = categoryDOM.value;
  }

  try {
    if (document.getElementById("sub-form").className == "subject-form") {
      await axios.post("/api/v1/subjects", { name, categories });
      showSubjects();

      nameDOM.value = "";
      categoryDOM.value = "";

      subjectFormAlertDOM.style.display = "block";
      subjectFormAlertDOM.textContent = "Predmet uspesno dodat";
      subjectFormAlertDOM.classList.remove("text-danger");
      subjectFormAlertDOM.classList.add("text-success");
    } else if (
      document.getElementById("sub-form").className == "updateSubject-form"
    ) {
      const {
        data: { subject },
      } = await axios.patch(`/api/v1/subjects/${id}`, { name, categories });
      showSubjects();

      subjectFormAlertDOM.style.display = "block";
      subjectFormAlertDOM.textContent = "Predmet uspesno azuriran";
      subjectFormAlertDOM.classList.remove("text-danger");
      subjectFormAlertDOM.classList.add("text-success");
    }
  } catch (error) {
    subjectFormAlertDOM.style.display = "block";
    subjectFormAlertDOM.innerHTML = "";

    if (name == "")
      subjectFormAlertDOM.innerHTML +=
        error.response.data.msg.errors.name.message + "<br />";

    subjectFormAlertDOM.classList.remove("text-success");
    subjectFormAlertDOM.classList.add("text-danger");
  }

  setTimeout(() => {
    subjectFormAlertDOM.style.display = "none";
  }, 2000);
});
