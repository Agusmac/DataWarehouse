const sharedtitle = document.createElement('h1');


var contactDeleteArray = []


var page_size = 10
var page_number = 1
var fullcontactarray = ""
// var sortedArray=[]

var ascOrDesc = 0;
var ascOrDescCoun = 0;
var ascOrDescCom = 0;
var ascOrDescJob = 0;
var ascOrDescInterest = 1;

function contactpagesetter() {
  pagereset()

  sharedtitle.classList.add('sharedtitle');
  sharedtitle.textContent = ""
  navbar.insertAdjacentElement("afterend", sharedtitle)


  sharedtitle.textContent = ""

  actualpage.innerHTML = `
        <div class="container-fluid">
          <div class="text-left">
          <h1>Contacts</h1>
          </div>
          <div class="row justify-content-between">

          <div class="col-4 mb-3">
          <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
              
              <input disabled class="form-control rounded-0" id="exampleInputEmail1">
            
              <div class="btn-group" role="group">
              <button onclick="showfilter()" type="button" class="btn btn-secondary"><i class="fas fa-caret-down"></i></button>
              </div>
              <button onclick="filterfilter()" type="button" class="btn btn-secondary"><i class="fas fa-search"></i></button>
          </div>
        </div>
                  <div class="col-4 text-right">
                    <button onclick="contactFormSetter()" type="button" class="btn btn-primary btn-md">Add Contact</button>
                  </div>
          </div>
          <div class="filterDIV container displayTog">
            <div id="countryFilterDIV" class="row d-flex justify-content-start">Country
            <select class="form-control selector contactfilter" id="countryFilter">
                        <option selected value="All">All</option>
                        
            </select>
            </div>
            
            <div class="row d-flex justify-content-start">Company
            <select class="form-control selector contactfilter" id="companyFilter">
            <option selected value="All">All</option>
            </select> 
            </div>
           
            
            <div class="row d-flex justify-content-start">Interest 
            <select class="form-control selector contactfilter" id="interestFilter">
                        <option selected value="All">All</option>
                        <option value="100">100%</option>
                        <option value="75">75%</option>
                        <option value="50">50%</option>
                        <option value="25">25%</option>
                        <option value="0">0%</option>
            </select>
            </div>
          </div>
          <div class="alerter"></div>

        <br>
        <br>
        <div class="contactCounter row justify-content-between"></div>

          <div class="contactsdiv">
          <div class="table-responsive border">
          <table class="table table-sm">
            <thead>
              <tr>
                <th class="text-center text-primary" onclick="clearSelection()">Clear</th>
                <th onclick="orderByName()">Contact <i class="fas fa-sort"></i></th>
                <th onclick="orderByCountry()">Country/Region <i class="fas fa-sort"></i></th>
                <th onclick="orderByCompany()">Company <i class="fas fa-sort"></i></th>
                <th onclick="orderByJob()">Job <i class="fas fa-sort"></i></th>
                <th onclick="orderByInterest()" class="text-center">Interest <i class="fas fa-sort"></i></th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="BIGDIV">
            </tbody>
          </table>
        </div>
          </div>

          <div id="paginator"class="row justify-content-between"></div>

        </div>`

  contactsetter2()
  filterSetter()
}


function showfilter() {
  document.querySelector(".filterDIV").classList.toggle("displayTog")
}

function filterfilter(orderBy,ascOrDesc) {
  
  document.querySelector("#paginator").innerHTML = ""
  document.querySelector(".filterDIV").classList.add("displayTog")

  var companyFilter = document.querySelector("#companyFilter")
  var countryFilter = document.querySelector("#countryFilter")
  var interestFilter = document.querySelector("#interestFilter")
  var filteredArray = fullcontactarray


  if (countryFilter.value != "All") {
   
    filteredArray = filteredArray.filter(contact => contact.countryName == countryFilter.value)
  }
  if (companyFilter.value != "All") {
    
    filteredArray = filteredArray.filter(contact => contact.companyName == companyFilter.value)
  }
  if (interestFilter.value != "All") {
   
    filteredArray = filteredArray.filter(contact => contact.interest == interestFilter.value)
  }

 
  if(orderBy){
    sorter(orderBy, filteredArray, ascOrDesc)
  }else{
    sorter("countryName", filteredArray, 1)
  }

}


async function filterSetter() {
  var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
  var companyFilter = document.querySelector("#companyFilter")
  var countryFilter = document.querySelector("#countryFilter")

  await fetch(`http://localhost:3000/companies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': jwtToken
    }
  })
    .then(res => res.json())
    .then(res => {
      res.companies.map((company) => {

        var companyFilterOption = document.createElement("option")
        companyFilterOption.value = company.CompanyName
        companyFilterOption.textContent = company.CompanyName
        companyFilter.insertAdjacentElement("beforeend", companyFilterOption)
      })

    })

  await fetch(`http://localhost:3000/countries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': jwtToken
    }
  })
    .then(res => res.json())
    .then(res => {
      res.countries.map((country) => {
        var countryFilterOption = document.createElement("option")
        countryFilterOption.value = country.name
        countryFilterOption.textContent = country.name
        countryFilter.insertAdjacentElement("beforeend", countryFilterOption)
      })
    })

}


