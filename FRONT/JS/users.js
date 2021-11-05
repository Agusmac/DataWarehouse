function userspagesetter() {
  pagereset()
 
  actualpage.innerHTML = `
    <form class="form-signin">
      
      <h1 id="createusertitle" class="h3 mb-3 font-weight-normal text-center">Create a new user</h1>
    
      <input type="fName" id="registerfname" name="fName" class="form-control top" placeholder="First Name" required>
      <input type="lName" id="registerlname" name="lName" class="form-control middle" placeholder="Last Name" required>
      <input type="email" id="registeremail" name="email" class="form-control middle" placeholder="Email" required>
      <input type="Username" id="registerusername" name="Username" class="form-control middle" placeholder="Username" required>
    
        <input type="password" id="registerPassword" class="form-control middle" placeholder="Password" required>
        <select class="form-control bottom" id="roleInput">
        <option value="0">User</option>
        <option value="1">Admin</option>
        </select>

      <button class="btn btn-lg signbut btn-block" type="submit" onclick="event.preventDefault(); registerNewUser();">register</button>
      
      
    </form>`


}

var registerfname ;
var registerlname ;
var registeremail ;
var registerusername;
var registerPassword;


async function registerNewUser() {

   registerfname = document.querySelector("#registerfname")
   registerlname = document.querySelector("#registerlname")
   registeremail = document.querySelector("#registeremail")
   registerusername = document.querySelector("#registerusername")
   registerPassword = document.querySelector("#registerPassword")
   roleInput=document.querySelector("#roleInput")
 
  try {
    var jwtToken = JSON.parse(localStorage.getItem("dataJWT"));
    await fetch("http://localhost:3000/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': jwtToken
    },
      body: JSON.stringify({fName: registerfname.value, lName: registerlname.value, username: registerusername.value, email: registeremail.value, password: registerPassword.value,admin:roleInput.value})
    })
    .then(res => res.json())
    .then(res => {
        registerchecker(res.operation)
    })

  } catch (error) {
    console.error('Error:', error)
  }

}


function registerchecker(operation){
  const createusertitle=document.querySelector("#createusertitle")
  if(operation){
   createusertitle.textContent = "User added successfully!"
   try {
    createusertitle.classList.remove("text-danger");
    registerfname.classList.remove("border-danger");
    registerlname.classList.remove("border-danger");
    registeremail.classList.remove("border-danger");
    registerusername.classList.remove("border-danger");
    registerPassword.classList.remove("border-danger");

    registerfname.value="" ;
    registerlname.value=""  ;
    registeremail.value=""  ;
    registerusername.value="" ;
    registerPassword.value="" ;

   } catch (error) {
     console.log(error)
   }
 
  }else{
    createusertitle.textContent = "Register failed, check your data"
    createusertitle.classList.add("text-danger");
    registerfname.classList.add("border-danger");
    registerlname.classList.add("border-danger");
    registeremail.classList.add("border-danger");
    registerusername.classList.add("border-danger");
    registerPassword.classList.add("border-danger");
  }
}