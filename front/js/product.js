const urlString = window.location.href;
const url = new URL(urlString);
const urlProductId = url.searchParams.get("_id");
const urlName = url.searchParams.get("_name");

console.log(urlProductId);
console.log(urlName);

/******************************************************/
//Affichage de la page produit de l'article sélectionné
/******************************************************/

document.title = urlName + " | Page produit";


async function addElements(tab) { // Fonction création des éléments HTML

// Création des éléments vides et des attributs
    var divImage = document.querySelector("div.item__img");
    var newImage = document.createElement("img");
    var colorsSelect = document.getElementById("colors");

 
// Création des id & intégration des éléments vides à la page
    newImage.setAttribute("id", "productImg");
    divImage.appendChild(newImage);

    for(var i = 0; i < tab.colors.length; i++) { // Création et intégration du choix des couleurs
        var newOption = document.createElement("option");
        
        colorsSelect.appendChild(newOption);
        newOption.setAttribute("id", "color" + i );
    }

// Intégration des détails du produit aux éléments
    await addProduct(tab);
}

async function addProduct(tab) { // Fonction préparation de l'ajout des détails du produit
    var colors = tab.colors;
    console.table(colors);

    document
        .getElementById("productImg")
        .setAttribute("src", tab.imageUrl);
    document
        .getElementById("productImg")
        .setAttribute("alt", tab.altTxt);
    document
        .getElementById("title")
        .innerText = tab.name;
    document
        .getElementById("price")
        .innerText = tab.price;
    document
        .getElementById("description")
        .innerText = tab.description;
    for(var i = 0; i < colors.length; i++) {
        document
            .getElementById("color" + i)
            .innerText = colors[i];
    }
}

async function getProduct() { // Ajout des éléments HTML et des détails du produit
    await fetch("http://localhost:3000/api/products/" + urlProductId)
        .then(function(res) { // Récupération des données de l'API
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(searchResult) { // Boucle pour intégration des données
            console.table(searchResult);
            addElements(searchResult);
        })
        .catch(function(error) { // En cas d'erreur de la requête
            console.log("Erreur : " + error);
        })
}

getProduct();

/***************************/
//Ajout du produit au panier
/***************************/

const addCart = document.getElementById("addToCart");
const prodColor = document.getElementById("colors");
const prodQty = document.getElementById("quantity");
const artName = document.getElementById("title");

function confirmation() { //Fonction affichage de confirmation de l'ajout au panier
    if(window.confirm("Article ajouté au panier!\n\nVoir le panier [OK]\nContinuer vos achats [Annuler]")) {
        window.open("../html/cart.html");
    }
}

function pushToCart(cartProducts) { // Fonction Importation dans le localStorage
    localStorage.setItem("cart", JSON.stringify(cartProducts));
    console.table(cartProducts);
    confirmation();
}

function addToCart(productToPush) { // Fonction préparation pour l'importation dans le localStorage
    let cartProducts = JSON.parse(localStorage.getItem("cart"));

    if(cartProducts) { // Si le panier n'est pas vide
    
        // Recherche de la présence d'un doublon (même id et même couleur)
        const findResult = cartProducts.find((elt) => elt.productId === productToPush.productId && elt.productColor === productToPush.productColor);

        
        if(findResult) { // Si un doublon est présent
            // Récupération de sa quantité et on y ajoute la nouvelle quantité
            newQty = parseInt(findResult.productQty) + parseInt(productToPush.productQty);
            // Actualisation de la quantité du produit
            findResult.productQty = newQty;
            pushToCart(cartProducts);
        } else{ // Si pas de doublon
            cartProducts.push(productToPush);
            pushToCart(cartProducts);
        }                                       

    } else { // Si le panier est vide
        cartProducts=[];
        cartProducts.push(productToPush);
        pushToCart(cartProducts);
    }
}

function getForCart() { //Fonction récupération des options du produit
    if(prodColor.selectedIndex == 0) {
        alert("La couleur n'a pas été renseignée !");
    } else if(prodQty.value == 0) {
        alert("La quantité n'a pas été renseignée !");
    } else {
        let infoProduct = {
            productId: urlProductId,
            productColor: prodColor.value,
            productQty: Number(prodQty.value),
            productName: artName.textContent
        }
        console.table(infoProduct);

        addToCart(infoProduct);
    }
}

addCart.onclick = () => { // Ajout des produits dans le panier
    getForCart();
}