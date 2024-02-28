import { Faker, en } from '@faker-js/faker';

export const customFaker = new Faker({ locale: [en] });

const { commerce, image, database, string, datatype, number } = customFaker;

const generateProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        thumbnail: [image.url(), image.url(), image.url()],
        code: string.alphanumeric(6),
        stock: number.int({ max: 100 }),
        status: datatype.boolean(),
        category: commerce.department()
    }
}

export const mockingProducts = () => {
    let products = []
    for(let i = 0; i < 100; i++){
        products.push(generateProduct())
    }
    return products
}