function regionspagesetter() {
    pagereset()
  
    actualpage.innerHTML = `
 
    <div class="container-fluid">
    <div class="text-left">
        <h1>Regions</h1>
    </div>
    <div class="text-right">
      <button class="btn btn-lg btn-secondary  text-right" onclick="event.preventDefault(); addRegion();">AddRegion</button>
    </div>

    <div class="formdiv"></div>
    <div class="regionsdiv"></div>
    <div class="countriesdiv"></div>
    <div class="citiesdiv"></div>
  </div>
    `
    setRegionPart2()
}

async function setRegionPart2() {
    try {
        var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
        await fetch("http://localhost:3000/regions", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': jwtToken
            }
        })
            .then(res => res.json())
            .then(res => {
                res.regions.map(regionDivMaker)
            })
    } catch (error) {
        console.error('Error:', error)
    }
}


function regionDivMaker(region) {
    var addCountryBTN = document.createElement('div');
    var regionButtondiv = document.createElement('div');
    var regionButton = document.createElement('div');

    regionButton.classList.add('btn', 'btn-primary', "btn-lg", "regionBTN")
    regionButton.id = `region${region.id}`
    regionButton.textContent = `${region.name}`
    regionButton.addEventListener("click", () => {
        regionSelector(region)
    })
    addCountryBTN.classList.add('btn', 'btn-dark', "btn-lg", "addCountryBTN")
    addCountryBTN.textContent = "Add Country"
    addCountryBTN.addEventListener("click", () => {
        addCountry(region.id)
    })

    var regionsDiv = document.querySelector(".regionsdiv")
    regionsDiv.insertAdjacentElement("beforeend", regionButtondiv)
    regionButtondiv.insertAdjacentElement("beforeend", regionButton)
    regionButtondiv.insertAdjacentElement("beforeend", addCountryBTN)
}

async function regionSelector(region) {
    var countriesdiv = document.querySelector(".countriesdiv")
    countriesdiv.innerHTML = ""
    var citiesdiv = document.querySelector(".citiesdiv")
    citiesdiv.innerHTML = ""
    var countryDivTitle = document.createElement('h2');
    countryDivTitle.textContent = `Region: ${region.name}`
    countriesdiv.insertAdjacentElement("afterbegin", countryDivTitle)
    

    try {
        var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
        await fetch(`http://localhost:3000/countries/${region.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': jwtToken
            }
        })
            .then(res => res.json())
            .then(res => {
                res.countries.map(countryDivMaker)
            })
    } catch (error) {
        console.error('Error:', error)
    }
}


function countryDivMaker(country) {

    var countriesdiv = document.querySelector(".countriesdiv")
    var addCityBTN = document.createElement('div');
    var countryButtondiv = document.createElement('div');
    var countryButton = document.createElement('div');

    countryButton.classList.add('btn', 'btn-info', "btn-lg", "regionBTN")
    countryButton.id = `country${country.id}`
    countryButton.textContent = `${country.name}`
    countryButton.addEventListener("click", () => {
        countrySelector(country)
    })

    addCityBTN.classList.add('btn', 'btn-dark', "btn-lg", "addCityBTN")
    addCityBTN.textContent = "Add City"
    addCityBTN.addEventListener("click", () => {
        addCity(country.id)
    })

    var deleteCountryBTN = document.createElement('div');
    deleteCountryBTN.classList.add('btn', 'btn-danger', "btn-lg", "editdelete")
    deleteCountryBTN.id = `deletecountry${country.id}`
    deleteCountryBTN.textContent = `Delete`
    deleteCountryBTN.addEventListener("click", () => {
        deleteCico("countries", country.id)
    })
    var editCountryBTN = document.createElement('div');
    editCountryBTN.classList.add('btn', 'btn-warning', "btn-lg", "editdelete")
    editCountryBTN.id = `editcountry${country.id}`
    editCountryBTN.textContent = `Edit`
    editCountryBTN.addEventListener("click", () => {
        
        editCico("country",country.id)
    })
    countriesdiv.insertAdjacentElement("beforeend", countryButtondiv)
    countryButtondiv.insertAdjacentElement("beforeend", countryButton)

    countryButtondiv.insertAdjacentElement("beforeend", editCountryBTN)
    countryButtondiv.insertAdjacentElement("beforeend", deleteCountryBTN)
    countryButtondiv.insertAdjacentElement("beforeend", addCityBTN)
}


async function countrySelector(country) {

    var citiesdiv = document.querySelector(".citiesdiv")
    citiesdiv.innerHTML = ""
    var cityDivTitle = document.createElement('h2');
    cityDivTitle.textContent = `Country: ${country.name}`
    citiesdiv.insertAdjacentElement("afterbegin", cityDivTitle)

    try {
        var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
        await fetch(`http://localhost:3000/cities/${country.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': jwtToken
            }
        })
            .then(res => res.json())
            .then(res => {
                res.cities.map(cityDivMaker)
            })

    } catch (error) {
        console.error('Error:', error)
    }
}


