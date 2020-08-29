//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

var products_Array = [];
const ORDER_ASC_BY_COST = "AZ";
const ORDER_DESC_BY_COST = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCost = undefined;
var maxCost = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}


function showProductsList(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let product = array[i];

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))){

            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="row">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">`+ product.name +`</h4>
                                <small class="text-muted">` + product.soldCount + ` vendidos</small>
                            </div>
                        </div>
                        <div class="row">
                            <h6>` + product.description + `</h6>
                        </div>
                        <div class="row">
                            <h4><br></h4>
                        </div>
                        <div class="row_justified_price">
                            <h5>` + product.currency + `</h5> &nbsp <h2>` + product.cost + `</h2>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
            `
        }

    }
    document.getElementById("container_p-5").innerHTML = htmlContentToAppend;
}

function sortAndShowProducts(sortCriteria, ProductsArray){
    currentSortCriteria = sortCriteria;

    if(ProductsArray != undefined){
        currentProductsArray = ProductsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro las categorías ordenadas
    showProductsList(currentProductsArray);
}




document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            products_Array = resultObj.data;
            sortAndShowProducts(ORDER_ASC_BY_COST, products_Array);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST, currentProductsArray);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST, currentProductsArray);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_COUNT, currentProductsArray);
    });

    /*Limpiar filtro e imprimir lista*/
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList(products_Array);
    });

    /*Obtiene valores de rango, los convierte e imprime lista(incluye if de selección) */

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCost = document.getElementById("rangeFilterCountMin").value;
        maxCost = document.getElementById("rangeFilterCountMax").value;

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

        showProductsList(currentProductsArray);
    });
});
