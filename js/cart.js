//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

var currentSubtotals = []; //Subtotales actuales mostrados en el listado (en orden según orden los artículos)
var currentQuantity = [];  //Cantidad actual de items por artículos ya sea seleccinados y cargados del JSON (en orden según orden los artículos)
var cartContent = [];      //Arreglo con los artículos
var currentRateForShipping;//Multiplicador actual seleccionado para calcular el costo del envio
var currentTypeOfPayment = "";

/*Es llamada por el evento onclick al seleccionar un nuevo tipo de envio, recibe desde ahí el multiplicador
y  actualiza currentRateForShipping. Luego vuelve a imprimir costos*/
function refreshCosts(rate)
{
    currentRateForShipping = rate;
    document.getElementById("costos").innerHTML = htmlCostos();
}

/*Obtiene el multiplicador seleccionado y es usado para inicializar currentRateForShipping antes de ser
potencialmente modificado*/
function getShippingRate()
{
    var tipoDeEnvio = document.getElementsByName("tipoDeEnvio");
    if(tipoDeEnvio[0].checked){return 0.15;}
    else if(tipoDeEnvio[1].checked){return 0.07;}
    else if(tipoDeEnvio[2].checked){return 0.05;}
}

/*Actualiza los subtotales directamente al cambiar las cantidades*/
function refreshSubtotal()
{
    for (let i = 0; i < currentQuantity.length; i++) {
        currentSubtotals[i] = (cartContent[i].currency == "UYU"? cartContent[i].unitCost*currentQuantity[i] : cartContent[i].unitCost*40*currentQuantity[i]);
        document.getElementById("subtotalTabla" + i).innerHTML = "$U " + currentSubtotals[i];
    }
}

/*Es llamada por el evento de oninput del selector de cantidad y actualiza el arreglo currentQuantity,
llama refreshSubtotal() para actualizar subtotal y refreshCosts(currentRateForShipping) para actualizar los costos*/
function refreshQuantity()
{
    for (let i = 0; i < currentQuantity.length; i++) {
        currentQuantity[i] = document.getElementById("cant" + i).value;
    }
    refreshSubtotal();
    refreshCosts(currentRateForShipping);
}

/*Devuelve html que formará la seección Artículos*/
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
    /*Para poder acceder a cualquier número de cantidades y subtotales se nombra de manera flexible estos campos
    (cant0 cant1 cant2 etc y subtotalTabla0 subtotalTabla1 subtotalTabla2 etc)*/
    for (var i = 0; i < cartContent.length; i++) {
        currentSubtotals[i] = (cartContent[i].currency == "UYU"? cartContent[i].unitCost*currentQuantity[i] : cartContent[i].unitCost*40*currentQuantity[i]);
        htmlContentToAppend += `
            <tr>
                <td><img class="imgArticulo" src="` + cartContent[i].src + `"></td>
                <td><p>`+ cartContent[i].name +`</p></td>
                <td><p>`+ "$U " + (cartContent[i].currency == "UYU"? cartContent[i].unitCost : cartContent[i].unitCost*40) +`</p></td>
                <td><input id="cant`+ i +`" type="number"  value="`+ currentQuantity[i] +`" oninput="refreshQuantity()" min="0"></td>
                <td><p id="subtotalTabla`+ i +`">$U `+ currentSubtotals[i] +`</p></td>
            </tr>
        `;
    }
    htmlContentToAppend += `
            <tbody>
        </table>`
    return htmlContentToAppend;
}


