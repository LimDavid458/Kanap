let container = document.querySelector("#items");
let cardProduct = "";

fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((data) => {
    for(let dataApi of data){
      cardProduct = 
        `<a href="./product.html?id=${dataApi._id}">
          <article>
            <img src="${dataApi.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
            <h3 class="productName">${dataApi.name}</h3>
            <p class="productDescription">${dataApi.description}</p>
          </article>
        </a> `
      container.insertAdjacentHTML("beforeend",cardProduct);
        
    }
  });
  
