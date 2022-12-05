const cart = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const quantityCart = document.getElementsByClassName("itemQuantity"); 
let cartItem = document.getElementsByClassName("cart__item"); 
let cartDescription = document.getElementsByClassName("cart__item__content__description"); 
let endPrice = 0;
let endQuantity = 0;

const createArticle = (dataStorage,dataApi) =>{ 
    const cardProduct = `
        <article class="cart__item" data-id="${dataStorage.id}" data-color="${dataStorage.color}">
            <div class="cart__item__img">
                <img src="${dataApi.imageUrl}" alt="${dataApi.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${dataApi.name}</h2>
                    <p>${dataStorage.color}</p>
                    <p>${dataApi.price*dataStorage.quantity}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${dataStorage.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article> 
    `;
    cart.insertAdjacentHTML("beforeend",cardProduct);
    //sum price and quantity of all products
    total(dataApi.price,dataStorage.quantity);
    document.addEventListener("input",function(event){
        if(event.target.name === "itemQuantity"){
            let newPrice = event.target.value * dataApi.price;
            console.log(newPrice);
        }
    });
};

function total(price,quantity){
    endPrice += price * quantity;
    endQuantity += parseInt(quantity);
    totalQuantity.innerHTML = `${endQuantity}`;
    totalPrice.innerHTML = `${endPrice}`;
}

for( let i = 0; i < localStorage.length; i++){
    let objectSelect = localStorage.getItem(`id:${i+1}`);
    let objJson = JSON.parse(objectSelect);

    fetch(`http://localhost:3000/api/products/${objJson.id}`)
    .then((response) => response.json())
    .then((data) => {
        createArticle(objJson,data);
    });

}
