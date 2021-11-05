
var editTime;
var editerData
var editSocials;

async function contactFormSetter(edit, editData) {
       
        editTime = edit;
        editerData = editData
        var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
        pagereset()

        var title = "New Contact"
        if(edit){
                title=`Edit ${editData.fName} ${editData.lName}`
        }


        actualpage.innerHTML = `
        <div class="container-fluid formcontainerfluid">
        

        <div class="alerter"></div>
       


        <div class="row justify-content-between newContactTitle">

                <div class="col-4 mb-3">
                        <h2>${title}</h2>
                </div>
                <div class="col-4 text-right">
                    <i onclick="contactpagesetter()" class="fas fa-times"></i>
                </div>
        </div>

        <div class="row justify-content-between firstform">

                <div class="col">
                        <p class="labeler">First Name<span class="text-danger">*</span></p>
                        <input class="form-control  contactInputs" id="FirstNameInput" placeholder="First Name">
                </div>
                <div class="col">
                        <p class="labeler">Last Name<span class="text-danger">*</span></p>
                        <input class="form-control  contactInputs" id="LastNameInput" placeholder="Last Name">
                </div>
                <div class="col">
                        <p class="labeler">Job<span class="text-danger">*</span></p>
                        <input class="form-control  contactInputs" id="JobInput" placeholder="Job">
                </div>
                <div class="col">
                        <p class="labeler">Email<span class="text-danger">*</span></p>
                        <input class="form-control  contactInputs" id="EmailInput" placeholder="Email">
                </div>
                <div class="col">
                        <p class="labeler" id="selectCompanyPar">Company<span class="text-danger">*</span></p>
                </div>
        </div>

        <div class="row justify-content-between secondform" id="secondForm">

                <div class="col">
                        <p class="labeler" id="regionSelect">Region<span class="text-danger">*</span></p>
                </div>

                        <div class="col" id="countryInputDiv">
                        </div>
                        <div class="col" id="cityInputDiv">
                
                        </div>
               

                <div class="col">
                        <p class="labeler">Address<span class="text-danger">*</span></p>
                        <input class="form-control  contactInputs" id="addressInput" placeholder="Address">
                </div>
                <div class="col">
                        <p class="labeler" id="interestInputpar">Interest<span class="text-danger">*</span></p>
                        <select class="form-control selector" id="interestInput">
                        <option value="100">100%</option>
                        <option value="75">75%</option>
                        <option value="50">50%</option>
                        <option value="25">25%</option>
                        <option value="0">0%</option>
                        </select>


                </div>
        </div>
<br>
        <div class="row justify-content-end secondform" id="secondForm"> 
        <button type="button" onclick="contactpagesetter()" class="btn btn-secondary">Cancel</button>
        <button type="button" onclick="contactFormSender()"class="btn btn-primary saveContactBTN">Save Contact</button>
        </div>   

        </div>`

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
                        contactFormCompanySelect(res.companies)
                })

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
                        contactFormRegionSelect(res.regions)
                })


        if (edit) {
                document.querySelector("#FirstNameInput").value = editData.fName
                document.querySelector("#LastNameInput").value = editData.lName
                document.querySelector("#JobInput").value = editData.job
                document.querySelector("#EmailInput").value = editData.email
                document.querySelector("#addressInput").value = editData.address

                var interestSelect = document.getElementById('interestInput');

                for (var i, j = 0; i = interestSelect.options[j]; j++) {

                        if (i.value == editData.interest) {
                                interestSelect.selectedIndex = j;
                                break;
                        }
                }

                await fetch(`http://localhost:3000/editsocials/${editData.id}`, {
                        method: 'GET',
                        headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Authorization': jwtToken
                        }
                })
                        .then(res => res.json())
                        .then(res => {
                                editSocials = res.socials
                                
                        })

        }

        await fetch("http://localhost:3000/socials", {
                method: 'GET',
                headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': jwtToken
                }
        })
                .then(res => res.json())
                .then(res => {
                        contactFormSocialSelect(res.socials)
                })
}


async function contactFormCompanySelect(companies) {
       
        var selectCompanyPar = document.querySelector("#selectCompanyPar")

        var CompanySelector = document.createElement("select")
        CompanySelector.classList.add("form-control", "selector")
        CompanySelector.id = "companySelectorInput"
        CompanySelector.innerHTML = `<option value="" selected disabled hidden>Choose Company</option>`

        selectCompanyPar.insertAdjacentElement("afterend", CompanySelector)

        companies.map((company) => {
                var companyOption = document.createElement("option")
                companyOption.value = company.CompanyID
                companyOption.textContent = company.CompanyName
                CompanySelector.insertAdjacentElement("beforeend", companyOption)
        })

        if (editTime) {

                for (var i, j = 0; i = CompanySelector.options[j]; j++) {
                        if (i.value == editerData.company_id) {
                                CompanySelector.selectedIndex = j;
                                break;
                        }
                }
        }
}

