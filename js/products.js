var productsArray = [];

var minCost = undefined;
var maxCost = undefined;

var currentSortCriteria = undefined;
const ORDER_ASC_BY_PRICE = "AscPrice";
const ORDER_DESC_BY_PRICE = "DescPrice";
const ORDER_DESC_BY_SOLD = "DescSold";

let currentStructure = "gridView";

let termSearch = undefined;

//=============================================================================================
// Crea una matriz de claves
//=============================================================================================

function stringToArray(string) {

    let stringNoTab = string.trim().replaceAll("\11", " ") // Reemplazo "horizontal tab" por "space"
    // Divide la cadena por espacio, obteniendo una matriz de cadenas
    let words = [];
    if (stringNoTab.includes(" ")) {
        words = stringNoTab.split(" ");
    } else {
        words.push(stringNoTab);
    }
    // Quita las cadenas vacias de la matriz
    let wordsOnli = [];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word != "") {
            wordsOnli.push(word.trim());
        }
    }
    // Retorna matriz
    return wordsOnli;
}

//=============================================================================================
// Quita el signo diacrítico (tilde, diéresis y virgulilla) de las letras
//=============================================================================================

function removeDiacritics(text) {
    let cadena = text;
    var mapDiacriticsObj = {
        Á:"A", á:"a",
        É:"E", é:"e",
        Í:"I", í:"i",
        Ó:"O", ó:"o",
        Ú:"U", ú:"u",
        Ü:"U", ü:"u",
        Ñ:"N", ñ:"n",
    };
    var keys = new RegExp(Object.keys(mapDiacriticsObj).join("|"), "g");
    cadena = cadena.replace(keys, function (letra) {
        return mapDiacriticsObj[letra];
    });
    return cadena;
}

//=============================================================================================
// Combrueba existencia de dichas claves
//=============================================================================================

function searching(titleText, paragraphText, search) {

    let keysOnli = stringToArray(search);
    let blockText = titleText + " " + paragraphText;
    let contWords = true;

    for (let i = 0; i < keysOnli.length; i++) {
        const word = keysOnli[i];
        // Busqueda general
        if (blockText.toLowerCase().indexOf(word.toLowerCase()) == -1) {
            // Buscar sin diacrítico
            if (removeDiacritics(blockText).toLowerCase().indexOf(word.toLowerCase()) == -1) {
                // Sin resultados (Si buscas "Té" no querrás que te muestre cualquier resultado con "te")
                contWords = false;
            }
        }
    }
    return contWords;
}

//=============================================================================================
// Destaca las coincidencias visualmente
//=============================================================================================

