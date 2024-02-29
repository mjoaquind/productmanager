export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or invalid
    List of required product properties
    * title: Need to be string, received: ${product.title}
    * description: Need to be string, received: ${product.description}
    * price: Need to be number, received: ${product.price}
    * thumbnail: Need to be array, received: ${product.thumbnail}
    * code: Need to be string, received: ${product.code}
    * stock: Need to be number, received: ${product.stock}
    * status: Need to be boolean, received: ${product.status}
    * category: Need to be string, received: ${product.category}`;
}