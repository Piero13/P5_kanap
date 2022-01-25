const urlString = window.location.href;
const url = new URL(urlString);
const orderId = url.searchParams.get("orderId");

let orderIdViewer = document.getElementById("orderId");
orderIdViewer.innerText = orderId;
