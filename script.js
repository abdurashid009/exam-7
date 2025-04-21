
const userCardsContainer = document.getElementById("userCards");
const cartContainer = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");
const cartModal = document.getElementById("cart");
const shopButton = document.getElementById("shop");
const closeButton = document.getElementById("close");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const priceSelect = document.getElementById("price");

let products = [];  
let cart = [];      
let totalPrice = 0; 


fetch("https://fakestoreapi.com/products?limit=20")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    if (data.length > 0) {
        loader.style.display = "none"; // Mahsulotlar bor bo‘lsa, loaderni yashiramiz
        products = data;
        displayProducts(products);
      } else {
        // Mahsulotlar yo‘q bo‘lsa
        loader.innerHTML = "Mahsulotlar topilmadi!";
      }
    displayProducts(products);
  });


function displayProducts(items) {
  userCardsContainer.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="Mahsulot rasmi" width="75px">
      <h2>${item.title}</h2>
      <p><strong>Kategoriya:</strong> ${item.category}</p>
      <p><strong>Reyting:</strong> ${item.rating.rate} ⭐ (${item.rating.count} ta baho)</p>
      <p class="sent"><strong>Narxi:</strong> $${item.price}</p>
      <button onclick='addToCart("${item.title}", ${item.price})' class="send">Sotib olish</button>
    `;
    userCardsContainer.appendChild(card);
  });
}

function addToCart(title, price) {
  cart.push({ title, price });
  totalPrice += price;
  updateCart();
}

function updateCart() {
  cartContainer.innerHTML = "";
  cart.forEach((item, index) => {
    const cartItem = document.createElement("p");
    cartItem.innerHTML = `
      ${item.title} - $${item.price.toFixed(2)}
      <button class="dele" onclick="removeFromCart(${index})">❌</button>
    `;
    cartContainer.appendChild(cartItem);
  });
  totalPriceElement.innerText = `Umumiy narx: $${totalPrice.toFixed(2)}`;
}

function removeFromCart(index) {
  totalPrice -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
}

shopButton.onclick = function () {
  cartModal.style.display = "flex";
  shopButton.style.display = "none";
};


closeButton.onclick = function () {
  cartModal.style.display = "none";
  shopButton.style.display = "flex";
};

function filterProducts() {
  let filtered = [...products];

  const searchText = searchInput.value.toLowerCase();
  if (searchText) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(searchText));
  }

  const selectedCategory = categorySelect.value;
  if (selectedCategory !== "all") {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  const sortOrder = priceSelect.selectedIndex;
  if (sortOrder === 1) {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 2) {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);
priceSelect.addEventListener("change", filterProducts);


const loader = document.getElementById("loader");
loader.style.display = "block";