async function contactsetter2() {
  try {
    var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
    await fetch("http://localhost:3000/contacts", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': jwtToken
      }
    })
      .then(res => res.json())
      .then(res => {
        fullcontactarray = res.contacts
        
        sorter("countryName", fullcontactarray, 1, 1)
        
      })

  } catch (error) {
    console.log('Error:', error)
  }
}


function sorter(orderBy, contacts, ascdesc) {
  
  if (contacts == "defaulter") {
    contacts = fullcontactarray
  }
  const contactBIGDIV = document.querySelector(".BIGDIV")
  contactBIGDIV.innerHTML = ""
  if (ascdesc) {
    contacts.sort(function (a, b) {
      if (a[orderBy] < b[orderBy]) { return -1; }
      if (a[orderBy] > b[orderBy]) { return 1; }
      return 0;
    })
  } else {
    contacts.sort(function (a, b) {
      if (a[orderBy] > b[orderBy]) { return -1; }
      if (a[orderBy] < b[orderBy]) { return 1; }
      return 0;
    })
  }

  sortedArray = contacts;
  if (contacts.length < 10) {
    contacts.map(contactsDivMaker)
  } else {
    var temp = paginate(sortedArray)
    temp.map(contactsDivMaker)
    paginator()
  }
}

function paginate(array) {
  document.querySelector(".BIGDIV").innerHTML = ""
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function paginator() {
  document.querySelector("#paginator").innerHTML = `
  <p>Rows per page: ${page_size} <i onclick="pagiMORE()" class="text-primary fas fa-plus"></i><i onclick="pagiLess()" class="text-primary fas fa-minus"></i></p>
  <div class="text-primary"><i onclick="pagBack()"   class="fas fa-chevron-left"></i><i onclick="pagNext()" class="fas fa-chevron-right"></i><div>
  `
}

function pagiMORE() {
  if (page_size == 20) {

  } else {
    page_size += 5;
  }
  page_number = 1
  paginate(sortedArray).map(contactsDivMaker)
  paginator()
}

function pagiLess() {
  if (page_size == 5) {
  } else {
    page_size -= 5;
  }
  page_number = 1
  paginate(sortedArray).map(contactsDivMaker)
  paginator()
}

function pagNext() {
  if ((page_number * page_size) > sortedArray.length) {
  } else {
    page_number += 1
  }
  paginate(sortedArray).map(contactsDivMaker)
  paginator()
}

function pagBack() {
  if ((page_number - 1) < 1) {
    page_number = 1
  } else {
    page_number -= 1
  }
  paginate(sortedArray).map(contactsDivMaker)
  paginator()
}


function contactsDivMaker(contact) {
 
  var barcolor = ""

  switch (contact.interest) {
    case 100:
      barcolor = "bg-danger"
      break;
    case 75:
      barcolor = "bg-warning"
      break;
    case 50:
      barcolor = ""
      break;

    default:
      barcolor = "bg-success"
      break;
  }
  const contactBIGDIV = document.querySelector(".BIGDIV")

  var contactDiv = document.createElement("tr")
  contactDiv.id = `contact${contact.id}`
  contactDiv.classList.add("contacthover")
  contactDiv.innerHTML = `
  <td class="align-middle" >
  <p class="contactName">${contact.fName + " " + contact.lName}</p>
  <small>${contact.email}</small>
  </td>
  <td class="align-middle">
  <p class="contactName">${contact.countryName}</p>
  <small>${contact.regionName}</small>
  </td>
  <td class="align-middle">${contact.companyName}</td>
  <td class="align-middle">${contact.job}</td>
  <td class="align-middle">
  <div class="progress">
    <div class="progress-bar ${barcolor}" role="progressbar" style="width: ${contact.interest}%;" aria-valuenow="${contact.interest}" aria-valuemin="0" aria-valuemax="100">${contact.interest}%</div>
  </div>
  </td>
  `

  var contactcheckbox = document.createElement("td")
  contactcheckbox.classList.add("text-center")
 

  var checkboxDIV = document.createElement("div")
  checkboxDIV.classList.add("form-check")
  checkboxDIV.id = "checkboxDIV"

  var checkboxerr = document.createElement("input")
  checkboxerr.classList.add("form-check-input")
  checkboxerr.type = "checkbox"
  checkboxerr.id = "flexCheckDefault"
  checkboxerr.addEventListener("change", () => {
    contactDiv.classList.toggle("selectedContact")
    deleteList(contact.id)
  })

  var spanDiv = document.createElement("td")
  spanDiv.classList.add("text-center", "align-middle", "spanrelative")

  var deledit = document.createElement("div")
  deledit.classList.add("deledit")

  function resetcontact() {
    deledit.classList.toggle("deledit2")
    deledit.classList.toggle("deledit")
    deledit.innerHTML = ""
    deledit.insertAdjacentElement("beforeend", trashcan)
    deledit.insertAdjacentElement("beforeend", pencil)
  }


  var trashcan = document.createElement("i")
  trashcan.classList.add("fas", "fa-trash")
  trashcan.addEventListener("click", () => {
   
    deledit.classList.toggle("deledit2")
    deledit.classList.toggle("deledit")
    deledit.innerHTML = `
    Delete
    <br>
    <span onclick="deleteContact(${contact.id})" class="bg-danger rounded text-white">Confirm</span>
    <span id="canceler" class="bg-secondary rounded text-white">Cancel</span>
    `
    document.querySelector("#canceler").addEventListener("click", resetcontact)
  })


  var pencil = document.createElement("i")
  pencil.classList.add("fas", "fa-pencil-alt")
  pencil.addEventListener("click", () => {
    editcontact(contact)
  })

  spanDiv.innerHTML = `<i class="fas fa-ellipsis-h"></i>`
  contactBIGDIV.insertAdjacentElement("beforeend", contactDiv)
  contactDiv.insertAdjacentElement("afterbegin", contactcheckbox)
  contactDiv.insertAdjacentElement("beforeend", spanDiv)


  const found = contactDeleteArray.find(id => id === contact.id);
  if (found) {
    contactDiv.classList.toggle("selectedContact")
    
    checkboxerr.checked = true;
  }

  contactcheckbox.appendChild(checkboxDIV)
  checkboxDIV.appendChild(checkboxerr)

  spanDiv.insertAdjacentElement("beforeend", deledit)
  deledit.insertAdjacentElement("beforeend", trashcan)
  deledit.insertAdjacentElement("beforeend", pencil)

}


async function deleteContact(id) {
 
  var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
  try {
    await fetch(`http://localhost:3000/contacts/${id}`, {
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
          contactalert("Deleted Contact/s Correctly", 1500,1)
          setTimeout(() => {
            contactpagesetter()
          }, 1500);
        } else {
          contactalert("Error, delete failed", 1500)
        }
      })
  } catch (error) {
    console.log('Error:', error)
  }
}

