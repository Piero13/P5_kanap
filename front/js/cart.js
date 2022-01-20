document.title = "Kanap | Panier"


/*Initialisation des variables*/

// Récupération des données du localStorage
const cartProducts = JSON.parse(localStorage.getItem("cart"));
console.table(cartProducts);

// Récupération de la section "cart__items" pour intégration des éléments
const cartItemSection = document.getElementById("cart__items");

// Récupération des éléments total articles et prix total
const cartTotalQty = document.getElementById("totalQuantity");
const cartTotalPrice = document.getElementById("totalPrice");

// Initialisation des tableaux et variables
let cartProductOptions = [];
let addedProductOptions = [];
let totalPrice = 0;
let totalQty = 0;


/*Fonction ajout des éléments HTML pour le récapitulatif du panier*/
function addCartElements(productQuantity) {

    let article = document.createElement("article");
    cartItemSection.appendChild(article);
    article.className = "cart__item";
    article.setAttribute("data-id", cartProductOptions.prodId);
    article.setAttribute("data-color", cartProductOptions.prodColor);

    let divImg = document.createElement("div");
    article.appendChild(divImg);
    divImg.className = "cart__item__img";
    
    let itemImg = document.createElement("img");
    divImg.appendChild(itemImg);
    itemImg.src = addedProductOptions.prodImg;
    itemImg.alt = addedProductOptions.prodAltTxt;
    
    let divContent = document.createElement("div");
    article.appendChild(divContent);
    divContent.className = "cart__item__content";

    let divContentDescription = document.createElement("div");
    divContent.appendChild(divContentDescription);
    divContentDescription.className = "cart__item__content__description";

    let itemTitle = document.createElement("h2");
    divContentDescription.appendChild(itemTitle);
    itemTitle.innerText = addedProductOptions.prodName;
       
    let itemColor = document.createElement("p");
    divContentDescription.appendChild(itemColor);
    itemColor.innerText = cartProductOptions.prodColor;
    
    let itemPrice = document.createElement("p");
    divContentDescription.appendChild(itemPrice);
    itemPrice.innerText = addedProductOptions.prodPrice;
    
    let divContentSettings = document.createElement("div");
    divContent.appendChild(divContentSettings);
    divContentSettings.className = "cart__item__content__settings";

    let divQty = document.createElement("div");
    divContentSettings.appendChild(divQty);
    divQty.className = "cart__item__content__settings__quantity";

    let itemQtyLabel = document.createElement("p");
    divQty.appendChild(itemQtyLabel);
    itemQtyLabel.innerText = "Qté : "

    let itemQtyInput = document.createElement("input");
    divQty.appendChild(itemQtyInput);
    itemQtyInput.className = "itemQuantity";
    itemQtyInput.setAttribute("value", productQuantity);
    itemQtyInput.setAttribute("type", "number");
    itemQtyInput.setAttribute("name", "itemQuantity");
    itemQtyInput.setAttribute("min", "1");
    itemQtyInput.setAttribute("max", "100");

    let divDelete = document.createElement("div");
    divContentSettings.appendChild(divDelete);
    divDelete.className = "cart__item__content__settings__delete";
    
    let deleteOption = document.createElement("p");
    divDelete.appendChild(deleteOption);
    deleteOption.className = "deleteItem";
    deleteOption.innerText = "Supprimer";
}


/*Fonction calcul du nombre total d'articles du panier*/
function addTotalQty(productQuantity) {
    totalQty = totalQty + productQuantity;
    cartTotalQty.innerText = totalQty;
    console.log("Total quantity = " + totalQty);
}


/*Fonction calcul du montant total du panier*/
function addTotalPrice(productQuantity) {
    totalProdPrice = addedProductOptions.prodPrice * productQuantity;
    totalPrice = totalPrice + totalProdPrice;
    cartTotalPrice.innerText = totalPrice;
    console.log(totalPrice);
}


/*Récupération et ajout des produits du panier*/
if(cartProducts === null) {
    cartItemSection.innerText = "Votre panier est vide !";

} else{

    // Pour chaque produit dans le panier
    for(i = 0; i < cartProducts.length; i++) { 
        
        // Récupération des options contenues dans le localStorage
        cartProductOptions = {
            prodId: cartProducts[i].productId,
            prodColor: cartProducts[i].productColor,
            prodQty: cartProducts[i].productQty
        }
        console.table(cartProductOptions);

        let productQuantity= cartProductOptions.prodQty;

        // Calcul et ajout de la quantité totale d'articles du panier
        addTotalQty(productQuantity);
    
        // Récupération des options complémentaires contenues dans l'API
        fetch("http://localhost:3000/api/products/" + cartProductOptions.prodId)
        .then(function(res) { // Récupération des données de l'API
            if(res.ok) {
            return res.json();
        }
        })
        .then(function(searchResult) { // Récupération des options produit dans l'API
            addedProductOptions = {
                prodName: searchResult.name,
                prodPrice: searchResult.price,
                prodImg: searchResult.imageUrl,
                prodAltTxt: searchResult.altTxt
            }
            console.table(addedProductOptions);

            // Calcul et ajout du montant total du panier
            addTotalPrice(productQuantity);

            // Ajout et remplissage des éléments HTML
            addCartElements(productQuantity);

        })
        .catch(function(error) { // En cas d'erreur de la requête
            console.log("Erreur : " + error);
        })
    }
}
