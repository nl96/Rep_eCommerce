cartArray = [];
let shippingPercentage = 15;

let symbolConvert = "$";
let MONEY_PESO_SYMBOL = "$";
let MONEY_DOLLAR_SYMBOL = "U$S";

let currencyConvert = "UYU";
let DOLLAR_SYMBOL = "USD";
let PESO_SYMBOL = "UYU";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";

//=============================================================================================
// Conversor de divisas
//=============================================================================================

function convertMoney(coin, quantity, coinOut) {
  const dollarTradingUYU = 40;
  if (coin == coinOut) {
    return quantity;
  }
  switch (coin) {
    case "USD":
      if (coinOut == "UYU") {
        return quantity * dollarTradingUYU;
      }
    case "UYU":
      if (coinOut == "USD") {
        return quantity / dollarTradingUYU;
      }
    default:
      return undefined;
  }
}

//=============================================================================================
// Convierte a formato de precio
//=============================================================================================

function numToPrice(value) {
  let num = value.toString().split(".");

  let price = num[0].toString().split("");
  for (let i = price.length - 3; i > 0; i=i-3) {
    price.splice(i, 0, ".");
  }

  num[0] = price.join("")
  return symbolConvert + "&nbsp;" + num.join();
}

//=============================================================================================
// Retorna 1 si no es un número positivo, sino lo retorna tal cual o sin cifras decimales
//=============================================================================================

function onlyFactor(value){
    let mult = parseInt(value);
    if (!(mult > 0)) {
        mult = 1
    };
    return mult
}

//=============================================================================================
// Costo de envío
//=============================================================================================

function setShippingPercentage() {
  let shipping = document.getElementsByName("shippingType");
  for (let i = 0; i < shipping.length; i++) {

    if (shipping[i].checked) {
      let value = shipping[i].value;

      if (value == "premium") {
        shippingPercentage = 15;
      } else if (value == "express") {
        shippingPercentage = 7;
      } else if (value == "standard") {
        shippingPercentage = 5;
      }
    }
  }
}

//=============================================================================================
// Actualiza cálculos
//=============================================================================================

function updateCalc() {

  // Conversión de Moneda 
  let setCurrency = document.getElementById("productCurrency").value;
  if (setCurrency == DOLLAR_CURRENCY) {
    currencyConvert = DOLLAR_SYMBOL;
    symbolConvert = MONEY_DOLLAR_SYMBOL
  } 
  else if (setCurrency == PESO_CURRENCY) {
    currencyConvert = PESO_SYMBOL;
    symbolConvert = MONEY_PESO_SYMBOL
  }

  //----------------------------------------------------------------------------------------------------

  let inputsQtyName = document.getElementsByName("qty");
  let sumTotal = 0;
  for (let i = 0; i < inputsQtyName.length; i++) {
    sumTotal += convertMoney(cartArray[i].currency, cartArray[i].unitCost, currencyConvert) * onlyFactor(inputsQtyName[i].value);
    
    // Precio por cantidad
    let result = document.getElementsByName("result"+i)[0];
    let price = convertMoney(cartArray[i].currency, cartArray[i].unitCost, currencyConvert);
    result.innerHTML = numToPrice(price * onlyFactor(inputsQtyName[i].value));
  }
  // Subtotal
  let subtotal = document.getElementById("subtotal");
  subtotal.innerHTML = numToPrice(sumTotal);

  // Costo Subtotal
  let subtotalCost = document.getElementById("subtotalCostText");
  subtotalCost.innerHTML = numToPrice(sumTotal);

  // Costo de Envío
  setShippingPercentage()
  let shippingCost = document.getElementById("shippingCostText");
  let percentagecost = sumTotal * shippingPercentage / 100;
  shippingCost.innerHTML = numToPrice(percentagecost);
  
  // Costo Total
  let totalCost = document.getElementById("totalCostText");
  totalCost.innerHTML = numToPrice(sumTotal + percentagecost);
  
  // Costo Total Modal Btn
  let totalCostModal = document.getElementById("totalCostModalText");
  totalCostModal.innerHTML = numToPrice(sumTotal + percentagecost);
  
}

