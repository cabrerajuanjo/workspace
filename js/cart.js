//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
var cartContent = [];

function htmlArticulos()
{
    var htmlContentToAppend = "";
    htmlContentToAppend +=  `
    <table border="0">
        <thead>
          <tr style="border-bottom:0.5px solid grey">
            <th></th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>


        <tbody>
    `;

    for (var i = 0; i < cartContent.length; i++) {
        htmlContentToAppend += `
            <tr style="border-bottom:0.5px solid grey">
                <td><img class="imgArticulo" src="` + cartContent[i].src + `"></td>
                <td><p>`+ cartContent[i].name +`</p></td>
                <td><p>`+ "$U " + (cartContent[i].currency == "UYU"? cartContent[i].unitCost : cartContent[i].unitCost*40) +`</p></td>
                <td><input type="number" name="cant" value="1"></td>
                <td><p id="subtotalTabla">`+  +`</p></td>
            </tr>
        `;
    }
    htmlContentToAppend += `
            <tbody>
        </table>`
    return htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CART_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            cartContent = resultObj.data.articles;
        }
        document.getElementById("articulos").innerHTML = htmlArticulos();
    });

});
