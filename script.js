const products = [
  {
    id:1, category:"Clothes", name:"Men's Hoodie", price:850, badge:"New",
    description:"Stay warm and stylish with our high-quality men's hoodie. Made from soft and durable fabric, perfect for everyday use, sports and outdoor activities.",
    specs:["Material: Cotton Blend","Sizes: S, M, L, XL, XXL","Colors: Blue, Black, Gray","Suitable for: Casual, Sport, Outdoor"],
    images:["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=500&q=85"]
  },
  {
    id:2, category:"Perfume", name:"Classic Perfume", price:2500, badge:"Popular",
    description:"Elegant long-lasting fragrance with a fresh and attractive character, suitable for daily use and special occasions.",
    specs:["Volume: 100ml","Type: Eau de Parfum","Long-lasting fragrance","Suitable for: Men & Women"],
    images:["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85"]
  },
  {
    id:3, category:"Clothes", name:"Girls Dress", price:1200, badge:"New",
    description:"Comfortable and beautiful dress for girls, designed for everyday wear, celebrations and family events.",
    specs:["Age: 3–8 years","Fabric: Cotton Blend","Soft and comfortable","Available in multiple colors"],
    images:["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=85"]
  },
  {
    id:4, category:"Food", name:"Food Package", price:950, badge:"Best Seller",
    description:"A convenient household food package containing selected everyday essentials for your family.",
    specs:["Teff & Wheat Flour","Selected grains","Cooking oil","Family-size package"],
    images:["https://images.unsplash.com/photo-1532624726026-616f9b7a31c8?auto=format&fit=crop&w=900&q=85"]
  },
  {
    id:5, category:"Clothes", name:"Sports Shoes", price:1800, badge:"New",
    description:"Comfortable and durable sports shoes for walking, exercise and everyday activities.",
    specs:["Lightweight design","Durable sole","Sizes: 38–44","Suitable for sports & daily use"],
    images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"]
  },
  {
    id:6, category:"Perfume", name:"Body Spray", price:450, badge:"Popular",
    description:"Fresh body spray with a clean fragrance for all-day freshness.",
    specs:["Volume: 150ml","Fresh fragrance","Easy to carry","For everyday use"],
    images:["https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85"]
  },
  {
    id:7, category:"Clothes", name:"Kids Sweater", price:750, badge:"Best Seller",
    description:"Soft and warm sweater designed for children, combining comfort with a playful style.",
    specs:["Age: 2–10 years","Soft fabric","Warm & comfortable","Multiple colors"],
    images:["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85"]
  },
  {
    id:8, category:"Food", name:"Sunflower Cooking Oil", price:150, badge:"Best Seller",
    description:"Pure sunflower cooking oil suitable for everyday family meals.",
    specs:["Food grade","Sunflower oil","Family cooking","Convenient bottle"],
    images:["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85"]
  }
];

const grid = document.getElementById("productGrid");
const empty = document.getElementById("emptyState");
const modal = document.getElementById("productModal");
const cartDrawer = document.getElementById("cartDrawer");
let currentProduct = null;
let quantity = 1;
let cart = JSON.parse(localStorage.getItem("alefCart") || "[]");

function money(n){ return "ETB " + n.toLocaleString(); }

