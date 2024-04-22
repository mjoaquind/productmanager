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

document.addEventListener("DOMContentLoaded", function () {
    const userRole = "{{user.role}}"; // Suponiendo que user.role está disponible en tu contexto de plantilla
    if (userRole === 'admin') {
        const navUl = document.querySelector('.navbar-nav');
        const adminLi = document.createElement('li');
        adminLi.classList.add('nav-item');
        const adminLink = document.createElement('a');
        adminLink.classList.add('nav-link');
        adminLink.href = "/users";
        adminLink.textContent = "Users";
        adminLi.appendChild(adminLink);
        navUl.appendChild(adminLi);
    }
});