async function contactFormRegionSelect(regions) {

        var selectCityDIV = document.querySelector("#cityInputDiv")

        var selectCompanyPar = document.querySelector("#regionSelect")
        var CompanySelector = document.createElement("select")

        CompanySelector.classList.add("form-control", "selector")
        CompanySelector.id = "regionSelectorInput"
        CompanySelector.innerHTML = `<option value="" selected disabled hidden>Choose Region</option>`

        selectCompanyPar.insertAdjacentElement("afterend", CompanySelector)

        regions.map((region) => {
                var companyOption = document.createElement("option")
                companyOption.value = region.id
                companyOption.textContent = region.name
                companyOption.addEventListener("click", () => {
                        contactFormCountrySelect(region.id)
                        selectCityDIV.innerHTML = `<p class="labeler">City<span class="text-danger">*</span></p>`
                })
                CompanySelector.insertAdjacentElement("beforeend", companyOption)
        })


        if(editTime){
                for (var i, j = 0; i = CompanySelector.options[j]; j++) {
                        if (i.value == editerData.regionID) {
                                contactFormCountrySelect(editerData.regionID)
                                CompanySelector.selectedIndex = j;
                                break;
                        }
                }
        }
}




async function contactFormCountrySelect(Regionid) {
        var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));

        var selectCountryDIV = document.querySelector("#countryInputDiv")
        selectCountryDIV.innerHTML = `<p class="labeler">Country<span class="text-danger">*</span></p>`

        var CountrySelector = document.createElement("select")

        CountrySelector.classList.add("form-control", "selector")
        CountrySelector.id = "CountrySelectorInput"
        CountrySelector.innerHTML = `<option value="" selected disabled hidden>Choose Country</option>`

        selectCountryDIV.insertAdjacentElement("beforeend", CountrySelector)


        await fetch(`http://localhost:3000/countries/${Regionid}`, {
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
                                var companyOption = document.createElement("option")
                                companyOption.value = country.id
                                companyOption.textContent = country.name
                                companyOption.addEventListener("click", () => {
                                        contactFormCitySelect(country.id)
                                })
                                CountrySelector.insertAdjacentElement("beforeend", companyOption)
                        })
                })

                if(editTime){
                        for (var i, j = 0; i = CountrySelector.options[j]; j++) {
                                if (i.value == editerData.countryID) {
                                        contactFormCitySelect(editerData.countryID)
                                        CountrySelector.selectedIndex = j;
                                        break;
                                }
                        }
                }
}



async function contactFormCitySelect(countryid) {
        var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));

        var selectCityDIV = document.querySelector("#cityInputDiv")
        selectCityDIV.innerHTML = ` <p class="labeler">City<span class="text-danger">*</span></p>`
        var CitySelector = document.createElement("select")

        CitySelector.classList.add("form-control", "selector")
        CitySelector.id = "CitySelectorInput"
        CitySelector.innerHTML = `<option value="" selected disabled hidden>Choose City</option>`

        selectCityDIV.insertAdjacentElement("beforeend", CitySelector)


        await fetch(`http://localhost:3000/cities/${countryid}`, {
                method: 'GET',
                headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': jwtToken
                }
        })
                .then(res => res.json())
                .then(res => {
                        res.cities.map((city) => {

                                var companyOption = document.createElement("option")
                                companyOption.value = city.id
                                companyOption.textContent = city.name

                                CitySelector.insertAdjacentElement("beforeend", companyOption)
                        })
                })

                if(editTime){
                        for (var i, j = 0; i = CitySelector.options[j]; j++) {
                                if (i.value == editerData.city_id) {
                                        CitySelector.selectedIndex = j;
                                        break;
                                }
                        }
                }
}


