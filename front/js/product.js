const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
const positionImg = document.querySelector(".item__img");
const titleProduct = document.getElementById("title");
const titlePageProduct = document.querySelector(" html head title")
const priceProduct = document.getElementById("price");
const colorChoice = document.getElementById("colors");
const descriptionProduct = document.getElementById("description"); 

function createProduct(data) {
    titleProduct.innerHTML = `${data.name}`;
    titlePageProduct.innerHTML = `${data.name}`;
    const createImg = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    priceProduct.innerHTML = `${data.price}`;
    descriptionProduct.innerHTML = `${data.description}`
    positionImg.insertAdjacentHTML("beforeend",createImg)
    for(let color of data.colors){
        const createColorsChoice = `
            <option value="${color}">${color}</option>
        `;
        colorChoice.insertAdjacentHTML("beforeend", createColorsChoice);
    }
}

fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
        createProduct(data);
    });
