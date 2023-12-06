const socket = io();

document.addEventListener('DOMContentLoaded', function () {
    const socket = io.connect('http://localhost:8080');
    
    
        socket.on('realTimeProductsUpdate', function (data) {
            console.log('Productos actualizados en tiempo real:', data.products);
            
            
            const productList = document.getElementById('product-card');
            productList.innerHTML = ''; 
    
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
            });
        });
    });