document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname; // Obtener la ruta actual
    const links = document.querySelectorAll(".nav-link"); // Seleccionar todos los enlaces del menú

    // Iterar sobre los enlaces y agregar/eliminar la clase 'active' según corresponda
    links.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});