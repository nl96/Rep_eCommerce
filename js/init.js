const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART2_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

  let userLogged = localStorage.getItem("eCommerce-User-Logged");
  if (userLogged){ // Si hay un usuario logueado muestro el menú desplegable de sesión en lugar de ingresar
    document.getElementById("signIn").remove();

    let itemUser = document.getElementById("itemUser");
    if (itemUser) {
      
      itemUser.innerHTML = `
      <button class="dropdown-toggle btn btn-dark border-dark shadow-none font-weight-bold py-2 d-none d-md-inline-block" type="button" id="dropdownUser" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ${JSON.parse(userLogged).name}
      </button>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownUser">
        <a class="dropdown-item btn btn-light rounded-0 shadow-none" href="cart.html">Mi carrito</a>
        <a class="dropdown-item btn btn-light rounded-0 shadow-none" href="my-profile.html">Mi perfil</a>
        <button class="dropdown-item btn btn-light rounded-0 shadow-none" type="button" id="LogOut">Cerrar sesión</button>
      </div>`

      itemUser.removeAttribute('hidden');
      itemUser.classList.add('dropdown');
    }

    document.getElementById("LogOut").addEventListener("click", function(){
      localStorage.removeItem("eCommerce-User-Logged");
      window.location = "index.html";
    });
  }

});