function boldWordsSearch(blockText, term) {

    if (term != undefined) {
        let words = stringToArray(term);
        let textToBold = blockText;

        //----------------------------------------------------------------------------------------------------

        // Catura palabras en distintas combinaciones
        let metaWords = [];
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            let pTx = blockText.indexOf(word);
            let PTxLw = blockText.toLowerCase().indexOf(word.toLowerCase());
            let pTxRmLw = blockText.toLowerCase().indexOf(removeDiacritics(word.toLowerCase()));
            let pRm = removeDiacritics(blockText).indexOf(word);
            let pRmLw = removeDiacritics(blockText.toLowerCase()).indexOf(word.toLowerCase());

            if (pTx != -1) {
                metaWords[metaWords.length] = { key: word, lengthKey: word.length, pos: pTx };
            }
            if (PTxLw != -1) {
                metaWords[metaWords.length] = { key: word.toLowerCase(), lengthKey: word.length, pos: PTxLw };
            }
            if (pTxRmLw != -1) {
                metaWords[metaWords.length] = { key: removeDiacritics(word.toLowerCase()), lengthKey: word.length, pos: pTxRmLw };
            }
            if (pRm != -1) {
                metaWords[metaWords.length] = { key: blockText.slice(pRm, pRm + word.length), lengthKey: word.length, pos: pRm };
            }
            if (pRmLw != -1) {
                metaWords[metaWords.length] = { key: blockText.slice(pRmLw, pRmLw + word.length), lengthKey: word.length, pos: pRmLw };
            }
        }

        //----------------------------------------------------------------------------------------------------

        if(metaWords.length > 1){
            // Filtra todas las cadenas iguales
            let deleteDupPos = []
            for (let i = 0; i < metaWords.length; i++) {
                const key = metaWords[i].key;
                const pos = metaWords[i].pos;

                if (deleteDupPos.length > 0) {
                    if (deleteDupPos[deleteDupPos.length - 1].key != key && deleteDupPos[deleteDupPos.length - 1].pos != pos) {
                        deleteDupPos.push(metaWords[i]);
                    }
                } else {
                    deleteDupPos.push(metaWords[i]);
                }
            }
            
            // Ordena la matriz por lugar de posición de forma ascendente.
            // Buscara desde las primeras palabras, recorrera del inicio al final.
            // (pero despues de ordenarse por longitud prevalecerá para cadenas de igual longitud).
            let ordPosWords = [];
            ordPosWords = deleteDupPos.sort(function (a, b) {
                if (a.pos < b.pos) { return -1; }
                if (a.pos > b.pos) { return 1; }
                return 0;
            });

            // Une palabras que se solapan
            let joinWords = [];
            for (let i = 0; i < ordPosWords.length; i++) {

                const word1 = ordPosWords[i];
                const word2 = ordPosWords[a = 1 + i];

                if (joinWords.length > 0 && word2 != undefined) {
                    let lastWord = joinWords[joinWords.length - 1];

                    if (lastWord.pos <= word2.pos &&
                        lastWord.pos + lastWord.lengthKey > word2.pos &&
                        lastWord.pos + lastWord.lengthKey <= word2.pos + word2.lengthKey) {

                        joinWord = lastWord.key.slice(0, (word2.pos - lastWord.pos)) + word2.key;

                        joinWords.pop();
                        joinWords.push({ key: joinWord, lengthKey: joinWord.length, pos: lastWord.pos });
                    } else {
                        joinWords.push(word2);
                    }
                } else if (word2 != undefined) {

                    if (word1.pos <= word2.pos &&
                        word1.pos + word1.lengthKey > word2.pos &&
                        word1.pos + word1.lengthKey <= word2.pos + word2.lengthKey) {

                        joinWord = word1.key.slice(0, (word2.pos - word1.pos)) + word2.key;

                        joinWords.push({ key: joinWord, lengthKey: joinWord.length, pos: word1.pos });
                    }
                }
            }

            joinWords = joinWords.concat(ordPosWords);

            // Ordena la matriz por longitud de las cadenas de forma descendente.
            // Buscara primero las palabras largas, a resaltar (por la etiqueta <b>).
            let ordLengthKeys = [];
            ordLengthKeys = joinWords.sort(function(a, b) {
                if ( a.lengthKey > b.lengthKey ){ return -1; }
                if ( a.lengthKey < b.lengthKey ){ return 1; }
                return 0;
            });
            
            metaWords = ordLengthKeys;
        }

        //----------------------------------------------------------------------------------------------------
        
        // Captura la palabra original 
        let mapGetWordsObj = {};
        let mapGetWordsObjRegex = {};
        for (let i = 0; i < metaWords.length; i++) {

            const posWord = metaWords[i].pos;
            const lengthWord = metaWords[i].lengthKey;
            let getWord = "";
            for (let i = posWord; i < posWord + lengthWord; i++) {
                getWord += blockText.charAt(i); // Capta el carácter original
            }
            mapGetWordsObj[getWord] = "<b>" + getWord + "</b>";
            mapGetWordsObj[getWord.toLowerCase()] = "<b>" + getWord.toLowerCase() + "</b>";
            mapGetWordsObj[getWord.toUpperCase()] = "<b>" + getWord.toUpperCase() + "</b>";
            

            // Carácteres especiales en expresiones regulares
            if ((getWord.includes("\.") || getWord.includes("\,") || getWord.includes("\(") || getWord.includes("\)") ||
                 getWord.includes("\+") || getWord.includes("\*") || getWord.includes("\$") || getWord.includes("\^") || 
                 getWord.includes("\[") || getWord.includes("\]") || getWord.includes("\{") || getWord.includes("\}") || 
                 getWord.includes("\|") || getWord.includes("\?") || getWord.includes("\!") || getWord.includes("\=") ||
                 getWord.includes("\\")) == true) {

                // Para encontrar literalmente dicho carácter y no sea un carácter especial en string o regex,
                // debe precederle la barra invertida doble.
                getWord = getWord.replaceAll("\\","\\\\"); //--> Importante que sea el primero debido a su tipo de carácter que busca reemplazar
                getWord = getWord.replaceAll("\.","\\."); getWord = getWord.replaceAll("\,","\\,");
                getWord = getWord.replaceAll("\(","\\("); getWord = getWord.replaceAll("\)","\\)");
                getWord = getWord.replaceAll("\+","\\+"); getWord = getWord.replaceAll("\*","\\*");
                getWord = getWord.replaceAll("\$","\\$"); getWord = getWord.replaceAll("\^","\\^");
                getWord = getWord.replaceAll("\[","\\["); getWord = getWord.replaceAll("\]","\\]");
                getWord = getWord.replaceAll("\{","\\{"); getWord = getWord.replaceAll("\}","\\}");
                getWord = getWord.replaceAll("\|","\\|"); getWord = getWord.replaceAll("\?","\\?");
                getWord = getWord.replaceAll("\!","\\!"); getWord = getWord.replaceAll("\=","\\=");
                mapGetWordsObjRegex[getWord] = i;
                mapGetWordsObjRegex[getWord.toLowerCase()] = i;
                mapGetWordsObjRegex[getWord.toUpperCase()] = i;
            } else {
                mapGetWordsObjRegex[getWord] = i;
                mapGetWordsObjRegex[getWord.toLowerCase()] = i;
                mapGetWordsObjRegex[getWord.toUpperCase()] = i;
            }
        }

        //----------------------------------------------------------------------------------------------------

        // Reemplaza letras|palabras|signos
        if (Object.keys(mapGetWordsObj).length > 0) { // Procede si hay claves
            var keys = new RegExp(Object.keys(mapGetWordsObjRegex).join("|"), "g");
            textToBold = textToBold.replace(keys, function (mark) {
                return mapGetWordsObj[mark];
            });
        }
        return textToBold;
    } else {
        return blockText;
    }
}

