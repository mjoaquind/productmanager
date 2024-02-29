export const generateProductErrorInfo = (product) => {
    return `
    Algunos campos obligatorios para crear un nuevo producto no fueron enviados:
    title: llegó ${product.title},
    description: llegó ${product.description},
    price: llegó ${product.price},
    thumbnail: llegó ${product.thumbnail},
    code: llegó ${product.code},
    stock: llegó ${product.stock},
    status: llegó ${product.status},
    category: llegó ${product.category}
    `;
}