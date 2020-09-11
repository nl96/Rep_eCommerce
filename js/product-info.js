var productInfo = {};
var productInfoComments = [];
var productsArray = [];

// Muestra imágenes
function showImagesGallery(array) {

    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="${imageSrc}" alt="">
            </div>
        </div>
        `
        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

// Muestra productos relacionados
function showRelatedProducts(relatedArray) {

    let htmlContentToAppend = "";

    relatedArray.forEach(function (i) {

        htmlContentToAppend += `
        <a href="product-info.html" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="${productsArray[i].imgSrc}" alt="${productsArray[i].description}" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h3 class="mb-1">${productsArray[i].name}</h3>
                        <small class="text-muted">${productsArray[i].soldCount} vendidos</small>
                    </div>
                    <div class="d-flex w-100">
                        <span class="h4 mb-1 mt-2 font-weight-bolder">${productsArray[i].currency} ${productsArray[i].cost}</span>
                    </div>
                </div>
            </div>
        </a>
        `
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    });
}

// Muestra comentario
function showComments(commentsArray) {
    let htmlContentToAppend = "";

    function stars(num) {
        let addStar = "";
        for (let i = 0; i < 5; i++) {
            if (i < num) {
                addStar += '<i class="fas fa-star" aria-hidden="true"></i>';
            } else {
                addStar += '<i class="far fa-star" aria-hidden="true"></i>';
            }
        }
        return addStar;
    }

    for (const i in commentsArray) {

        htmlContentToAppend += `
        <div class="list-group-item border-0 py-0">
            <div class="d-flex w-100 justify-content-between">
                <p class="mb-1 small">
                    ` + commentsArray[i].user + `
                    <time class="text-muted ml-2">` + commentsArray[i].dateTime + `</time>
                </p>
            </div>
            <div>` + stars(commentsArray[i].score) + `</div>
            <p>` + commentsArray[i].description + `</p>
        </div>
        `
        document.getElementById("comments-list-container").innerHTML = htmlContentToAppend;
    }
}

// Añade o modifica comentario
function addNewComment(user) {
    let userName = JSON.parse(user).name;

    function getStarValue(starRadioGroup) {
        let stars = document.getElementsByName(starRadioGroup);
        for (let i = 0; i < stars.length; i++) {
            if (stars[i].checked) {
                return stars[i].value;
            }
        }
    }

    function addZero(t) {
        if (t < 10) {
            return ("0" + t);
        }
        return t;
    }

    let commentTextarea = document.getElementById("commentTextarea");
    let commentStars = document.getElementById("stars-comment");
    let starRadio = document.getElementById("star-1");

    // Retiro clases previas de invalidación (alerta)
    commentStars.classList.remove("star-invalid");
    starRadio.classList.remove("is-invalid");

    let starRating = getStarValue("radio-stars");
    let comment = commentTextarea.value;

    if (starRating != undefined) {
            
        let hasRating = false;
        let time = new Date();

        // Modifica reseña publicada
        productInfoComments.forEach(function(item) {
            if(item.user == userName && starRating != undefined){
                hasRating = true;

                item.score = starRating;
                item.description = comment;
                item.dateTime = time.getFullYear() + "-" + addZero(time.getMonth() + 1) + "-" + addZero(time.getDate()) + " " + addZero(time.getHours()) + ":" + addZero(time.getMinutes()) + ":" + addZero(time.getSeconds());
            }
        });

        // En caso contrario se publica una nueva reseña
        if (!hasRating && starRating != undefined) {

            let newComment = {
                score: starRating,
                description: comment,
                user: userName,
                dateTime: time.getFullYear() + "-" + addZero(time.getMonth() + 1) + "-" + addZero(time.getDate()) + " " + addZero(time.getHours()) + ":" + addZero(time.getMinutes()) + ":" + addZero(time.getSeconds())
            }
            productInfoComments.push(newComment);
        }
    
        // Muestro los comentarios
        showComments(productInfoComments);

        // Limpio la caja de comentario y la calificación
        commentTextarea.value = "";
        commentTextarea.placeholder = "Puede modificar su reseña";
        document.getElementsByName("radio-stars")[(starRating - 1)].checked = false;

    } else {
        // Muestro alerta
        commentStars.classList.add("star-invalid");
        starRadio.classList.add("is-invalid");
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productInfo = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostHTML = document.getElementById("productCost");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCriteriaHTML = document.getElementById("productCriteria");

            productNameHTML.innerHTML = productInfo.name;
            productDescriptionHTML.innerHTML = productInfo.description;
            productCostHTML.innerHTML = productInfo.currency + " " + productInfo.cost;
            productSoldCountHTML.innerHTML = productInfo.soldCount;
            productCriteriaHTML.innerHTML = productInfo.category;

            //Muestro las imagenes en forma de galería
            showImagesGallery(productInfo.images);
        }
    });
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {

            productsArray = resultObj.data;
            // Muestro los productos relacionados
            showRelatedProducts(productInfo.relatedProducts);
        }
    });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {

            productInfoComments = resultObj.data;

            let userLogged = JSON.parse(localStorage.getItem("eCommerce-User-Logged")).name;
            if(userLogged){
                productInfoComments.forEach(function(item) {
                    if(item.user == userLogged){
                        document.getElementById("commentTextarea").placeholder = "Puede modificar su reseña";
                    }
                });
            }
            // Muestro los comentarios
            showComments(productInfoComments);
        }
    });
    // Compruebo si existe "send-comment" y usuario logueado para mostrar caja de comentarios
    if (document.getElementById("send-comment")) {

        let userLogged = localStorage.getItem("eCommerce-User-Logged");
        if (userLogged) {
            document.getElementById("send-comment").removeAttribute('hidden');
        }
    }
    document.getElementById("send-comment").addEventListener("submit", function (e) {

        let userLogged = localStorage.getItem("eCommerce-User-Logged");
        if (userLogged) {
            // Añade o modifica comentario
            addNewComment(userLogged);
        }

        //Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador)
        if (e.preventDefault) e.preventDefault();
        return false;
    });
});