//=============================================================================================
// Crea un listado de productos en la página
//=============================================================================================

function showProductsList(array){

    let prodContainer = document.getElementById("prod-container")

    if (currentStructure == "gridView") {
        prodContainer.className = "row";
    } else {
        prodContainer.className = "row list-group mx-sm-0 py-md-3";
    }

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let products = array[i];

        if (termSearch == undefined || searching(products.name, products.description, termSearch)) {

            if ((minCost == undefined || (minCost != undefined && minCost <= parseInt(products.cost))) &&
                (maxCost == undefined || (maxCost != undefined && maxCost >= parseInt(products.cost)))) {

                if (currentStructure == "gridView") {
                    htmlContentToAppend += `
                    <div class="col-12 px-2 py-2 col-sm-6 px-md-3 py-md-3 col-lg-4">
                        <div class="card shadow-sm h-100 list-group-item-action">
                            <a href="product-info.html" class="stretched-link">
                                <img src="${products.imgSrc}" class="card-img-top" alt="${products.description}">
                            </a>
                            <div class="card-body d-flex flex-column">
                                <small class="card-subtitle mb-2 text-muted text-center text-sm-right">${products.soldCount} vendidos</small>
                                <h4 class="card-title">${boldWordsSearch(products.name, termSearch)}</h4>
                                <p class="card-text">${boldWordsSearch(products.description, termSearch)}</p>
                                <div class="mt-auto">
                                    <span class="h4 mb-1 mt-2 font-weight-bold">${products.currency} ${products.cost}</span>
                                </div>
                            </div>
                        </div>
                    </div>`
                } else {
                    htmlContentToAppend += `
                    <a href="product-info.html" class="list-group-item list-group-item-action py-2 px-sm-3 py-lg-3 px-lg-4">
                        <div class="row">
                            <div class="col-3 px-0 px-sm-2 col-sm-4 col-md-3">
                                <img src="` + products.imgSrc + `" alt="` + products.description + `" class="img-thumbnail p-0 p-sm-1">
                            </div>
                            <div class="col pl-2 pr-1 px-sm-2">
                                <div class="d-flex justify-content-between">
                                    <h4 class="mb-1">` + boldWordsSearch(products.name, termSearch) +`</h4>
                                    <small class="text-muted">` + products.soldCount + ` vendidos</small>
                                </div>
                                <p class="mb-1">` + boldWordsSearch(products.description, termSearch) + `</p>
                                <div class="d-flex">
                                    <span class="h4 mb-1 mt-2 font-weight-bold">` + products.currency + " " + products.cost + `</span>
                                </div>
                            </div>
                        </div>
                    </a>`
                }
            }
        }
        prodContainer.innerHTML = htmlContentToAppend;
    }
}

