function addElements(tab, num) { // Fonction-ajout des cartes produits

// Création des éléments vides et des attributs
    var prodSection = document.getElementById("items")
    var newLink = document.createElement("a")
    var newArticle = document.createElement("article")
    var newImage = document.createElement("img")
    var newTitle = document.createElement("h3")
    var newParagraph = document.createElement("p")

    newLink.setAttribute("id", "link" + num)
    newImage.setAttribute("id", "img" + num)
    newTitle.setAttribute("id", "productName" + num)
    newParagraph.setAttribute("id", "productDescription" + num)
    
// Intégration des éléments vides à la page
    prodSection.appendChild(newLink)
    newLink.appendChild(newArticle)
    newArticle.appendChild(newImage)
    newArticle.appendChild(newTitle)
    newArticle.appendChild(newParagraph)
        
// Intégration des produits aux éléments
    addProducts(tab, num)
}

function addProducts(tab, num) { // Fonction-ajout des produits
    document
        .getElementById("link" + num)
        .setAttribute("href", "../html/product.html?_id=" + tab[num]._id)
    document
        .getElementById("img" + num)
        .setAttribute("src", tab[num].imageUrl)
    document
        .getElementById("img" + num)
        .setAttribute("alt", tab[num].altTxt)
    document
        .getElementById("productName" + num)
        .innerText = tab[num].name
    document
        .getElementById("productDescription" + num)
        .innerText = tab[num].description
    }
    
function getProducts() { // Ajout des produits
    fetch("http://localhost:3000/api/products")
        .then(function(res) { // Récupération des données de l'API
            if(res.ok) {
                return res.json()
        }
        })
        .then(function(products) { // Boucle pour l'intégration des données
            var nbProducts=products.length
            for(var i = 0; i < nbProducts; i++) {
                addElements(products, i)
            }
        })
        .catch(function(error) {
            console.log("Erreur : ", error)
        })
}    

getProducts()