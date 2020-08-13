//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

    document.getElementById("submit").addEventListener("click", function(e){
        let inputEmail = document.getElementById("userName");
        let inputPassword = document.getElementById("userPassword");
        let inputsOccupied = true;
    
        if (inputEmail.value === "" || inputPassword.value === ""){
            inputsOccupied = false;
        }
    
        let invalid = document.getElementById("invalid");

        if (inputsOccupied){
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