//=============================================================================================
// Ordena la matriz según criterio indicado
//=============================================================================================

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if (aCount < bCount) { return -1; }
            if (aCount > bCount) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_SOLD) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }
    // Devuelvo lista ordenada
    return result;
}

//=============================================================================================
// Ordena la matriz según criterio indicado y la muestra en la página
//=============================================================================================

function sortAndShowProducts(sortCriteria) {

    currentSortCriteria = sortCriteria;
    productsArray = sortProducts(sortCriteria, productsArray);

    // Muestro los productos ordenados
    showProductsList(productsArray);
}

//=============================================================================================
// Muestra en la página según el tipo de estructura indicada
//=============================================================================================

function changeTypeStructure(structure) {

    currentStructure = structure;

    // Muestro los productos en otra estructura
    showProductsList(productsArray);
}

//=============================================================================================
// Función que se ejecuta una vez que se haya lanzado el evento de que el documento 
// se encuentra cargado, es decir, se encuentran todos los elementos HTML presentes.
//=============================================================================================

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok") {

            productsArray = resultObj.data;

            // Muestro los productos ordenados por relevancia desde un principio
            sortAndShowProducts(ORDER_DESC_BY_SOLD);
        }
    });
    
    //=============================================================================================
    // Filtra
    //=============================================================================================

    document.getElementById("rangeFilterCost").addEventListener("click", function () {

        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad de productos por categoría.
        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0) {
            minCost = parseInt(minCost);
        }
        else {
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0) {
            maxCost = parseInt(maxCost);
        }
        else {
            maxCost = undefined;
        }

        showProductsList(productsArray);
    });

    //----------------------------------------------------------------------------------------------------

    document.getElementById("clearRangeFilter").addEventListener("click", function(){

        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList(productsArray);
    });

    //=============================================================================================
    // Ordena
    //=============================================================================================

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

    //=============================================================================================
    // Busqueda
    //=============================================================================================

    document.getElementById("searchBox").addEventListener("input", function(){

        termSearch = document.getElementById("searchBox").value;
        document.getElementById("buttonErase").removeAttribute("hidden");
        if (termSearch == ""){
            document.getElementById("buttonErase").setAttribute("hidden", true);
        }
        //Muestro los productos por busqueda
        showProductsList(productsArray);
    });

    //----------------------------------------------------------------------------------------------------

    document.getElementById("buttonErase").addEventListener("click", function(){

        document.getElementById("searchBox").value = "";
        document.getElementById("buttonErase").setAttribute("hidden", true);
        termSearch = undefined;

        //Muestro los productos sin busqueda
        showProductsList(productsArray);
    });

    //=============================================================================================
    // Estructura
    //=============================================================================================

    document.getElementById("listView").addEventListener("click", function(){
        changeTypeStructure(this.id);
    });
    document.getElementById("gridView").addEventListener("click", function(){
        changeTypeStructure(this.id);
    });
});