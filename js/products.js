//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

var products_Array = [];

function showCategoriesList(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let product = array[i];

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
    document.getElementById("container_p-5").innerHTML = htmlContentToAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            products_Array = resultObj.data;
            //Muestro las categorías ordenadas
            showCategoriesList(products_Array);
        }
    });
});
