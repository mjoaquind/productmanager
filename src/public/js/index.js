const socketClient = io();

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const codeInput = document.getElementById('code');
    const stockInput = document.getElementById('stock');
    const categoryInput = document.getElementById('category');
    const productCard = document.getElementById('product-card');

    const submitProductForm = (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const description = descriptionInput.value;
        const price = parseInt(priceInput.value);
        const code = codeInput.value;
        const stock = parseInt(stockInput.value);
        const category = categoryInput.value;

        socketClient.emit('addProduct', { title, description, price, code, stock, category }); 
        addProductForm.reset();
    };

    addProductForm.addEventListener('submit', submitProductForm);

    socketClient.on('newProduct', (product) => {
        console.log('Nuevo producto agregado en tiempo real:', product);
        const cardItem = document.createElement('div');
        cardItem.classList.add('col-md-4');
        cardItem.innerHTML = `
        <div class="card">
            <div id="${product.id}" class="carousel slide" data-bs-ride="carousel">
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
        productCard.appendChild(cardItem);
    });
});