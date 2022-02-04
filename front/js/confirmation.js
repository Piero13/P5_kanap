// Récupération du numéro de commande placé dans l'url
const urlString = window.location.href;
const url = new URL(urlString);
const orderId = url.searchParams.get("orderId");

// Changement du titre de la page
document.title = "Kanap | Confirmation de commande";

// Affichage du numéro de commande
let orderIdViewer = document.getElementById("orderId");
orderIdViewer.innerText = orderId;

// Suppression du panier dans le localStorage
localStorage.clear();