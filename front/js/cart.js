import {getFromLocalStorage,localStorageHasKey,saveToLocalStorage} from "./storage.js"

const cartItems = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const cartDescription = document.getElementsByClassName("cart__item__content__description");
const cart = getFromLocalStorage();
let product;

(function init() {
    for(let object of cart) {
        createArticles(object);
    }

    document.addEventListener("change", function(event) {
        if(event.target.name === "itemQuantity"){
            const itemId = event.target.closest("article").dataset.id;
            const itemColor = event.target.closest("article").dataset.color;
            let quantity = Number(event.target.value);    

            event.target.value = changeQuantity(itemId,itemColor,quantity);
            changePrice(itemId,itemColor,quantity);
            getNumberProduct();
            getTotalPrice();
        }
    });

    document.addEventListener("click", function(event) {
       if(event.target.className === "deleteItem") {
            const itemId = event.target.closest("article").dataset.id;
            const itemColor = event.target.closest("article").dataset.color;
            
            removeItem(itemId,itemColor);
       }
    });

})();

async function createArticles(object) { 
    product =  await fetch(`http://localhost:3000/api/products/${object.id}`)
    .then((response) => response.json())
    .then((data) => { return data; });
    
    const cardProduct = `
        <article class="cart__item" data-id="${product._id}" data-color="${object.color}">
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${object.color}</p>
                    <p>${product.price*object.quantity}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${object.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article> 
    `;

    cartItems.insertAdjacentHTML("beforeend",cardProduct);
    getNumberProduct();
    getTotalPrice();
};

function getNumberProduct() {
    let number = 0;
    for(let product of cart){
        number += product.quantity;
    }
    totalQuantity.innerHTML = `${number}`;
}

async function getTotalPrice() {
    let price = 0;
    for (let item of cart) {
        product =  await fetch(`http://localhost:3000/api/products/${item.id}`)
        .then((response) => response.json())
        .then((data) => { return data; });

        price += item.quantity*product.price;  
    }
    totalPrice.innerHTML = `${price}`;
}

function changeQuantity(id,color,quantity) {
    let foundObject = cart.find(product => product.id === id && product.color === color);
    
    foundObject.quantity =  quantity;

    if (foundObject.quantity > 100) {
        foundObject.quantity = 100;
        alert('La quantité totale de cet article dépasse 100. Les articles en trop seront ignorés');
        saveToLocalStorage(cart);
        return 100;
    } else if (foundObject.quantity < 1) {
        foundObject.quantity = 1;
        alert("La quantité totale de cet article est négative. Le nombre s'élève à 1.");
        saveToLocalStorage(cart);
        return 1;
    }
    else {
        saveToLocalStorage(cart);
        return quantity; 
    }
}

async function changePrice(id,color,quantity) {
   let index = 0, newPrice;

    for(let item of cart) {
        product =  await fetch(`http://localhost:3000/api/products/${item.id}`)
        .then((response) => response.json())
        .then((data) => { return data; });

        if (item.id === id && item.color === color ) {
            newPrice = product.price * quantity;
            const newDescription = `
                <h2>${product.name}</h2>
                <p>${color}</p>
                <p>${newPrice}€</p>
            `;
            cartDescription[index].innerHTML = newDescription;
        }
        index++;
    }
}

function removeItem(id,color) {
    let foundObject = cart.find(item => item.id === id && item.color === color);
    let newCart = cart.filter(item => item !== foundObject);

    saveToLocalStorage(newCart);
    location.reload();
}



