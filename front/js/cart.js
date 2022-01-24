// Récupération des données du localStorage
let cartProducts = JSON.parse(localStorage.getItem("cart"));
console.table(cartProducts);

// Initialisation des tableaux et variables
let cartProductOptions = [];
let addedProductOptions = [];
let totalPrice = 0;
let totalQty = 0;


/**************************************************************/
/*Affichage du panier et fonctions de modification/suppression*/
/**************************************************************/

// Changement du titre de la page
document.title = "Kanap | Panier";


/*Fonction ajout des éléments HTML pour le récapitulatif du panier*/
function addCartElements(idProduct, productQuantity, colorProduct) {

    // Récupération de la section "cart__items" pour intégration des éléments
    const cartItemSection = document.getElementById("cart__items");

    // Ajout des éléments nécessaires à la créaton d'un tableau récapitulatif
    let article = document.createElement("article");
    cartItemSection.appendChild(article);
    article.className = "cart__item";
    article.setAttribute("data-id", idProduct);
    article.setAttribute("data-color", colorProduct);

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
    itemColor.innerText = colorProduct;
    
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
    const cartTotalQty = document.getElementById("totalQuantity");

    totalQty = totalQty + productQuantity;
    cartTotalQty.innerText = totalQty;
}


/*Fonction calcul du montant total du panier*/
function addTotalPrice(productQuantity) {
    const cartTotalPrice = document.getElementById("totalPrice");
    let totalProdPrice = addedProductOptions.prodPrice * productQuantity;

    totalPrice = totalPrice + totalProdPrice;
    cartTotalPrice.innerText = totalPrice;
}


/*Fonction modification des quantités du panier*/
function qtyModify() {
    const getElementsToModify = document.getElementsByClassName("itemQuantity");
    console.log(getElementsToModify);

    const elementsToModify = Array.from(getElementsToModify);
    console.log(elementsToModify);

    // Recherche de la quantité modifiée et mise à jour de la page
    for(let j = 0; j < elementsToModify.length; j++) {
        elementsToModify[j].addEventListener("change", function(event) {
            event.preventDefault();

            let newQty = parseInt(elementsToModify[j].value);

            cartProducts[j].productQty = newQty;
            console.log(cartProducts);

            localStorage.setItem("cart", JSON.stringify(cartProducts));

            location.reload();
        })
    }
}


/*Fonction suppression d'un produit du panier*/
function productDelete() {
    const getElementsToDelete = document.getElementsByClassName("deleteItem");
    console.log(getElementsToDelete);

    const elementsToDelete = Array.from(getElementsToDelete);
    console.log(elementsToDelete);

    elementsToDelete.forEach(function(currentElement) {
        currentElement.addEventListener("click", function(event) {
            event.preventDefault();

            // récupération de l'id et de la couleur du produit à supprimer
            let idProductToDelete = this.closest("article").dataset.id;
            console.log(idProductToDelete);
            let colorProductToDelete = this.closest("article").dataset.color;
            console.log(colorProductToDelete);

            // Recherche du produit à supprimer dans le localStorage, mise à jour de la page
            for(let k = 0; k < cartProducts.length; k++) {
                if(cartProducts[k].productId === idProductToDelete && cartProducts[k].productColor === colorProductToDelete) {
                    
                    cartProducts.splice(k, 1);
                    console.log(cartProducts);
                    localStorage.setItem("cart", JSON.stringify(cartProducts));

                    break;
                }         
            }
            location.reload();
        })
    })
}


