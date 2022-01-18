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
const artColor = document.getElementById("colors");
const artQty = document.getElementById("quantity");
const artName = document.getElementById("title");

function confirmation() { //Fonction de confirmation de l'ajout au panier
    if(window.confirm("Article ajouté au panier!\n\nVoir le panier [OK]\nContinuer vos achats [Annuler]")) {
        window.open("../html/cart.html");
    }
}

function addToCart(productToPush) { //Fonction ajout dans le panier
    let cartProducts = JSON.parse(localStorage.getItem("cart"));
    console.table(cartProducts);

    if(cartProducts) { // Si le panier est vide
        cartProducts.push(productToPush);
        localStorage.setItem("cart", JSON.stringify(cartProducts));
        console.table(cartProducts);
        confirmation();
    } else { // Si le panier contient déjà un produit
        cartProducts=[];
        cartProducts.push(productToPush);
        localStorage.setItem("cart", JSON.stringify(cartProducts));
        console.table(cartProducts)
        confirmation();
    }
}

function getForCart() { //Fonction récupération des détails du produit
    if(artColor.selectedIndex == 0) {
        alert("La couleur n'a pas été renseignée !");
    }else if(artQty.value == 0) {
        alert("La quantité n'a pas été renseignée !")
    }else{
        let infoProduct = {
            productId: urlProductId,
            productColor: artColor.value,
            productQty: artQty.value,
            productName: artName.textContent
        }
        console.table(infoProduct);

        addToCart(infoProduct);
    }
}

addCart.onclick = () => { // Ajout des produits dans le panier
    getForCart();
}