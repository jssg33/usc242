  
  function changeProduct() {
    // loads selected product details into #product-details
  }
  
  function openProductOptionsModal() {
    document.getElementById("productOptionsModal").style.display = "flex";
  }
  
  function closeProductOptionsModal() {
    document.getElementById("productOptionsModal").style.display = "none";
  }
  
  function submitProductOptions() {
    // saves modal options to global state
  }
  
  function moveToSelected() {
    // moves items from catalogue → selected table
  }
  
  function moveToCatalogue() {
    // moves items back
  }
  
  function addSelectedToCart() {
    // final save to cart
  }

function getUrlProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ProductId");
}

async function loadProductSummary() {
  try {
    const res = await fetch("https://api242.onrender.com/products");
    const products = await res.json();

    const selector = document.getElementById("productSelector");
    selector.innerHTML = `<option value="">Choose a Product</option>`;

    const urlProductId = getUrlProductId();  // <-- read from URL

    products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.SKEWID;
      opt.textContent = `${p.SKEWID} - ${p.description}`;
      selector.appendChild(opt);
    });

    // If URL contains a ProductId, auto-select it
    if (urlProductId) {
      const match = products.find(p => p.SKEWID === urlProductId);

      if (match) {
        selector.value = urlProductId;
        changeProduct();  // <-- load product details
      } else {
        console.warn("ProductId in URL not found in product list:", urlProductId);
      }
    }

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

  
