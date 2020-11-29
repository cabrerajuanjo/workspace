function guardarCambiosPerfil()
{
    datosPerfil = {"campos": []};
    camposPerfilModal = document.getElementsByClassName("datos-perfil-modal");

    datosPerfil.campos.push( {nombre    :  camposPerfilModal[0].value} ); 
    datosPerfil.campos.push( {apellido  :  camposPerfilModal[1].value} ); 
    datosPerfil.campos.push( {documento :  camposPerfilModal[2].value} ); 
    datosPerfil.campos.push( {telefono  :  camposPerfilModal[3].value} ); 

    localStorage.setItem("objetoPerfil", JSON.stringify(datosPerfil));
    imprimirDatos();
}


function imprimirDatos()
{
    if(localStorage.getItem("objetoPerfil") !== null)
    {
        datosPerfilCampos = JSON.parse(localStorage.getItem("objetoPerfil"));
        camposPerfil = document.getElementsByClassName("datos-perfil");

        camposPerfil[0].value = datosPerfilCampos.campos[0].nombre;
        camposPerfil[1].value = datosPerfilCampos.campos[1].apellido;
        camposPerfil[2].value = datosPerfilCampos.campos[2].documento;
        camposPerfil[3].value = datosPerfilCampos.campos[3].telefono;
    }
}


document.addEventListener("DOMContentLoaded", function (e) {

    imprimirDatos();

});