function contactFormSocialSelect(socials) {
        socials.map((social) => {
                
                var secondFormDIV = document.querySelector("#secondForm")
                var socialFormDiv = document.createElement("div")
                
                socialFormDiv.classList.add("row", "justify-content-start", "secondform")
                socialFormDiv.innerHTML = `
                <br>
                <div class="col-3">
                        <p class="labeler">${social.name}</p>
                        <input class="form-control  contactInputs" id="${social.name}account" placeholder="Account/Number">
                </div>
                <div class="col-3">
                        <p class="labeler" id="preferencelabel">Preference</p>
                        <select class="form-control selector" id="${social.name}pref">
                        <option value="No Preferences">No Preferences</option>
                        <option value="Favorite">Favorite</option>
                        <option value="Do not disturb">Do not disturb</option>
                        </select>
                </div>
                `

                secondFormDIV.insertAdjacentElement("afterend", socialFormDiv)
        })


        if (editTime) {
                document.querySelector("#Facebookaccount").value = editSocials[3].account
                document.querySelector("#Linkedinaccount").value = editSocials[2].account
                document.querySelector("#Instagramaccount").value = editSocials[1].account
                document.querySelector("#Whatsapp_phoneaccount").value = editSocials[0].account

                for (var i, j = 0; i = document.querySelector("#Facebookpref").options[j]; j++) {
                        if (i.value == editSocials[3].preference) {
                                document.querySelector("#Facebookpref").selectedIndex = j;
                                break;
                        }
                }
                for (var i, j = 0; i = document.querySelector("#Linkedinpref").options[j]; j++) {
                        if (i.value == editSocials[2].preference) {
                                document.querySelector("#Linkedinpref").selectedIndex = j;
                                break;
                        }
                }
                for (var i, j = 0; i =  document.querySelector("#Instagrampref").options[j]; j++) {
                        if (i.value == editSocials[1].preference) {
                                document.querySelector("#Instagrampref").selectedIndex = j;
                                break;
                        }
                }
                for (var i, j = 0; i =  document.querySelector("#Whatsapp_phonepref").options[j]; j++) {
                        if (i.value == editSocials[0].preference) {
                                document.querySelector("#Whatsapp_phonepref").selectedIndex = j;
                                break;
                        }
                }

        }
}

async function contactFormSender() {
        var FirstNameInput = document.querySelector("#FirstNameInput")
        var LastNameInput = document.querySelector("#LastNameInput")
        var JobInput = document.querySelector("#JobInput")
        var EmailInput = document.querySelector("#EmailInput")
        var companySelectorInput = document.querySelector("#companySelectorInput")
        try {
                var CitySelectorInput = document.querySelector("#CitySelectorInput")
                var addressInput = document.querySelector("#addressInput")
                var interestInput = document.querySelector("#interestInput")
                var Facebookaccount = document.querySelector("#Facebookaccount")
                var Linkedinaccount = document.querySelector("#Linkedinaccount")
                var Instagramaccount = document.querySelector("#Instagramaccount")
                var Whatsapp_phoneaccount = document.querySelector("#Whatsapp_phoneaccount")

                var Facebookpref = document.querySelector("#Facebookpref")
                var Linkedinpref = document.querySelector("#Linkedinpref")
                var Instagrampref = document.querySelector("#Instagrampref")
                var Whatsapp_phonepref = document.querySelector("#Whatsapp_phonepref")

                if (FirstNameInput.value && LastNameInput.value && JobInput.value && EmailInput.value &&
                        companySelectorInput.value && CitySelectorInput.value && addressInput.value && interestInput.value) {


                        try {
                                var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
                                var route="http://localhost:3000/contacts"
                                var methoder="POST"
                                if(editTime){
                                        route=`http://localhost:3000/contacts/${editerData.id}`
                                        methoder="PUT"
                                      
                                }
                                await fetch(route, {
                                        method: methoder,
                                        headers: {
                                                'Content-Type': 'application/json',
                                                'Access-Control-Allow-Origin': '*',
                                                'Authorization': jwtToken
                                        },
                                        body: JSON.stringify({
                                                fName: FirstNameInput.value,
                                                lName: LastNameInput.value,
                                                job: JobInput.value,
                                                email: EmailInput.value,
                                                companyid: companySelectorInput.value,
                                                cityid: CitySelectorInput.value,
                                                address: addressInput.value,
                                                interest: interestInput.value,
                                                faceAcc: Facebookaccount.value,
                                                facePref: Facebookpref.value,
                                                linkAcc: Linkedinaccount.value,
                                                linkPref: Linkedinpref.value,
                                                instaAcc: Instagramaccount.value,
                                                instaPref: Instagrampref.value,
                                                whatAcc: Whatsapp_phoneaccount.value,
                                                whatPref: Whatsapp_phonepref.value
                                        })
                                })
                                        .then(response => response.json())
                                        .then(response => {
                                                if (response.operation == 1) {

                                                        if(editTime){
                                                                contactalert("Edited Contact Correctly", 1500,1)
                                                        }else{
                                                                contactalert("Added Contact Correctly", 1500,1)
                                                        }

                                                        
                                                        setTimeout(() => {
                                                                contactpagesetter()
                                                        }, 1500);
                                                } else {
                                                        contactalert("Error, check your data", 3500)
                                                }
                                        })
                        } catch (error) {
                                console.error('Error:', error)
                        }

                } else {
                        contactalert("COMPLETE ALL FIELDS", 3500)
                }
        } catch (error) {
                contactalert("COMPLETE ALL FIELDS", 3500)
        }
}


function contactalert(message, time,green) {
        var alerterdiv = document.querySelector(".alerter")
        var color="alert-danger"
        if(green){
                color= "alert-success"
        }
        alerterdiv.innerHTML = `<div class="alert ${color}" role = "alert">${message}</div >`
        
        setTimeout(() => {
                alerterdiv.innerHTML = ""
        }, time);
}