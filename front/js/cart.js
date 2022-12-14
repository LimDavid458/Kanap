import { getFromLocalStorage,saveToLocalStorage } from "./storage.js"

const cartItems = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const cart = getFromLocalStorage();
let products = [];

(async function init() {
    await createArticles();

    getTotalProducts();
    getTotalPrice();

    const inputsQuantity = document.querySelectorAll('.itemQuantity');
    const inputsDeleteItem = document.querySelectorAll('.deleteItem');

    inputsQuantity.forEach(input => {
        input.addEventListener("change", function() {
            const article = input.closest("article");
            const itemId = article.dataset.id;
            const itemColor = article.dataset.color;
            let quantity = Number(input.value);

            input.value = changeQuantity(itemId,itemColor,quantity);

            getTotalProducts();
            getTotalPrice();
        });
    });

    inputsDeleteItem.forEach(input => {
        input.addEventListener("click", function() {
            const article = input.closest("article");

            removeItem(article);

            getTotalProducts();
            getTotalPrice();
        });
    });
})();

async function createArticles() {
  
    await getObjectFromLocalStorage();

    cart.forEach((object, i) =>  {
        const cardProduct = `
            <article class="cart__item" data-id="${object.id}" data-color="${object.color}">
                <div class="cart__item__img">
                    <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${products[i].name}</h2>
                        <p>${object.color}</p>
                        <p>${products[i].price * object.quantity}€</p>
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
    });
}

async function getObjectFromLocalStorage() {
    // On crée une variable contenant tous les ids stockés dans le localStorage
    const ids = cart.map(x => x.id);
    
    // Ici on requête l'API plusieurs fois afin de récupérer plusieurs données
    // La promesse renvoie les valeurs correspondantes aux requêtes qui ont été envoyées et qui récupèrent les données
    // en fonction de ce qui est stocké dans le localStorage
    products = await Promise.all(
        ids.map(id => fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json()))
    );
}

function getTotalProducts() {
    let number = 0;

    for(let product of cart){
        number += product.quantity;
    }

    totalQuantity.innerHTML = `${number}`;
}

function getTotalPrice() {
    let price = 0;

    cart.forEach((object, index) => {
        price += object.quantity * products[index].price;
    });

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

function removeItem(article) {
    const itemId = article.dataset.id;
    const itemColor = article.dataset.color;

    const index = cart.findIndex(item => item.id === itemId && item.color === itemColor);
    
    // On synchronise les tableaux afin d'éviter les erreurs
    cart.splice(index, 1);
    products.splice(index, 1);

    article.remove();

    saveToLocalStorage(cart);
}



