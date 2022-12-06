const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
const positionImg = document.querySelector(".item__img");
const titleProduct = document.getElementById("title");
const titlePageProduct = document.querySelector(" html head title")
const priceProduct = document.getElementById("price");
const colorChoice = document.getElementById("colors");
const descriptionProduct = document.getElementById("description");
const buttonDisabled =  document.getElementById("addToCart"); 
const quantityOfProduct = document.getElementById("quantity"); 
let quantityIsSelect = true;
let objectValidation = true;

function priceOfQuantityProduct(quantity,price){
    return quantity * price;
}

function createProduct(data) {
    titleProduct.innerHTML = `${data.name}`;
    titlePageProduct.innerHTML = `${data.name}`;
    const createImg = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    positionImg.insertAdjacentHTML("beforeend",createImg);
    descriptionProduct.innerHTML = `${data.description}`;
    priceProduct.innerHTML = `${data.price}`;
    //create option colors
    for(let color of data.colors){
        const createColorsChoice = `
            <option select="disabled" value="${color}">${color}</option>
        `;
        colorChoice.insertAdjacentHTML("beforeend", createColorsChoice);
    }
    //calculate and show the price of the quantity of the product(1-100)
    quantityOfProduct.addEventListener("input",function(event){
        if(event.target.value >= 1 && event.target.value <= 100){
            const price = priceOfQuantityProduct(event.target.value,data.price)
            priceProduct.innerHTML = price;
            quantityIsSelect = true;
        }else{
            
            quantityIsSelect = false;
        }
        disableButton(colorChoice.value, quantityIsSelect);
    });
    colorChoice.addEventListener("input", function(event){
        disableButton(event.target.value, quantityIsSelect);
    });
    buttonDisabled.addEventListener("click",function(){
        addObjectList(data._id,quantityOfProduct.value,colorChoice.value);
    });
}

function disableButton(color,quantity){
    if(color !== "" && quantity){
        buttonDisabled .disabled = false;
    }else{
        buttonDisabled .disabled = true;
    }
}

function addObjectList(idProduct,quantityProduct,colorProduct){
    const objectProduct = {
        id:`${idProduct}`,
        quantity:`${quantityProduct}`,
        color:`${colorProduct}`
    }
    let objectString = JSON.stringify(objectProduct); 
    let keyStorage = localStorage.length + 1;

    if(localStorage.length === 0){
        localStorage.setItem(`id:${keyStorage}`,objectString);
    }else{
        for( let i = 0; i < localStorage.length; i++){
            let objectJson = objectInStorage(i+1);
            if(objectJson.id == idProduct && objectJson.color === colorProduct){
                objectJson.quantity = parseInt(objectJson.quantity) + parseInt(quantityProduct);
                objectString = JSON.stringify(objectJson);
                localStorage.setItem(`id:${i+1}`,objectString);
                objectValidation = true;
                break;
            }else{
                objectValidation = false;
            }
        }
    }
    addObjecInPanier(objectValidation,keyStorage,objectString); 
}

//convert string to object
function objectInStorage(id){
    let objectStorage = localStorage.getItem(`id:${id}`);
    let objectJson = JSON.parse(objectStorage);
    return objectJson;
}

function addObjecInPanier(validation,id,objectString){
    if(validation === false){
        localStorage.setItem(`id:${id}`,objectString);
    }
}

fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
        createProduct(data);
    });

 