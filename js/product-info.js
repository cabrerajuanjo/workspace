var product = {};
var products = {};
var comments = {};
var relatedProducts = [];

function showImagesGallery(array, locationId)
{

    let htmlContentToAppend = "";
    for(var i = 0; i < array.length; i++){
        let imageSrc = array[i];
        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `
    }
    document.getElementById(locationId).innerHTML = htmlContentToAppend;
}

function showCommentsList(array)
{
    let htmlContentToAppend = "";
    for(var i = 0; i < array.length; i++){
        let comment = array[i];
        htmlContentToAppend += `
            <div class="row list-group-item list-group-item-action">
                <h4 class="mb-1">`+ comment.user + `&nbsp&nbsp&nbsp&nbsp` + comment.dateTime + `&nbsp&nbsp&nbsp&nbsp`

        for (var j = 0; j < 5; j++)
        {
            if(j < array[i].score)
            {
                htmlContentToAppend += `<span class="fa fa-star checked"></span>`
            }else
            {
                htmlContentToAppend += `<span class="fa fa-star"></span>`
            }
        }
        htmlContentToAppend += `</h4>
                <br>
                <h4 class="mb-1">`+ comment.description +`</h4>
                <br>
            </div>
        `
    }
    document.getElementById("comments").innerHTML = htmlContentToAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            product = resultObj.data;

            let productNameHTML  = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostAndCurrencyHTML = document.getElementById("productCostAndCurrency");
            let productSoldCountHTML = document.getElementById("productCount");

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostAndCurrencyHTML.innerHTML = product.currency + ' ' + product.cost;
            productSoldCountHTML.innerHTML = product.soldCount;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images, "productImagesGallery");
            getJSONData(PRODUCTS_URL).then(function(resultObj){
                if (resultObj.status === "ok")
                {
                    products = resultObj.data;
                    for (var i = 0; i < product.relatedProducts.length; i++)
                    {
                        relatedProducts[i] = products[product.relatedProducts[i]].imgSrc;
                    }

                    showImagesGallery(relatedProducts, "relatedProducts");
                }
            });

        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            comments = resultObj.data;
            showCommentsList(comments);
        }
    });
});