/*Devuelve html que formará la sección Costos*/
function htmlCostos()
{
    var htmlContentToAppend = "";
    var subtotal = 0;
    for (var i = 0; i < currentSubtotals.length; i++){subtotal += currentSubtotals[i];}


    htmlContentToAppend += `
    <div class="list-group-item list-group-item-action">
        <div class="row">
            <div class="col">
                <p>Subtotal</p>
            </div>
            <div class="col">
                <p>UYU `+ subtotal +`</p>
            </div>
        </div>
    </div>
    <div class="list-group-item list-group-item-action">
        <div class="row">
            <div class="col">
                <p>Envío</p>
            </div>
            <div class="col">
                <p>UYU `+ /*parseInt*/Math.round(subtotal*currentRateForShipping) +`</p>
            </div>
        </div>
    </div>
    <div class="list-group-item list-group-item-action">
        <div class="row">
            <div class="col">
                <p>Total</p>
            </div>
            <div class="col">
                <p>UYU `+ /*parseInt*/Math.round(subtotal*(1 + currentRateForShipping)) +`</p>
            </div>
        </div>
    </div>
    `;

    return htmlContentToAppend;
}

function habilitarTipoDePago(tipo)
{
    if (tipo == "tarjeta")
    {
        document.getElementById("numeroT").removeAttribute('disabled');
        document.getElementById("fechaV").removeAttribute('disabled');
        document.getElementById("numeroS").removeAttribute('disabled');
        document.getElementById("numeroTrans").setAttribute('disabled', 'enable');

        document.getElementById("numeroTrans").value = "";

        currentTypeOfPayment = "tarjeta";
    }
    if (tipo == "transferencia")
    {
        document.getElementById("numeroT").setAttribute('disabled', 'enable');
        document.getElementById("fechaV").setAttribute('disabled', 'enable');
        document.getElementById("numeroS").setAttribute('disabled', 'enable');
        document.getElementById("numeroTrans").removeAttribute('disabled');

        document.getElementById("numeroT").value = "";
        document.getElementById("numeroS").value = "";
        document.getElementById("fechaV").value = "";

        currentTypeOfPayment = "transferencia";
    }
}


function concretarCompra()
{
    let direccion1 = document.getElementById("calle").value == "";
    let direccion2 = document.getElementById("numero").value == "";
    let direccion3 = document.getElementById("esquina").value == "";

    let transferencia = document.getElementById("numeroTrans").value == "";

    let tarjeta1 = document.getElementById("numeroT").value == "";
    let tarjeta2 = document.getElementById("fechaV").value == "";
    let tarjeta3 = document.getElementById("numeroS").value == "";

    let tipoDeEnvioS = !(document.getElementById("tipoDeEnvio1").checked || document.getElementById("tipoDeEnvio2").checked ||                              document.getElementById("tipoDeEnvio3").checked);

    let esTransferencia = currentTypeOfPayment == "transferencia";
    let esTarjeta = currentTypeOfPayment == "tarjeta";

    if(tipoDeEnvioS || direccion1 || direccion2 || direccion3 || ((esTarjeta || transferencia) && (esTransferencia || (tarjeta1 || tarjeta2 || tarjeta3))))
    {
        alert("Faltan completar campos");
    }else {
        alert("Compra realizada con éxito");
    }
}

function cerarLosCampos()
{
    document.getElementById("numeroT").value = "";
    document.getElementById("numeroS").value = "";
    document.getElementById("fechaV").value = "";
    document.getElementById("numeroTrans").value = "";
    document.getElementById("calle").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("esquina").value = "";
}


/*Aqui se inicializa el listado de productos y las variables necesarias como currentRateForShipping y currentQuantity[]*/
document.addEventListener("DOMContentLoaded", function(e){
    cerarLosCampos();
    if(document.getElementById('tarjeta').checked){habilitarTipoDePago('tarjeta')};
    if(document.getElementById('transferencia').checked){habilitarTipoDePago('transferencia')};
    refreshSubtotal()
    getJSONData(CART_INFO_URLL).then(function(resultObj){
        if (resultObj.status === "ok"){
            cartContent = resultObj.data.articles;
            for (let i = 0; i < cartContent.length; i++) {
                currentQuantity[i] = cartContent[i].count;
            }
            document.getElementById("articulos").innerHTML = htmlArticulos();
            currentRateForShipping = getShippingRate();
            document.getElementById("costos").innerHTML = htmlCostos();
        }
    });
});
