const socketClient = io();

socketClient.on('products', (obj) => {
    updateProductCards(obj);
});

const updateProductCards = (products) => {
    const productCard = document.getElementById('product-card');

    let productosHTML = "";

    products.forEach(product => {
        productosHTML += `
        <div class="col-md-4">
            <div id="${product.id}" class="card">
                <div id="${product.id}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                    ${product.thumbnail.map((image, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${image}" class="d-block w-100" alt="Imagen del Producto">
                        </div>
                    `).join('')}
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Precio: $ ${product.price}</p>
                    <p class="card-text">Código: ${product.code}</p>
                </div>
                <div class="d-flex justify-content-center mb-4">
                    <button type="button" class="btn btn-danger" data-product-id="${product.id}" onclick="deleteProduct(${product.id})">Eliminar</button>
                </div>
            </div>
        </div>
        `;
    });
    productCard.innerHTML = productosHTML;
};

let form = document.getElementById('addProductForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let price = parseInt(document.getElementById('price').value);
    let code = document.getElementById('code').value;
    let stock = parseInt(document.getElementById('stock').value);
    let category = document.getElementById('category').value;

    socketClient.emit('addProduct', { title, description, price, code, stock, category });

    form.reset();
});

function deleteProduct(productId) {
    socketClient.emit("deleteProduct", productId);
}