//=============================================================================================
// Muestra los productos agregados al carrito
//=============================================================================================

function showCartList(){
    let cart = cartArray;
    let listCart = document.getElementById("listCart");
    let htmlContentToAppend = "";
    
    if (cart.length > 0) {
      for(let i = 0; i < cart.length; i++){
          let item = cart[i];

          htmlContentToAppend += `
          <li class="list-group-item">
            <div class="row">
    
              <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 mx-auto">
                <img src="${item.src}" alt="xc" class="img-thumbnail mx-auto d-block">
              </div>
    
              <div class="col-12 col-sm align-self-stretch d-flex flex-column">

                <div class="d-flex w-100 justify-content-between">
                  <h5 class="my-1">${item.name}</h5>
                  <button id="eraseBtn" type="button" onclick="eraseItem(${i})" aria-label="Remover artículo" class="btn btn-light align-self-start rounded-circle py-2" title="Remover artículo"><i class="far fa-trash-alt text-dark"></i></button>
                </div>

                <div class="d-flex w-100">
                  <span class="mb-1 mt-2">${item.currency} ${item.unitCost}</span>
                </div>

                <div class="mt-auto">
                  <div class="row align-items-center justify-content-between">
                    <div class="col-auto col-sm-7 col-md-7 col-lg-6 col-xl-5 pr-0">
                      <div class="row no-gutters">
                        <div class="col-auto form-inline">
                          <label for="qty${i}" class="pr-2">Cantidad</label>
                        </div>
                        <div class="col-5 col-sm-6 col-md-5 col-lg-6 col-xl-6">
                          <input type="number" class="form-control" id="qty${i}" name="qty" required size="6" value="${item.count}" min="1" max="1000" oninput="updateCalc()">
                        </div>
                      </div>
                    </div>
                    <div class="col pl-0 text-right">
                      <span id="productCostText" class="text-muted"><output name="result${i}" for="qty${i}">${numToPrice(convertMoney(item.currency, item.unitCost, currencyConvert))}</output></span>
                    </div>
                  </div>
                </div>

              </div>
    
            </div>
          </li>`;

          listCart.innerHTML = htmlContentToAppend;
      }

      let subTotalFor = `qty${Object.keys(cart).join(' qty')}`;

      // Subtotal
      let htmlContentToAppendEnd = `
      <li class="list-group-item d-flex justify-content-between">
        <span>Subtotal ($)</span>
        <strong><output id="subtotal" name="subtotal" for="${subTotalFor}">-</output></strong>
      </li>`
      listCart.innerHTML += htmlContentToAppendEnd;
      
      // Costo Subtotal
      let subtotalCost = document.getElementById("productsCost");
      subtotalCost.innerHTML = `<output id="subtotalCostText" name="subtotalCostText" for="${subTotalFor}">-</output>`
      
      // Costo de Envío
      let shippingCost = document.getElementById("shippingCost");
      shippingCost.innerHTML = `<output id="shippingCostText" name="shippingCostText" for="${subTotalFor} premiumRadio expressRadio standardRadio">-</output>`
      
      // Costo Total
      let totalCost = document.getElementById("totalCost");
      totalCost.innerHTML = `<output id="totalCostText" name="totalCostText" for="${subTotalFor} premiumRadio expressRadio standardRadio">-</output>`
      
      // Costo Total Modal Btn
      let totalCostModal = document.getElementById("totalCostModal");
      totalCostModal.innerHTML = `Pagar <output id="totalCostModalText" name="totalCostModalText" class="pl-1" for="${subTotalFor} premiumRadio expressRadio standardRadio">-</output>`
      
      //----------------------------------------------------------------------------------------------------
      
      setShippingPercentage()
      updateCalc();
  
    } else {
      let containerCart = document.getElementById("containerCart");
      containerCart.innerHTML = htmlContentToAppend;
    }
}