function cityDivMaker(city) {

    var citiesdiv = document.querySelector(".citiesdiv")

    var cityButtondiv = document.createElement('div');
    var cityButton = document.createElement('div');

    cityButton.classList.add('btn', 'btn-success', "btn-lg", "regionBTN", "disabled")
    cityButton.id = `country${city.id}`
    cityButton.textContent = `${city.name}`
    
    var deleteCityBTN = document.createElement('div');
    deleteCityBTN.classList.add('btn', 'btn-danger', "btn-lg", "editdelete")
    deleteCityBTN.id = `deletecity${city.id}`
    deleteCityBTN.textContent = `Delete`
    deleteCityBTN.addEventListener("click", () => {
        deleteCico("cities", city.id)
    })
    var editCityBTN = document.createElement('div');
    editCityBTN.classList.add('btn', 'btn-warning', "btn-lg", "editdelete")
    editCityBTN.id = `editCity${city.id}`
    editCityBTN.textContent = `Edit`
    editCityBTN.addEventListener("click", () => {
        
        editCico("city",city.id)
    })

    citiesdiv.insertAdjacentElement("beforeend", cityButtondiv)
    cityButtondiv.insertAdjacentElement("beforeend", cityButton)

    cityButtondiv.insertAdjacentElement("beforeend", editCityBTN)
    cityButtondiv.insertAdjacentElement("beforeend", deleteCityBTN)
}


async function deleteCico(CiCo, id) {
    var regionsformdiv = document.querySelector(".formdiv")
    var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
    try {
        await fetch(`http://localhost:3000/${CiCo}/${id}`, {
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
                            regionspagesetter()
                            regionsformdiv.innerHTML =""
                        }, 1500);
                }
            })
    } catch (error) {
        console.error('Error:', error)
    }
}


function editCico(Cico,id){

    var regionsformdiv = document.querySelector(".formdiv")

    regionsformdiv.innerHTML = " "

    var formTitle = document.createElement('h2');
    formTitle.id = "formTitler"
    formTitle.textContent = `Edit ${Cico}`


    var RCCnameInput = document.createElement("input")
    RCCnameInput.classList.add('form-control', "editdelete", "regioninput")
    RCCnameInput.id = `RegionInput`
    RCCnameInput.placeholder = `${Cico} name`


    var submitButton = document.createElement("div")
    submitButton.classList.add('btn', 'btn-danger', "submitregion")
    submitButton.id = `submitBTN`
    submitButton.textContent = `Submit`
    submitButton.addEventListener("click", () => {
        if(Cico=="city"){
            sendCicoEDIT("cities", id, RCCnameInput.value)
        }else{
            sendCicoEDIT("countries", id, RCCnameInput.value)
        }
        
    })
    regionsformdiv.insertAdjacentElement("afterbegin", submitButton)
    regionsformdiv.insertAdjacentElement("afterbegin", RCCnameInput)
    regionsformdiv.insertAdjacentElement("afterbegin", formTitle)
}