/*Récupération et ajout des produits du panier*/
if(cartProducts === null || cartProducts == "") {
    document.getElementById("cart__items").innerText = "Votre panier est vide !";
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;

} else{
    // Pour chaque produit dans le panier
    for(i = 0; i < cartProducts.length; i++) { 
        let idProduct = cartProducts[i].productId;
        let colorProduct = cartProducts[i].productColor;
        let productQuantity = cartProducts[i].productQty;

        // Récupération des options complémentaires contenues dans l'API
        fetch("http://localhost:3000/api/products/" + idProduct)
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

            // Ajout et remplissage des éléments HTML
            addCartElements(idProduct, productQuantity, colorProduct);

            // Calcul et ajout de la quantité totale d'articles du panier
            addTotalQty(productQuantity);

            // Calcul et ajout du montant total du panier
            addTotalPrice(productQuantity);

            // Modification de la quantité d'un produit
            qtyModify();

            // Suppression du produit séjectionné
            productDelete();
        })

        .catch(function(error) { // En cas d'erreur renvoyée par Fetch
            console.log("Erreur : " + error);
        })
    }
}


/***************************/
/*Validation de la commande*/
/***************************/

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

const btnCommand = document.getElementById("order");

/*Expressions régulières*/
class Regex {

	// Test d'un texte autre que l'adresse ou l'email
	static textValidation(valueToTest) {
		const nameRegex = new RegExp("^[a-z]+[\- ']?[a-z]*[\- ']?[a-z]*[\- ']?[a-z]*$", "i");
		return nameRegex.test(valueToTest);
	}

	// Test de l'adresse
	static addressValidation(valueToTest) {
		const addressRegex = new RegExp("^[a-z0-9\- ']{5,}$", "i");
		return addressRegex.test(valueToTest);
	}

	// Test de l'email
	static emailValidation(valueToTest) {
		const emailRegex = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "i");
		return emailRegex.test(valueToTest);
	}
}


/*Fonction de vérification du formulaire*/
function formValidation() {
	let validForm = true;

	// Vérification du prénom
    firstNameInput.addEventListener('change', function() {
	    if(!Regex.textValidation(firstNameInput.value)) {
		    firstNameInput.nextElementSibling.innerText = "Prénom invalide";
		    validForm = false;
	    } else {
		    firstNameInput.nextElementSibling.innerText = "";
	    }
    })

	// Vérification du nom
	lastNameInput.addEventListener('change', function() {
	    if(!Regex.textValidation(lastNameInput.value)) {
		    lastNameInput.nextElementSibling.innerText = "Nom invalide";
		    validForm = false;
	    } else {
		    lastNameInput.nextElementSibling.innerText = "";
	    }
    })

	// Vérification de l'adresse
	addressInput.addEventListener('change', function() {
	    if(!Regex.addressValidation(addressInput.value)) {
		    addressInput.nextElementSibling.innerText = "Adresse invalide";
		    validForm = false;
	    } else {
		    addressInput.nextElementSibling.innerText = "";
	    }
    })

	// Vérification de la ville
	cityInput.addEventListener('change', function() {
	    if(!Regex.textValidation(cityInput.value)) {
		    cityInput.nextElementSibling.innerText = "Ville invalide";
		    validForm = false;
	    } else {
		    cityInput.nextElementSibling.innerText = "";
	    }
    })

	// Vérification de l'email
	emailInput.addEventListener('change', function() {
		if(!Regex.emailValidation(emailInput.value)) {
			emailInput.nextElementSibling.innerText = "Email invalide";
			validForm = false;
		} else {
			emailInput.nextElementSibling.innerText = "";
		}
	})
    console.log(validForm)
	return validForm;
}

/*Validation au clic sur le bouton commander*/
btnCommand.addEventListener('click', function(event) {
    event.preventDefault();

    if(formValidation()) {
        // Récupération des id des produits du panier
        let idproductsOrder = [];
        for(i = 0; i < cartProducts.length; i++) {
            idproductsOrder.push(cartProducts[i]);
        }

        // Création du tableau récapitulatif de commande
        let cartOrder = {
            contact: {
                prénom: firstNameInput.value,
                nom: lastNameInput.value,
                adresse: addressInput.value,
                ville: cityInput.value,
                email: emailInput.value
            },
            produits: {
                idproductsOrder
            }
        }
        console.table(cartOrder);
    }
})