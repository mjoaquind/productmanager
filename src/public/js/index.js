const socketClient = io();

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const descriptionInput = document.getElementById('description');
    const productList = document.getElementById('products-card');

    const submitProductForm = (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const price = priceInput.value;
        const stock = stockInput.value;
        const description = descriptionInput.value;

        socketClient.emit('addProduct', { title, price, stock, description }); 
        addProductForm.reset();
    };

    addProductForm.addEventListener('submit', submitProductForm);

    socketClient.on('newProduct', (productData) => {
        console.log('Nuevo producto agregado en tiempo real:', productData);
        const listItem = document.createElement('li');
        listItem.textContent += `Nombre: ${productData.title}, Precio: ${productData.price}, Descripción: ${productData.description}`;
        productList.appendChild(listItem);
    });


/*
    data.products.forEach(product => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('col-md-4');
        cardItem.innerHTML = `
        <div class="card">
            <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                ${product.thumbnail.map((image, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${image}" class="d-block w-100" alt="Imagen del producto">
                    </div>
                `).join('')}
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description}</p>
            </div>
        </div>
        `;
        productList.appendChild(cardItem);
    });*/
});