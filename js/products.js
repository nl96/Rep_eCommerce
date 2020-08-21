var productsArray = [];

var minCost = undefined;
var maxCost = undefined;

var currentSortCriteria = undefined;
const ORDER_ASC_BY_PRICE = "AscPrice";
const ORDER_DESC_BY_PRICE = "DescPrice";
const ORDER_DESC_BY_SOLD = "DescSold";

function showProductsList(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let products = array[i];

        if ((minCost == undefined || (minCost != undefined && minCost <= parseInt(products.cost))) && 
            (maxCost == undefined || (maxCost != undefined && maxCost >= parseInt(products.cost)))) {

            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + products.imgSrc + `" alt="` + products.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ products.name +`</h4>
                            <small class="text-muted">` + products.soldCount + ` vendidos</small>
                        </div>
                        <p class="mb-1">` + products.description + `</p>
                        <div class="d-flex w-100">
                            <span class="h4 mb-1 mt-2 font-weight-bolder">`+ products.currency +" "+ products.cost + `</span>
                        </div>
                    </div>
                </div>
            </a>
            `
        }

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_SOLD){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    // Devuelvo lista ordenada
    return result;
}

function sortAndShowProducts(sortCriteria){
    currentSortCriteria = sortCriteria;
    productsArray = sortProducts(sortCriteria, productsArray);
    // Muestro los productos ordenados
    showProductsList(productsArray);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productsArray = resultObj.data;
            // Muestro los productos ordenados por relevancia desde un principio
            sortAndShowProducts(ORDER_DESC_BY_SOLD);
        }
    });
    

    document.getElementById("rangeFilterCost").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

        showProductsList(productsArray);
    });
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList(productsArray);
    });

    // Botón de ordenar precio con doble funcionalidad
    document.getElementById("sortByCost").addEventListener("click", function(){
        sortBySold = document.getElementById("sortByCost").getElementsByTagName("i")[0];
        
        if ((currentSortCriteria === ORDER_ASC_BY_PRICE) || (currentSortCriteria === ORDER_DESC_BY_PRICE)){
            
            sortBySold.classList.toggle("fa-sort-amount-up");
            sortBySold.classList.toggle("fa-sort-amount-down");

            if (sortBySold.classList.contains("fa-sort-amount-up")){
                sortAndShowProducts(ORDER_ASC_BY_PRICE);
            }
            else if  (sortBySold.classList.contains("fa-sort-amount-down")){
                sortAndShowProducts(ORDER_DESC_BY_PRICE);
            }
        } else {
            if (sortBySold.classList.contains("fa-sort-amount-up")){
                sortAndShowProducts(ORDER_ASC_BY_PRICE);
            }
            else if  (sortBySold.classList.contains("fa-sort-amount-down")){
                sortAndShowProducts(ORDER_DESC_BY_PRICE);
            }
        }
    });
    document.getElementById("sortBySold").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_SOLD);
    });
});