//=============================================================================================
// Elimina un artículo del carrito
//=============================================================================================

function eraseItem(num) {
  cartArray.splice(num, 1);
  console.log(cartArray);
  showCartList();
}

//=============================================================================================
// Muestra los campos correspondiente al método de pago seleccionado
//=============================================================================================

function payOpt(){
  document.getElementById('btnGroupToggle').classList.remove('is-invalid');
  // Listas de campos para habilitar o deshabilitar según la opción elejida
  let cardInputs = ["cardNumber", "cardExpiry", "cardCvc", "cardName"];
  let bankInputs = ["bankName", "bankAccoun"];
  function ifDisabled(inputs, boolean) {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (boolean) {
        document.getElementById(input).setAttribute("disabled", boolean);
      } else if (boolean == false){
        document.getElementById(input).removeAttribute("disabled");
      }
    }
  }
  // Muentro los campos correspondientes a la opción elegida
  let cardOpt = document.getElementById("cardOpt");
  let bankOpt = document.getElementById("bankOpt");
  if (document.getElementById("cardInput").checked) {
    
    cardOpt.classList.remove("d-none");
    ifDisabled(cardInputs, false);

    bankOpt.classList.add("d-none");
    ifDisabled(bankInputs, true);
    
  } else if (document.getElementById("bankInput").checked){

    bankOpt.classList.remove("d-none");
    ifDisabled(bankInputs, false);

    cardOpt.classList.add("d-none");
    ifDisabled(cardInputs, true);
  }
};

//=============================================================================================
// Función que se ejecuta una vez que se haya lanzado el evento de que el documento 
// se encuentra cargado, es decir, se encuentran todos los elementos HTML presentes.
//=============================================================================================

document.addEventListener("DOMContentLoaded", function(e){

  getJSONData(CART2_INFO_URL).then(function(resultObj){
      if (resultObj.status === "ok") {

          cartArray = resultObj.data.articles;

          // Muestra los productos agregados al carrito
          showCartList();
      }
  });

  //----------------------------------------------------------------------------------------------------

  // Alerta si los campos requeridos son incorrectos
  let inputs = document.getElementsByClassName('form-control');
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    input.addEventListener("invalid", function(event){
      if ( ! event.target.validity.valid ) {
          input.classList.add('is-invalid');
      }
    });
    input.addEventListener("input", function(event){
      if ( event.target.validity.valid ) {
        input.classList.remove('is-invalid');
      }
    });
  }
  
  // Alerta si no selecciona un medio de pago
  let payOptions = document.getElementById('cardInput');
  payOptions.addEventListener("invalid", function(event){
      if ( ! event.target.validity.valid ) {
        document.getElementById('btnGroupToggle').classList.add('is-invalid');
      }
    });
  payOpt()
  
  //----------------------------------------------------------------------------------------------------
  
  document.getElementById('cart-info').addEventListener('submit', function(e) {
    // Abro el modal de pago
    $('#staticBackdropPay').modal('show');

    // Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador)
    if (e.preventDefault) e.preventDefault();
    return false;
  });

  document.getElementById('formPay').addEventListener('submit', function(e) {
    document.getElementById('totalCostModal').innerHTML = "Procesando..."

    getJSONData(CART_BUY_URL).then(function(resultObj){
        if (resultObj.status === "ok") {
          // Cierro el modal de pago
          $('#staticBackdropPay').modal('hide');

          // Muestra mensaje de confirmación
          document.getElementById('mainCart').innerHTML = `
          <div class="alert-success rounded-lg px-4 py-3 my-5" role="alert">
            <h4 class="alert-heading">${resultObj.data.msg}</h4>
            <p>Recuerda que recibirás un mensaje de confirmación a su correo electrónico con los detalles de la compra.</p>
            <hr>
            <p class="mb-0">Ante cualquier duda, consulta o inconveniencia contactese con nuestro servicio de atención al cliente.</p>
          </div>`
        }
    });
    // Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador)
    if (e.preventDefault) e.preventDefault();
    return false;
  });

});