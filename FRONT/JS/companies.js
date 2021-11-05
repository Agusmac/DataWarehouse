function companiespagesetter() {
  pagereset()
  sharedtitle.textContent = ""

  actualpage.innerHTML = `
    <div class="container-fluid">
        <div class="text-left">
        <h1>Companies</h1>
        </div>
        <div class="text-right addcompanyDiv">
        <button class="btn btn-lg btn-secondary text-right" onclick="event.preventDefault(); addCompany();">Add Company</button>
        </div>

        <div class="companiesformdiv"></div>
        
        <div class="companiesdiv">
        <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Country</th>
              <th>City</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="BIGDIV">
          </tbody>
        </table>
      </div>
        </div>
    </div>
    `

  setcompanies2()

}


async function setcompanies2() {
  try {
    var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
    await fetch("http://localhost:3000/companies", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': jwtToken
      }
    })
      .then(res => res.json())
      .then(res => {
        res.companies.map(companiesDivMaker)
      })

  } catch (error) {
    console.error('Error:', error)
  }
}

function companiesDivMaker(company) {
  
  const companiesBIGDIV = document.querySelector(".BIGDIV")
  var companyDiv = document.createElement("tr")
  companyDiv.innerHTML = `
  <td>${company.CompanyName}</td>
  <td>${company.CountryName}</td>
  <td>${company.cityName}</td>
  <td>${company.address}</td>
  <td>${company.email}</td>
  <td>${company.phone}</td>
  `
  
  var spanDiv = document.createElement("td")
  spanDiv.classList.add("d-flex", "justify-content-center")
  var deletebutton = document.createElement("span")
  var editbutton = document.createElement("span")

  editbutton.classList.add('bg-warning', 'rounded')
  editbutton.textContent = "Edit"
  editbutton.addEventListener("click", (event) => {
    event.preventDefault()
    editCompany(company)
  })
  deletebutton.classList.add("bg-danger", "rounded", "text-white")
  deletebutton.textContent = "Delete"
  deletebutton.addEventListener("click", (event) => {
    event.preventDefault()
    deleteCompany(company.CompanyID)
  })


  companiesBIGDIV.insertAdjacentElement("beforeend", companyDiv)
  companyDiv.insertAdjacentElement("beforeend", spanDiv)
  spanDiv.insertAdjacentElement("beforeend", editbutton)
  spanDiv.insertAdjacentElement("beforeend", deletebutton)

}


function addCompany() {
  formsetter("Add")
}
function editCompany(company) {
 
  formsetter("Edit", company)
}


function formsetter(editAdd, company) {
  var regionsformdiv = document.querySelector(".companiesformdiv")

  regionsformdiv.innerHTML = " "

  var formTitle = document.createElement('h2');
  formTitle.id = "formTitler"
  formTitle.textContent = `${editAdd} a company`


  var RCCnameInput = document.createElement("input")
  RCCnameInput.classList.add('form-control', 'top', 'companyinputstyle')
  RCCnameInput.id = `nameInput`
  RCCnameInput.placeholder = `Company Name`

  var cityInput = document.createElement("input")
  cityInput.classList.add('form-control', 'bottom', 'companyinputstyle')
  cityInput.id = `cityInput`
  cityInput.placeholder = `City(has to be in region/city)`

  var addressInput = document.createElement("input")
  addressInput.classList.add('form-control', 'middle', 'companyinputstyle')
  addressInput.id = `addressInput`
  addressInput.placeholder = `Address`

  var emailInput = document.createElement("input")
  emailInput.classList.add('form-control', 'middle', 'companyinputstyle')
  emailInput.id = `emailInput`
  emailInput.placeholder = `Email`
  emailInput.type = "email"

  var phoneInput = document.createElement("input")
  phoneInput.classList.add('form-control', 'middle', 'companyinputstyle')
  phoneInput.id = `phoneInput`
  phoneInput.placeholder = `Phone number`
  phoneInput.type = "tel"


  if (editAdd == "Edit") {
    RCCnameInput.value = company.CompanyName
    addressInput.value = company.address
    emailInput.value = company.email
    phoneInput.value = company.phone
    cityInput.value = company.cityName

  }
  var submitButton = document.createElement("div")
  submitButton.classList.add('btn', 'btn-danger', "submitregion")
  submitButton.id = `submitBTN`
  submitButton.textContent = `Submit`
  submitButton.addEventListener("click", () => {

    var newdata = {
      name: RCCnameInput.value,
      address: addressInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      city: cityInput.value
    }
    if (editAdd == "Edit") {
      sendComForm("PUT", newdata, company.CompanyID)
    } else {
      sendComForm("POST", newdata)
    }
  })
  regionsformdiv.insertAdjacentElement("beforeend", formTitle)
  regionsformdiv.insertAdjacentElement("beforeend", RCCnameInput)
  regionsformdiv.insertAdjacentElement("beforeend", addressInput)
  regionsformdiv.insertAdjacentElement("beforeend", emailInput)
  regionsformdiv.insertAdjacentElement("beforeend", phoneInput)
  regionsformdiv.insertAdjacentElement("beforeend", cityInput)

  regionsformdiv.insertAdjacentElement("beforeend", submitButton)
}



