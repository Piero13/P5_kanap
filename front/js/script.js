/*Fonction-ajout des cartes produits*/
async function addElements(tab, num) {

    // Création des éléments vides et des id
    let newLink = document.createElement("a");
    newLink.setAttribute("id", "link" + num);

    let newArticle = document.createElement("article");

    let newImage = document.createElement("img");
    newImage.setAttribute("id", "img" + num);

    let newTitle = document.createElement("h3");
    newTitle.setAttribute("id", "productName" + num);

    let newParagraph = document.createElement("p");
    newParagraph.setAttribute("id", "productDescription" + num);

    // Intégration des éléments vides à la page
    let prodSection = document.getElementById("items");
    prodSection.appendChild(newLink);
    newLink.appendChild(newArticle);
    newArticle.appendChild(newImage);
    newArticle.appendChild(newTitle);
    newArticle.appendChild(newParagraph);
        
    // Intégration des produits aux éléments
    await addProducts(tab, num);
}


/*Fonction ajout des produits*/
async function addProducts(tab, num) {
    document
        .getElementById("link" + num)
        .setAttribute("href", "../html/product.html?_id=" + tab[num]._id + "&_name=" + tab[num].name);
    document
        .getElementById("img" + num)
        .setAttribute("src", tab[num].imageUrl);
    document
        .getElementById("img" + num)
        .setAttribute("alt", tab[num].altTxt);
    document
        .getElementById("productName" + num)
        .innerText = tab[num].name;
    document
        .getElementById("productDescription" + num)
        .innerText = tab[num].description;
    }


/*Récupération des données & Ajout des produits*/
async function getProducts() {
    await fetch("http://localhost:3000/api/products")
        .then(function(res) { // Récupération des données de l'API
            if(res.ok) {
                return res.json();
        }
        })
        .then(function(products) { // Boucle pour l'intégration des données
            console.table(products);
            var nbProducts=products.length;
            for(var i = 0; i < nbProducts; i++) {
                addElements(products, i);
            }
        })
        .catch(function(error) { // Affichage si besoin du message d'erreur de la requête
            console.log("Erreur : ", error);
        })
}    

getProducts();