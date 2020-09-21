var product = {};
var products = {};
var comments = {};
var relatedProductsImages = [];

function average(array)
{
    var result = 0;
    for (var i = 0; i < array.length; i++) {
        result += array[i].score;
    }
    return (result/array.length).toFixed(1);
}

function returnImagesGalleryCode(array) {

    let htmlContentToAppend = "";
    for (var i = 0; i < array.length; i++) {
        let imageSrc = array[i];
        htmlContentToAppend += `
            <div class="col-lg-3 col-md-4 col-6">
                <div class="d-block mb-4 h-100">
                    <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
                </div>
            </div>
        `
    }
    return htmlContentToAppend;
}

function returnRelatedProductsCode(array) {
    let htmlContentToAppend = "";
    for (var i = 0; i < array.length; i++) {
        let imageSrc = array[i];
        htmlContentToAppend += `
            <div class="col-lg-3 col-md-4 col-6">
                <a href="product-info.html?producto=` + product.relatedProducts[i] + `" class="list-group-item-action">
                <div class="d-block mb-4 h-100">
                    <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
                </div>
                </a>
            </div>
        `
    }
    return htmlContentToAppend;
}

/*Cada una de las siguientes son disparadas al clickear sobre una estrella actualiza en pantalla el termómetro estrella al seleccionado*/
function star(score) {
    sessionStorage.setItem("selectedStarRating", true);
    document.getElementById("starRating").innerHTML = returnStarRatingCode(score, true);
}

/*Genera y devuelve códigp para impimir puntuación estrella. Si isClickable es true (para cuando se utiliza en publicar comentario), llevará también un onclick para actiualizarce*/
function returnStarRatingCode(score, isClickable) {
    sessionStorage.setItem("currentScore", score);
    let htmlContentToAppend = "";
    for (var j = 1; j <= 5; j++) {
        if (j <= score) {
            htmlContentToAppend += `<span class="fa fa-star checked"`;
            if (isClickable) {
                htmlContentToAppend += ` onclick="star(` + j + `)"`;
            }
            htmlContentToAppend += `></span>`;
        } else {
            htmlContentToAppend += `<span class="fa fa-star"`;
            if (isClickable) {
                htmlContentToAppend += ` onclick="star(` + j + `)"`;
            }
            htmlContentToAppend += `></span>`;
        }
    }
    return htmlContentToAppend;
}


function showCommentsList(array) {
    let htmlContentToAppend = "";
    for (var i = 0; i < array.length; i++) {
        let comment = array[i];
        htmlContentToAppend += `
            <div class="row list-group-item list-group-item-action">
                <h5 class="mb-1">` + comment.user + `&nbsp&nbsp&nbsp&nbsp` + comment.dateTime + `&nbsp&nbsp&nbsp&nbsp`;

        htmlContentToAppend += returnStarRatingCode(array[i].score, false);

        htmlContentToAppend += `</h5>
                <br>
                <p class="mb-1">` + comment.description + `</p>
                <br>
            </div>
        `
    }
    document.getElementById("comments").innerHTML = htmlContentToAppend;
}

/*Si ya se seleccionó la puntuación se adiciona el nuevo comentario al arreglo de comentarios y se muestran todos.
Luego se actualiza el valor medio, se resetean las estrellas, la variable que indica si ya se seleccionó la puntuación así
como el contenido del la caja de texto para el comentario*/
function upComment() {
    if (sessionStorage.getItem("selectedStarRating") == "true") {
        let nowDate = new Date();
        comments.push({
            "score": parseInt(sessionStorage.getItem("currentScore")),
            "description": document.getElementById("comment").value,
            "user": sessionStorage.getItem("user"),
            "dateTime": nowDate.getFullYear() + `-0` + (nowDate.getMonth() + 1)  + `-` + nowDate.getDate() + ` ` + nowDate.getHours() + `:` + nowDate.getMinutes() + `:` + nowDate.getSeconds()//.toLocaleString()
        });
        showCommentsList(comments);
        document.getElementById("averageScore").innerHTML = average(comments) + `/5` + `<span class="fa fa-star checked"></span>`;
        document.getElementById("starRating").innerHTML = returnStarRatingCode(0, true);
        sessionStorage.setItem("selectedStarRating", false);
        document.getElementById("comment").value = "";
    } else {
        alert("Seleccione puntuación")
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostAndCurrencyHTML = document.getElementById("productCostAndCurrency");
            let productSoldCountHTML = document.getElementById("productCount");

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostAndCurrencyHTML.innerHTML = product.currency + ' ' + product.cost;
            productSoldCountHTML.innerHTML = product.soldCount;

            //Muestro las imagenes en forma de galería
            document.getElementById("productImagesGallery").innerHTML = returnImagesGalleryCode(product.images);


            /*Obtiene arreglo con las imágenes de los productos relacionados*/
            getJSONData(PRODUCTS_URL).then(function(resultObj) {
                if (resultObj.status === "ok") {
                    products = resultObj.data;
                    for (var i = 0; i < product.relatedProducts.length; i++) {
                        relatedProductsImages[i] = products[product.relatedProducts[i]-1].imgSrc;
                    }

                    document.getElementById("relatedProducts").innerHTML = returnRelatedProductsCode(relatedProductsImages);
                }
            });
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;
            document.getElementById("averageScore").innerHTML = average(comments) + `/5` + `<span class="fa fa-star checked"></span>`;
            showCommentsList(comments);
        }
    });
    sessionStorage.setItem("selectedStarRating", false);
    document.getElementById("starRating").innerHTML = returnStarRatingCode(0, true);
});