async function sendCicoEDIT(route,id,name){
    
    var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
    var RCCnameInput = document.querySelector("#RegionInput")
    var regionsformdiv = document.querySelector(".formdiv")
    var formTitler = document.querySelector("#formTitler")
    var submitButton = document.querySelector("#submitBTN")

    if (!name) {
        RCCnameInput.classList.add("border-danger")
        RCCnameInput.placeholder = "Complete this first!"
    } else {
        
        try {
            await fetch(`http://localhost:3000/${route}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': jwtToken
                },
                body: JSON.stringify({ name: name })
            })
                .then(response => response.json())
                .then(response => {
                    if (response.operation) {
                        formTitler.textContent = `${route} edited!`
                        RCCnameInput.remove()
                        submitButton.remove()

                        setTimeout(() => {
                            regionsformdiv.innerHTML = ""
                            regionspagesetter()
                        }, 1500);

                    } else {
                        formTitler.textContent = "Submit failed!, try again"
                        RCCnameInput.classList.add("border-danger")
                        RCCnameInput.value = ""
                        RCCnameInput.placeholder = "Check this data"
                    }
                })
        } catch (error) {
            console.error('Error:', error)
        }
       
    }
}


function addCity(countryID) {
    ciCoformer("city", countryID)
}

function addCountry(regionID) {
    ciCoformer("country", regionID)
}

function ciCoformer(CIorCO, id) {

    var regionsformdiv = document.querySelector(".formdiv")

    regionsformdiv.innerHTML = " "

    var formTitle = document.createElement('h2');
    formTitle.id = "formTitler"
    formTitle.textContent = `Add a ${CIorCO}`

    var RCCnameInput = document.createElement("input")
    RCCnameInput.classList.add('form-control', "editdelete", "regioninput")
    RCCnameInput.id = `RegionInput`
    RCCnameInput.placeholder = `${CIorCO} Name`


    var submitButton = document.createElement("div")
    submitButton.classList.add('btn', 'btn-danger', "submitregion")
    submitButton.id = `submitBTN`
    submitButton.textContent = `Submit`
    submitButton.addEventListener("click", () => {
        sendCicoForm(CIorCO, id, RCCnameInput.value)
    })
    regionsformdiv.insertAdjacentElement("afterbegin", submitButton)
    regionsformdiv.insertAdjacentElement("afterbegin", RCCnameInput)
    regionsformdiv.insertAdjacentElement("afterbegin", formTitle)

}

async function sendCicoForm(Cico, id, name) {
    
    var route = ""
    if (Cico == "city") {
        route = "cities"
    } else {
        route = "countries"
    }
    var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
    var RCCnameInput = document.querySelector("#RegionInput")
    var regionsformdiv = document.querySelector(".formdiv")
    var formTitler = document.querySelector("#formTitler")
    var submitButton = document.querySelector("#submitBTN")

    if (!name) {
        RCCnameInput.classList.add("border-danger")
        RCCnameInput.placeholder = "Complete this first!"
    } else {
        
        try {
            await fetch(`http://localhost:3000/${route}/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': jwtToken
                },
                body: JSON.stringify({ name: name })
            })
                .then(response => response.json())
                .then(response => {
                    if (response.operation) {
                        formTitler.textContent = `${Cico} added correctly!`
                        
                        RCCnameInput.remove()
                        submitButton.remove()

                        setTimeout(() => {
                            regionsformdiv.innerHTML = ""
                            regionspagesetter()
                        }, 1500);

                    } else {
                        formTitler.textContent = "Submit failed!, try again"
                        RCCnameInput.classList.add("border-danger")
                        RCCnameInput.value = ""
                        RCCnameInput.placeholder = "Check this data"
                    }
                })
        } catch (error) {
            console.error('Error:', error)
        }
    }
}


function addRegion() {
    var regionsformdiv = document.querySelector(".formdiv")

    regionsformdiv.innerHTML = " "

    var formTitle = document.createElement('h2');
    formTitle.id = "formTitler"
    formTitle.textContent = "Add a Region"


    var RCCnameInput = document.createElement("input")
    RCCnameInput.classList.add('form-control', "editdelete", "regioninput")
    RCCnameInput.id = `RegionInput`
    RCCnameInput.placeholder = `Region Name`


    var submitButton = document.createElement("div")
    submitButton.classList.add('btn', 'btn-danger', "submitregion")
    submitButton.id = `submitBTN`
    submitButton.textContent = `Submit`
    submitButton.addEventListener("click", () => {
        sendRegionForm(RCCnameInput.value)
    })
    regionsformdiv.insertAdjacentElement("afterbegin", submitButton)
    regionsformdiv.insertAdjacentElement("afterbegin", RCCnameInput)
    regionsformdiv.insertAdjacentElement("afterbegin", formTitle)

}


async function sendRegionForm(regionName) {
    var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
    var RCCnameInput = document.querySelector("#RegionInput")
    var regionsformdiv = document.querySelector(".formdiv")
    var formTitler = document.querySelector("#formTitler")
    var submitButton = document.querySelector("#submitBTN")

    if (!regionName) {
        RCCnameInput.classList.add("border-danger")
        RCCnameInput.placeholder = "Complete this first!"
    } else {
       
        try {
            await fetch("http://localhost:3000/regions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': jwtToken
                },
                body: JSON.stringify({ name: regionName })
            })
                .then(response => response.json())
                .then(response => {
                    if (response.operation) {
                        formTitler.textContent = "Region added correctly!"
                        
                        RCCnameInput.remove()
                        submitButton.remove()

                        setTimeout(() => {
                            regionsformdiv.innerHTML = ""
                            regionspagesetter()
                        }, 2000);

                    } else {
                        formTitler.textContent = "Submit failed!, try again"
                        RCCnameInput.classList.add("border-danger")
                        RCCnameInput.value = ""
                        RCCnameInput.placeholder = "Check this data"
                    }
                })

        } catch (error) {
            console.error('Error:', error)
        }
    }
}