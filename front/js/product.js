const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');

fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
        createProduct(data);
    });

function createProduct(data) {
    console.log(data);
}