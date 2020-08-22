//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    let inputName = document.getElementById("userName");
    let inputPassword = document.getElementById("userPassword");
    let submit = document.getElementById("submit");

    // Completo automáticamente el campo nombre y redirecciono si esta abierta la sesión
    let userLogged = localStorage.getItem("User-Logged");
    if (userLogged){
        inputName.value = JSON.parse(userLogged).name;  
        inputName.setAttribute("disabled", true);
        inputPassword.setAttribute("disabled", true);
        submit.setAttribute("disabled", true);
        submit.innerText = "Ingresando...";
        window.location = "home.html";
    }

    submit.addEventListener("click", function(e){
        let inputsOccupied = true;
    
        if (inputName.value === "" || inputPassword.value === ""){
            inputsOccupied = false;
        }
    
        let invalid = document.getElementById("invalid");

        if (inputsOccupied){
            localStorage.setItem("User-Logged", JSON.stringify({name: userName.value}));
            invalid.innerHTML = "";
            window.location = "home.html";
        } else {
            invalid.innerHTML = `
                <div class="alert alert-danger" role="alert" style="position: relative; width:auto; top: 0;">
                    <p class="mb-0">Usuario y contraseña que ingresaste no son válidos. Por favor, revisa e inténtalo de nuevo.</p>
                </div>
            `;
        }

    });

});