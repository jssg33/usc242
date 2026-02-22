// ===============================
// cart.js (User-only cart system)
// ===============================

const baseUrl = "https://api242.onrender.com";
const cartApi = `${baseUrl}/cart`;
const cartItemApi = `${baseUrl}/cartitems`;
const cartMasterApi = `${baseUrl}/cartmaster`;

let cartId = null;
let catalogueItems = [];

// -----------------------------
// Ensure CartMaster exists (user-only)
// -----------------------------
async function ensureCartMasterExists() {
  const uid = localStorage.getItem("uid");
  if (!uid) return;

  const res = await fetch(cartMasterApi);
  const masters = await res.json();

  const existing = masters.find(m => String(m.userId) === String(uid));
  if (existing) return;

  const newMaster = {
    userId: uid,
    cartsCount: 0,
    cartsCancelled: 0,
    cartsActive: 0,
    cartsActiveList: ""
  };

  await fetch(cartMasterApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMaster)
  });
}

// -----------------------------
// Display CartMaster
// -----------------------------
async function displayCartMaster() {
  await loadCartMaster();
}

// -----------------------------
// Create a new cart (user-only)
// -----------------------------
async function createNewCart() {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    alert("No UID found. Please log in.");
    return;
  }

  const generatedCartId = Math.floor(Math.random() * 1000000);
  cartId = generatedCartId;

  const startInput = document.getElementById("globalStartDate");
  const endInput = document.getElementById("globalEndDate");

  const newCart = {
    cartId: generatedCartId,
    uid: uid,
    itemType: "Product",
    itemDescription: "New Cart",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    dateAdded: new Date().toISOString().split("T")[0],
    isCheckedOut: 0,
    paymentid: "",
    totalcartitems: 0,
    multipleitems: 1,
    transactiontotal: 0,
    resStart: startInput ? startInput.value : "",
    resEnd: endInput ? endInput.value : ""
  };

  const response = await fetch(cartApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCart)
  });

  if (!response.ok) {
    alert("Failed to create cart.");
    return;
  }

  const text = await response.text();
  let createdCart = {};
  try {
    createdCart = text ? JSON.parse(text) : {};
  } catch {}

  cartId = createdCart.cartId || generatedCartId;

  // Update CartMaster
  const cmRes = await fetch(cartMasterApi);
  const masters = await cmRes.json();
  const master = masters.find(m => String(m.userId) === String(uid));

  if (master) {
    const updatedList = master.cartsActiveList
      ? `${master.cartsActiveList},${cartId}`
      : `${cartId}`;

    const updatedMaster = {
      ...master,
      cartsCount: (master.cartsCount ?? 0) + 1,
      cartsActive: (master.cartsActive ?? 0) + 1,
      cartsActiveList: updatedList
    };

    await fetch(`${cartMasterApi}/${master._id || master.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMaster)
    });

    await displayCartMaster();
  }
}

// -----------------------------
// Load catalogue from /products
// -----------------------------
async function loadCatalogue() {
  try {
    const res = await fetch(`${baseUrl}/products`);
    if (!res.ok) throw new Error(`Products HTTP ${res.status}`);

    const allItems = await res.json();
    catalogueItems = allItems.slice().sort((a, b) =>
      (a.description || "").localeCompare(b.description || "")
    );

    const catalogueSelect = document.getElementById("catalogue");
    if (!catalogueSelect) return;
    catalogueSelect.innerHTML = "";

    catalogueItems.forEach(item => {
      const description = item.description || "Unnamed Product";
      const price = typeof item.listprice === "number" ? item.listprice : 0;

      const option = document.createElement("option");
      option.value = item.SKEWID;
      option.text = `${description}, $${price.toFixed(2)}`;
      option.dataset.price = price.toFixed(2);
      option.dataset.skewid = item.SKEWID;
      option.dataset.vendor = item.vendorname || item.vendorid || "Unknown";
      catalogueSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load catalogue:", err);
  }
}

// -----------------------------
// Move selected items → Selected table
// -----------------------------
function moveToSelected() {
  const catalogue = document.getElementById("catalogue");
  const selectedTable = document
    .getElementById("selected")
    .querySelector("tbody");

  if (!catalogue || !selectedTable) return;

  if (!cartId) {
    createNewCart();
  }

  Array.from(catalogue.selectedOptions).forEach(option => {
    const description = option.text.split(",")[0];
    const price = parseFloat(option.dataset.price || "0.00");
    const skewid = option.dataset.skewid || "";

    const row = document.createElement("tr");
    row.dataset.skewid = skewid;
    row.dataset.vendor = option.dataset.vendor || "Unknown";

    row.innerHTML = `
      <td>${description}</td>
      <td>$${price.toFixed(2)}</td>
      <td><input type="number" class="qty" value="1" min="1"></td>
      <td class="subtotal">$0.00</td>
      <td class="state-tax">$0.00</td>
      <td class="local-tax">$0.00</td>
      <td class="line-total">$0.00</td>
    `;

    selectedTable.appendChild(row);
    catalogue.removeChild(option);

    function recalc() {
      const qty = parseInt(row.querySelector(".qty").value) || 0;
      const subtotal = qty * price;
      const stateTax = subtotal * 0.06;
      const localTax = subtotal * 0.015;
      const lineTotal = subtotal + stateTax + localTax;

      row.querySelector(".subtotal").textContent = `$${subtotal.toFixed(2)}`;
      row.querySelector(".state-tax").textContent = `$${stateTax.toFixed(2)}`;
      row.querySelector(".local-tax").textContent = `$${localTax.toFixed(2)}`;
      row.querySelector(".line-total").textContent = `$${lineTotal.toFixed(2)}`;
    }

    recalc();
    row.querySelector(".qty").addEventListener("input", recalc);
  });
}

// -----------------------------
// Move items back to catalogue
// -----------------------------
function moveToCatalogue() {
  const catalogue = document.getElementById("catalogue");
  const selectedTable = document
    .getElementById("selected")
    .querySelector("tbody");

  if (!catalogue || !selectedTable) return;

  Array.from(selectedTable.querySelectorAll("tr")).forEach(row => {
    const description = row.cells[0].textContent;
    const price = row.cells[1].textContent.replace("$", "");
    const skewid = row.dataset.skewid || "";
    const vendor = row.dataset.vendor || "Unknown";

    const option = document.createElement("option");
    option.text = `${description}, $${price}`;
    option.value = skewid;
    option.dataset.price = parseFloat(price || "0").toFixed(2);
    option.dataset.skewid = skewid;
    option.dataset.vendor = vendor;

    catalogue.appendChild(option);
    row.remove();
  });
}

// -----------------------------
// Add selected items to CartItem
// -----------------------------
async function addSelectedToCart() {
  const selectedTable = document
    .getElementById("selected")
    .querySelector("tbody");
  const rows = Array.from(selectedTable.querySelectorAll("tr"));

  if (!cartId) {
    alert("Cart has not been created yet.");
    return;
  }

  if (rows.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  const uid = localStorage.getItem("uid") || "0";

  const startInput = document.getElementById("globalStartDate");
  const endInput = document.getElementById("globalEndDate");

  const resStart = startInput ? startInput.value : "";
  const resEnd = endInput ? endInput.value : "";

  for (const row of rows) {
    const description = row.cells[0].textContent.trim();
    const price = parseFloat(row.cells[1].textContent.replace("$", "")) || 0;
    const qty = parseInt(row.querySelector(".qty").value) || 0;
    const skewid = row.dataset.skewid || "";
    const vendor = row.dataset.vendor || "Unknown";

    if (price <= 0 || qty <= 0) continue;

    const subtotal = parseFloat(
      row.querySelector(".subtotal").textContent.replace("$", "")
    ) || 0;
    const stateTax = parseFloat(
      row.querySelector(".state-tax").textContent.replace("$", "")
    ) || 0;
    const localTax = parseFloat(
      row.querySelector(".local-tax").textContent.replace("$", "")
    ) || 0;
    const lineTotal = parseFloat(
      row.querySelector(".line-total").textContent.replace("$", "")
    ) || 0;

    const nowIso = new Date().toISOString();

    const cartItem = {
      cartid: cartId,
      cartitemdate: nowIso,
      itemvendor: vendor,
      itemdescription: description,
      itemextendedprice: price.toFixed(2),
      itemqty: qty,
      itemsubtotal: subtotal.toFixed(2),
      statetaxtotal: stateTax.toFixed(2),
      ustaxtotal: localTax.toFixed(2),
      itemtotals: lineTotal,
      statetaxpercent: 6,
      statetaxauth: "SC",
      ustaxpercent: 1.5,
      productid: skewid,
      created_date: nowIso,
      resStart,
      resEnd,
      userid: parseInt(uid) || 0
    };

    try {
      const response = await fetch(cartItemApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem)
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`CartItem error ${response.status}:\n${errorDetails}`);
      }
    } catch (err) {
      console.error("Error saving CartItem:", err);
      alert("Failed to save one or more items.");
    }
  }

  try {
    await setCartTotals();
    window.location.href = `cartreview.html?cartId=${encodeURIComponent(cartId)}`;
  } catch (err) {
    console.error("Error updating cart totals:", err);
    alert("Failed to update cart totals.");
  }
}

// -----------------------------
// Update cart totals
// -----------------------------
async function setCartTotals() {
    try {
      const res = await fetch(`${cartItemApi}/cart/${cartId}`);
      if (!res.ok) throw new Error(`CartItem HTTP ${res.status}`);
  
      const items = await res.json();
  
      let totalQty = 0;
      let totalPrice = 0;
  
      items.forEach(item => {
        totalQty += item.itemqty ?? 0;
        totalPrice += item.itemtotals ?? 0;
      });
  
      let description = "";
      if (totalQty === 1) description = "Single Item";
      else if (totalQty === 2) description = "Two Items";
      else description = "Multiple Items";
  
      const cartUpdate = {
        totalcartitems: totalQty,
        transactiontotal: totalPrice,
        itemDescription: description
      };
  
      await fetch(`${cartApi}/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartUpdate)
      });
  
      console.log(
        `Cart ${cartId} updated: ${totalQty} items, $${totalPrice.toFixed(2)}`
      );
    } catch (err) {
      console.error("Failed to update cart totals:", err);
    }
  }
  
  // -----------------------------
  // Optional: product options modal
  // -----------------------------
  function openProductOptionsModal() {
    const modal = document.getElementById("productOptionsModal");
    if (!modal) return;
    modal.style.display = "flex";
  }
  
  function closeProductOptionsModal() {
    const modal = document.getElementById("productOptionsModal");
    if (!modal) return;
    modal.style.display = "none";
  }
  
  function submitProductOptions() {
    const qtyInput = document.getElementById("modalQuantity");
    const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
  
    const globalQty = document.getElementById("globalQuantity");
    if (globalQty) globalQty.value = qty;
  
    closeProductOptionsModal();
  }
  
  // -----------------------------
  // Initialization
  // -----------------------------
  document.addEventListener("DOMContentLoaded", async () => {
    await ensureCartMasterExists();
    await displayCartMaster();
    await loadCatalogue();
  });
  