//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

var currentQuantity = [];
var cartContent = [];

function refreshSubtotal()
{
    for (let i = 0; i < currentQuantity.length; i++) {
        document.getElementById("subtotalTabla" + i).innerHTML = (cartContent[i].currency == "UYU"? cartContent[i].unitCost*currentQuantity[i] : cartContent[i].unitCost*40*currentQuantity[i]);  
    }
}

function refreshQuantity()
{
    for (let i = 0; i < currentQuantity.length; i++) {
        currentQuantity[i] = document.getElementById("cant" +i).value;
    }
    refreshSubtotal();
}

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
                <td><input id="cant`+ i +`" type="number"  value="`+ currentQuantity[i] +`" oninput="refreshQuantity()"></td>
                <td><p id="subtotalTabla`+ i +`">`+ (cartContent[i].currency == "UYU"? cartContent[i].unitCost*currentQuantity[i] : cartContent[i].unitCost*40*currentQuantity[i]) +`</p></td>
            </tr>
        `;
    }
    htmlContentToAppend += `
            <tbody>
        </table>`
    return htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function(e){refreshSubtotal()
    getJSONData(CART_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            cartContent = resultObj.data.articles;
            for (let i = 0; i < cartContent.length; i++) {
                currentQuantity[i] = cartContent[i].count;        
            }
        }
        document.getElementById("articulos").innerHTML = htmlArticulos();
    });
});