function renderProducts(list = products){
  grid.innerHTML = "";
  empty.classList.toggle("hidden", list.length !== 0);

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img-wrap" data-id="${p.id}">
        <span class="badge">${p.badge}</span>
        <img class="product-img" src="${p.images[0]}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.description.substring(0,62)}...</p>
        <div class="price">${money(p.price)}</div>
        <button class="order-small" data-order="${p.id}">➤ &nbsp; Order via Telegram</button>
      </div>`;
    grid.appendChild(card);
  });
}

function openProduct(id){
  currentProduct = products.find(p => p.id === id);
  quantity = 1;
  document.getElementById("modalImage").src = currentProduct.images[0];
  document.getElementById("modalImage").alt = currentProduct.name;
  document.getElementById("modalName").textContent = currentProduct.name;
  document.getElementById("modalPrice").textContent = money(currentProduct.price);
  document.getElementById("modalBadge").textContent = currentProduct.badge;
  document.getElementById("modalDescription").textContent = currentProduct.description;
  document.getElementById("quantity").textContent = quantity;
  document.getElementById("modalSpecs").innerHTML = currentProduct.specs.map(s=>`<li>${s}</li>`).join("");
  document.getElementById("modalThumbs").innerHTML = currentProduct.images.map((src,i)=>
    `<img src="${src}" class="${i===0?"active":""}" data-src="${src}" alt="Product image ${i+1}">`
  ).join("");
  modal.classList.remove("hidden");
}

function closeProduct(){ modal.classList.add("hidden"); }

function buildOrderMessage(items){
  let text = "🛒 New Order Request%0A%0AI need to buy this product:%0A%0A";
  items.forEach((item, index) => {
    text += `${index+1}. ${item.name}%0APrice: ${money(item.price)}%0AQuantity: ${item.quantity}%0A`;
    if(item.size) text += `Size: ${item.size}%0A`;
    text += `%0A`;
  });
  text += "Please confirm the order. Thank you.";
  return text;
}

function openTelegram(items){
  const text = buildOrderMessage(items);
  // Telegram supports a text query on public username links in supported clients.
  const url = `https://t.me/YabuFkir?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function addToCart(p, qty=1){
  const found = cart.find(x=>x.id===p.id);
  if(found) found.quantity += qty;
  else cart.push({...p, quantity:qty});
  localStorage.setItem("alefCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  document.getElementById("cartCount").textContent = cart.reduce((a,b)=>a+b.quantity,0);
}

function renderCart(){
  const box = document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML = `<div class="empty-state">Your cart is empty.</div>`;
  }else{
    box.innerHTML = cart.map(item=>`
      <div class="drawer-item">
        <img src="${item.images[0]}" alt="${item.name}">
        <div><h4>${item.name}</h4><small>${money(item.price)} × ${item.quantity}</small></div>
        <button data-remove="${item.id}">Remove</button>
      </div>`).join("");
  }
  const total = cart.reduce((a,b)=>a+b.price*b.quantity,0);
  document.getElementById("cartTotal").textContent = money(total);
}

document.addEventListener("click", e=>{
  const productArea = e.target.closest(".product-img-wrap");
  const orderButton = e.target.closest("[data-order]");
  const removeButton = e.target.closest("[data-remove]");
  const thumb = e.target.closest(".thumbs img");

  if(productArea) openProduct(Number(productArea.dataset.id));
  if(orderButton){
    const p = products.find(x=>x.id===Number(orderButton.dataset.order));
    openTelegram([{...p, quantity:1}]);
  }
  if(removeButton){
    cart = cart.filter(x=>x.id !== Number(removeButton.dataset.remove));
    localStorage.setItem("alefCart", JSON.stringify(cart));
    renderCart(); updateCartCount();
  }
  if(thumb){
    document.getElementById("modalImage").src = thumb.dataset.src;
    document.querySelectorAll(".thumbs img").forEach(x=>x.classList.remove("active"));
    thumb.classList.add("active");
  }
});

document.getElementById("closeModal").onclick = closeProduct;
modal.addEventListener("click", e=>{if(e.target===modal) closeProduct();});

document.getElementById("minusBtn").onclick = ()=>{
  quantity=Math.max(1,quantity-1); document.getElementById("quantity").textContent=quantity;
};
document.getElementById("plusBtn").onclick = ()=>{
  quantity++; document.getElementById("quantity").textContent=quantity;
};
document.getElementById("modalOrder").onclick = ()=>{
  if(currentProduct) openTelegram([{...currentProduct,quantity}]);
};
document.getElementById("modalAdd").onclick = ()=>{
  if(currentProduct){addToCart(currentProduct,quantity);closeProduct();alert("Product added to cart.");}
};

document.getElementById("cartBtn").onclick = ()=>{renderCart();cartDrawer.classList.remove("hidden");};
document.getElementById("closeCart").onclick = ()=>cartDrawer.classList.add("hidden");
cartDrawer.addEventListener("click",e=>{if(e.target===cartDrawer)cartDrawer.classList.add("hidden");});
document.getElementById("cartOrder").onclick = ()=>{
  if(cart.length) openTelegram(cart);
  else alert("Your cart is empty.");
};

function filterProducts(){
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const active = document.querySelector(".category.active").dataset.category;
  const result = products.filter(p =>
    (active==="All" || p.category===active) &&
    (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  );
  renderProducts(result);
}
document.getElementById("searchInput").addEventListener("input",filterProducts);
document.getElementById("searchBtn").onclick=filterProducts;
document.querySelectorAll(".category").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    filterProducts();
  });
});
document.getElementById("viewAll").onclick=(e)=>{
  e.preventDefault();
  document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));
  document.querySelector('.category[data-category="All"]').classList.add("active");
  document.getElementById("searchInput").value="";
  renderProducts(products);
};

renderProducts();
updateCartCount();