async function sendComForm(editAdd, newdata, id) {
  var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));

  var RCCnameInput = document.querySelector("#nameInput")
  var cityInput = document.querySelector("#cityInput")
  var addressInput = document.querySelector("#addressInput")
  var emailInput = document.querySelector("#emailInput")
  var phoneInput = document.querySelector("#phoneInput")
  var regionsformdiv = document.querySelector(".companiesformdiv")
  var formTitler = document.querySelector("#formTitler")
  var submitButton = document.querySelector("#submitBTN")

  var methoder = editAdd;
  

  const { name, address, email, phone, city } = newdata;
  var route = ""
  if (editAdd == "PUT") {
    route = `http://localhost:3000/companies/${id}`
  } else {
    route = `http://localhost:3000/companies`
  }
  if (name && address && email && phone && city) {
    try {
      await fetch(route, {
        method: methoder,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': jwtToken
        },
        body: JSON.stringify({ name: name, address: address, email: email, phone: phone, city: city, })
      })
        .then(response => response.json())
        .then(response => {
          if (response.operation) {
            formTitler.textContent = "Submited correctly!"
            RCCnameInput.remove()
            submitButton.remove()
            cityInput.remove()
            addressInput.remove()
            emailInput.remove()
            phoneInput.remove()

            setTimeout(() => {
              regionsformdiv.innerHTML = ""
              companiespagesetter()
            }, 1000);

          } else {
            alert()
          }
        })

    } catch (error) {
      console.error('Error:', error)
      alert()
    }
   
  } else {
    alert()
  }
  function alert() {

    RCCnameInput.classList.add("border-danger")
    cityInput.classList.add("border-danger")
    addressInput.classList.add("border-danger")
    emailInput.classList.add("border-danger")
    phoneInput.classList.add("border-danger")
    cityInput.value = ""
    cityInput.placeholder = "(city has to exist in region/city)"
    formTitler.textContent = "Submit failed! check data"
  }

}


async function deleteCompany(id) {

  var regionsformdiv = document.querySelector(".companiesformdiv")
  var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
  try {
    await fetch(`http://localhost:3000/companies/${id}`, {
      method: 'Delete',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': jwtToken
      }
    })
      .then(response => response.json())
      .then(response => {
        if (response.operation) {
          regionsformdiv.innerHTML = `<div class="alert alert-success" role = "alert" >deleted correctly</div >`
          setTimeout(() => {
            regionsformdiv.innerHTML = ""
            companiespagesetter()
            
          }, 1500);
        }
      })
  } catch (error) {
    console.error('Error:', error)
  }
}