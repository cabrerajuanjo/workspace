function autenticar()
{
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    if((email.value !== "") && (password.value !== ""))
    {
        sessionStorage.setItem("login", true);
        window.location = "index.html";
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e)
{

});
