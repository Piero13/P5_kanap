var urlString = window.location.href
var url = new URL(urlString)

var urlProductId = url.searchParams.get("_id")
console.log(urlProductId)

async function addElements(tab) { // Fonction ajout des éléments

// Création des éléments vides et des attributs
    var divImage = document.querySelector("div.item__img")
    var newImage = document.createElement("img")
    var colorsSelect = document.getElementById("colors")

 
// Création des id & intégration des éléments vides à la page
    newImage.setAttribute("id", "productImg")
    divImage.appendChild(newImage)

    for(var i = 0; i < tab.colors.length; i++) { // Création et intégration du choix des couleurs
        var newOption = document.createElement("option")
        
        colorsSelect.appendChild(newOption)
        newOption.setAttribute("id", "color" + i )
    }

// Intégration des détails du produit aux éléments
    await addProduct(tab)
}

async function addProduct(tab) { // Fonction ajout des détails du produit
    var colors = tab.colors
    console.log(colors)

    document
        .getElementById("productImg")
        .setAttribute("src", tab.imageUrl)
    document
        .getElementById("productImg")
        .setAttribute("alt", tab.altTxt)
    document
        .getElementById("title")
        .innerText = tab.name
    document
        .getElementById("price")
        .innerText = tab.price
    document
        .getElementById("description")
        .innerText = tab.description
    for(var i = 0; i < colors.length; i++) {
        document
            .getElementById("color" + i)
            .innerText = colors[i]
    }
}

async function getProduct() { // Ajout des détails du produit
    await fetch("http://localhost:3000/api/products/" + urlProductId)
        .then(function(res) { // Récupération des données de l'API
            if(res.ok) {
                return res.json()
            }
        })
        .then(function(searchResult) { // Boucle pour intégration des données
            console.table(searchResult)
            addElements(searchResult)
        })
        .catch(function(error) { // En cas d'erreur de la requête
            console.log("Erreur : " + error)
        })
}

getProduct()