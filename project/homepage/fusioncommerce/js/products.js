  
  // ===============================
// products.js (Multi-tenant UI + Product Loader)
// ===============================

const API_ROOT = "https://api242.onrender.com";

// -----------------------------
// Get tenant (fallback to GACOM)
// -----------------------------
function getTenant() {
  let tenant = localStorage.getItem("tenant");

  if (!tenant || tenant.trim() === "" || tenant === "null" || tenant === "undefined") {
    tenant = "GACOM";
    localStorage.setItem("tenant", "GACOM");
  }

  return tenant;
}

// -----------------------------
// Load company details (tenant)
// -----------------------------
async function loadCompanyDetails() {
  let tenant = getTenant();

  try {
    const res = await fetch(`${API_ROOT}/companies`);
    if (!res.ok) throw new Error("Failed to load companies");

    const companies = await res.json();
    let company = companies.find(c => c.companyId === tenant);

    // fallback to GACOM if tenant not found
    if (!company) {
      console.warn(`Tenant ${tenant} not found. Defaulting to GACOM.`);
      tenant = "GACOM";
      localStorage.setItem("tenant", "GACOM");
      company = companies.find(c => c.companyId === "GACOM");
    }

    const panel = document.getElementById("company-details");
    if (!panel) return;

    panel.innerHTML = `
      <h3>${company.name}</h3>
      <p><strong>Address:</strong> ${company.address1} ${company.address2 || ""}</p>
      <p><strong>City:</strong> ${company.city}, ${company.state} ${company.zip}</p>
      <p><strong>Country:</strong> ${company.country}</p>
      <p><strong>Phone:</strong> ${company.phone}</p>
      <p><strong>Email:</strong> ${company.email}</p>
    `;
  } catch (err) {
    console.error("Error loading company details:", err);
  }
}

// -----------------------------
// Read ProductId from URL
// -----------------------------
function getUrlProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ProductId");
}

// -----------------------------
// Load products (no filtering)
// -----------------------------
async function loadProductSummary() {
  try {
    const res = await fetch(`${API_ROOT}/products`);
    if (!res.ok) throw new Error(`Products HTTP ${res.status}`);

    const products = await res.json();
    const selector = document.getElementById("productSelector");
    if (!selector) return;

    selector.innerHTML = `<option value="">Choose a Product</option>`;

    const urlProductId = getUrlProductId();

    products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.SKEWID;
      opt.textContent = `${p.SKEWID} - ${p.description}`;
      opt.dataset.price = p.listprice ?? 0;
      selector.appendChild(opt);
    });

    // Auto-select from URL
    if (urlProductId) {
      const match = products.find(p => p.SKEWID === urlProductId);
      if (match) {
        selector.value = urlProductId;
        window.selectedProduct = match;
        changeProduct(true, products);
      }
    }
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// -----------------------------
// Change product selection
// -----------------------------
async function changeProduct(fromPreload = false, preloadedProducts = null) {
  const selector = document.getElementById("productSelector");
  if (!selector) return;

  const skew = selector.value;
  if (!skew) return;

  let products = preloadedProducts;
  if (!products) {
    const res = await fetch(`${API_ROOT}/products`);
    products = await res.json();
  }

  const product = products.find(p => p.SKEWID === skew);
  if (!product) return;

  window.selectedProduct = product;

  document.getElementById("currentProductId").textContent = product.SKEWID;
  document.getElementById("currentProductName").textContent = product.description;

  document.getElementById("product-details").innerHTML = `
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>Price:</strong> $${(product.listprice ?? 0).toFixed(2)}</p>
    <p><strong>Qty On Hand:</strong> ${product.qtyonhand ?? 0}</p>
    <p><strong>Vendor:</strong> ${product.vendorname || product.vendorid || ""}</p>
    <p><strong>Warehouse:</strong> ${product.warehouseid || ""}</p>
  `;
}

// -----------------------------
// Load CartMaster (user-only)
// -----------------------------
async function loadCartMaster() {
  const uid = localStorage.getItem("uid");
  if (!uid) return;

  try {
    const res = await fetch(`${API_ROOT}/cartmaster`);
    const masters = await res.json();

    const master = masters.find(m => String(m.userId) === String(uid));
    if (!master) return;

    document.getElementById("cmUserId").textContent = master.userId;
    document.getElementById("cmLoyaltyId").textContent = master.loyaltyid || "";
    document.getElementById("cmVendor").textContent = master.loyaltyvendor || "";
    document.getElementById("cmCartsCount").textContent = master.cartsCount ?? 0;
    document.getElementById("cmCartsActive").textContent = master.cartsActive ?? 0;
    document.getElementById("cmCartsCancelled").textContent = master.cartsCancelled ?? 0;
    document.getElementById("cmCartsActiveList").textContent = master.cartsActiveList || "";

    document.getElementById("cartMasterCard").style.display = "block";
  } catch (err) {
    console.error("Error loading CartMaster:", err);
  }
}
