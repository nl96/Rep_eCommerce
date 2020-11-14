const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART2_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const CART_PURCHASE_URL = "/cart/purchase";

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

var postJSONData = function(url, obj){
  var result = {};
  showSpinner();
  return fetch(url, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(obj)
  })
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

    let itemUser = document.getElementById("itemUser");
    if (itemUser) {
      
      itemUser.innerHTML = `
      <a class="d-block p-0 pr-3 nav-link dropdown-toggle font-weight-bold" href="" id="dropdownUser" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span id="dropdownUserName" class="px-0 pl-md-2 py-2">${JSON.parse(userLogged).name}</span></a>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownUser">
        <a class="dropdown-item btn btn-light rounded-0 shadow-none" href="cart.html">Mi carrito</a>
        <a class="dropdown-item btn btn-light rounded-0 shadow-none" href="my-profile.html">Mi perfil</a>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item btn btn-light rounded-0 shadow-none" type="button" id="LogOut">Cerrar sesión</button>
      </div>`

      itemUser.classList.add('active');
      itemUser.classList.add('dropdown');
    }

    document.getElementById("LogOut").addEventListener("click", function(){
      localStorage.removeItem("eCommerce-User-Logged");
      window.location = "index.html";
    });
  }

});