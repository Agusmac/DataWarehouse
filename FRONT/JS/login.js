
const actualpage = document.querySelector("#actualpage")
const loginform = document.querySelector(".form-signin")
const loginbutton = document.querySelector(".signbut")
const loginEmail = document.querySelector("#loginEmail")
const inputPassword = document.querySelector("#inputPassword")
const welcometitle = document.querySelector("#welcometitle")

const loginpage = document.querySelector("#loginpage")
const navbar = document.querySelector(".navbar")

loginbutton.addEventListener("click", async function (event) {
    event.preventDefault()
    
    try {
        await fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: loginEmail.value, password: inputPassword.value })
        })
            .then(response => response.json())
            .then(response => {
                loginChecker(response)
            })
    } catch (error) {
        console.error('Error:', error)
    }
});

function loginChecker(res) {
    
    if (res.userstate == 2 || res.userstate == 1) {
        localStorage.setItem("dataJWT", JSON.stringify(res.jwttoken))
        localStorage.setItem("userAccess", JSON.stringify(res.userstate))
        
        navbarsetter(res.userstate)
    }
    else {
        
        loginEmail.classList.add("border-danger");
        inputPassword.classList.add("border-danger");
        
        welcometitle.textContent = "User or password do not match, try again"
        welcometitle.classList.add("text-danger");

    }
}

function navbarsetter(userstate) {

    const navlinks = document.createElement('div');
    navlinks.classList.add('links');

    if (userstate == 2) {
        navlinks.innerHTML = `
        <ul>
          <li id="contacts-link"  onclick="contactpagesetter()">Contacts</li>
          <li id="companies-link" onclick="companiespagesetter()">Companies</li>
          <li id="users-link" onclick="userspagesetter()">Users</li>
          <li id="regions-link" onclick="regionspagesetter()">Region/City</li>
        </ul>
      `
    } else {
        navlinks.innerHTML = `
        <ul>
        <li id="contacts-link"  onclick="contactpagesetter()">Contacts</li>
        <li id="companies-link" onclick="companiespagesetter()">Companies</li>
        <li id="regions-link" onclick="regionspagesetter()">Region/City</li>
        </ul>
      `
    }
    navbar.insertAdjacentElement("beforeend", navlinks)
    contactpagesetter()
}

function pagereset() {
    actualpage.innerHTML = ""
}