function clearSelection() {
  let event = new Event('change');
  document.querySelectorAll('input[type=checkbox]').forEach(el => {
    if (el.checked == true) {
      el.dispatchEvent(event);
    }
  })
  document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
  document.querySelector(".contactCounter").innerHTML = ""
  contactDeleteArray = []

}

function deleteList(id) {
  var contactCounter = document.querySelector(".contactCounter")

  var check = contactDeleteArray.findIndex(contactID => contactID == id)
  if (check == -1) {
    contactDeleteArray.push(id)
  } else {
    contactDeleteArray.splice(check, 1);
  }
 
  if (contactDeleteArray.length > 0) {
    contactCounter.innerHTML = `
    <button type="button" class="btn selectCOUNTER text-primary btn-sm">${contactDeleteArray.length} Selected</button>
    <p onclick="deleter()" class="text-primary"><i class="fas fa-trash"></i> Eliminar Contactos</p>
    `
  } else {
    contactCounter.innerHTML = ""
  }

}

function deleter() {
  contactDeleteArray.map((contactID) => {
    deleteContact(contactID)
  })
  clearSelection()
}

function editcontact(contact) {
  contactFormSetter(1,contact)
}



// ORDER BY
function orderByName() {

  if (ascOrDesc) {
    ascOrDesc = 0
  } else {
    ascOrDesc = 1
  }

  ascOrDescCoun = 0;
  ascOrDescCom = 0;
  ascOrDescJob = 0;
  ascOrDescInterest = 1;
  filterfilter("fName",ascOrDesc)
}


function orderByCountry() {

  if (ascOrDescCoun) {
    ascOrDescCoun = 0
  } else {
    ascOrDescCoun = 1
  }
  ascOrDesc = 0;
  ascOrDescCom = 0;
  ascOrDescJob = 0;
  ascOrDescInterest = 1;
  filterfilter("countryName",ascOrDescCoun)
}


function orderByCompany() {

  if (ascOrDescCom) {
    ascOrDescCom = 0
  } else {
    ascOrDescCom = 1
  }
  ascOrDesc = 0
  ascOrDescCoun = 0;
  ascOrDescJob = 0;
  ascOrDescInterest = 1;
  filterfilter("companyName",ascOrDescCom)
 
}
function orderByJob() {

  if (ascOrDescJob) {
    ascOrDescJob = 0
  } else {
    ascOrDescJob = 1
  }
  ascOrDesc = 0;
  ascOrDescCoun = 0;
  ascOrDescCom = 0;
  ascOrDescInterest = 1;
  filterfilter("job",ascOrDescJob)
 
}

function orderByInterest() {

  if (ascOrDescInterest) {
    ascOrDescInterest = 0
  } else {
    ascOrDescInterest = 1
  }
  ascOrDesc = 0;
  ascOrDescCoun = 0;
  ascOrDescCom = 0;
  ascOrDescJob = 0;
  filterfilter("interest",ascOrDescInterest)

}