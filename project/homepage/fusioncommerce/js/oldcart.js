const baseUrl = "https://api242.onrender.com";
const cardApi = `${baseUrl}/api/Card`;
const paymentApi = `${baseUrl}/api/Payments`;
const cartApi = `${baseUrl}/api/Cart`;
const API_ROOT = 'https://api242.onrender.com';
const uid = localStorage.getItem('uid');
const urlParams = new URLSearchParams(window.location.search);
let parkId = parseInt(urlParams.get('parkId')) || 0;
let cartId = null;
let catalogueItems = [];
let someparkid = parkId;
let someparkname = "somepark";

async function LoadNewCart() {
    if (!uid) {
      alert("No UID found in localStorage. Please log in.");
      return;
    }

    await ensureCartMasterExists();
    await displayCartMaster();
    await createNewCart(); //MOVING NEW CART CREATION TO WAIT UNTIL ITEMS SELECTED.
    await loadCatalogue();
    await loadParksDropdown();
    await loadParkSummary();
  }


  
function setDates() {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  document.getElementById('globalStartDate').value = today;
  document.getElementById('globalEndDate').value = today;
}

function changeQty(id, delta) {
  const input = document.getElementById(id);
  let value = parseInt(input.value, 10) || 0;
  value = Math.max(0, value + delta);
  input.value = value;
}

 

<!-- ================== SCRIPT PART 2: Cart Master & Park Functions ================== -->

// --- Cart Master Functions ---
async function ensureCartMasterExists() {
  const uid = localStorage.getItem('id');
  const response = await fetch(`${API_ROOT}/api/CartMaster/user/${uid}`);
  const masters = await response.json();

  if (masters.length === 0) {
    const newMaster = {
      userId: uid,
      cartsCount: 0,
      cartsCancelled: 0,
      cartsActive: 0,
      cartsActiveList: ""
    };

    await fetch(`${API_ROOT}/api/CartMaster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMaster)
    });
  }
}

async function displayCartMaster() {
  const uid = localStorage.getItem('id');
  const response = await fetch(`${API_ROOT}/api/CartMaster/user/${uid}`);
  const masters = await response.json();

  if (masters.length > 0) {
    const master = masters[0];
    document.getElementById('cmCartsCount').textContent = master.cartsCount;
    document.getElementById('cmCartsActive').textContent = master.cartsActive;
    document.getElementById('cmCartsCancelled').textContent = master.cartsCancelled;
    document.getElementById('cmCartsActiveList').textContent = master.cartsActiveList;
    document.getElementById('cartMasterCard').style.display = 'block';
    document.getElementById('masterowner').innerHTML = master.userId;
  }
}

async function createNewCart() {
  const uid = localStorage.getItem('id');
  const generatedCartId = Math.floor(Math.random() * 1000000);
  cartId = generatedCartId;

  // ✅ Pull values from your UI
  const startDate = document.getElementById("globalStartDate").value;
  const endDate   = document.getElementById("globalEndDate").value;

  const adults    = Number(document.getElementById("globalAdults").value) || 0;
  const children  = Number(document.getElementById("globalChildren").value) || 0;
  const tentsites = Number(document.getElementById("globalTentSites").value) || 0;

  const newCart = {
    cartId: generatedCartId,
    uid: uid,
    parkId: parkId,            // assumed defined elsewhere
    parkname: someparkname,    // assumed defined elsewhere
    itemType: "Combination",
    itemDescription: "2 Separate Products",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    dateAdded: new Date().toISOString().split("T")[0],
    isCheckedOut: 0,
    paymentid: "",
    bookinginfo: "[33,34]",
    totalcartitems: 0,
    multipleitems: 0,
    johnstotals: 0,
    transactiontotal: 0,

    // ✅ These now come from your UI
    resStart: startDate,
    resEnd: endDate,
    adults: adults,
    children: children,
    tentsites: tentsites
  };

  try {
    const response = await fetch(`${API_ROOT}/api/Cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCart)
    });

    const text = await response.text();

    if (response.status !== 201) {
      console.error('Cart creation failed:', response.status);
      alert('Failed to create cart.');
      return;
    }

    let createdCart;
    try {
      createdCart = text ? JSON.parse(text) : {};
    } catch (err) {
      console.warn('Response body not valid JSON:', text);
      createdCart = {};
    }

    cartId = createdCart.cartId || generatedCartId;
    console.log('Cart created with ID:', cartId);

    // ✅ Update CartMaster
    const masterRes = await fetch(`${API_ROOT}/api/CartMaster/user/${uid}`);
    const masters = await masterRes.json();

    if (masters.length > 0) {
      const master = masters[0];
      const updatedList = master.cartsActiveList
        ? `${master.cartsActiveList},${cartId}`
        : `${cartId}`;

      const updatedMaster = {
        ...master,
        cartsCount: master.cartsCount + 1,
        cartsActive: master.cartsActive + 1,
        cartsActiveList: updatedList
      };

      await fetch(`${API_ROOT}/api/CartMaster/${master.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMaster)
      });

      console.log('CartMaster updated with new cart:', updatedMaster);
      await displayCartMaster();
    }
  } catch (error) {
    console.error('Unexpected error during cart creation:', error);
    alert('An unexpected error occurred while creating the cart.');
  }
}

  
// --- Park Functions ---
async function loadParksDropdown() {
  const response = await fetch(`${API_ROOT}/api/Parks`);
  const parks = await response.json();

  const selector = document.getElementById('parkSelector');
  selector.innerHTML = '<option value="">Select a Park</option>';
  parks.forEach(park => {
    const option = document.createElement('option');
    option.value = park.parkId;
    option.textContent = `${park.name} (ID: ${park.parkId})`;
    selector.appendChild(option);
  });

  document.getElementById('currentParkId').textContent = parkId;
  const currentPark = parks.find(p => p.parkId === parkId);
  document.getElementById('currentParkName').textContent = currentPark ? currentPark.name : 'Unknown';
  someparkname = currentPark ? currentPark.name : "Unknown";
}

function changePark() {
  const newParkId = document.getElementById('parkSelector').value;
  if (!newParkId) return;

  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('parkId', newParkId);
  window.history.pushState({}, '', newUrl);

  parkId = parseInt(newParkId);
  document.getElementById('currentParkId').textContent = parkId;
  loadParkSummary();
  loadCatalogue();
}

async function loadParkSummary() {
  const parkDetails = document.getElementById("park-details");
  if (!parkId) {
    parkDetails.innerHTML = `<div class="alert alert-danger">No parkId provided in URL.</div>`;
    return;
  }

  $.ajax({
    url: `${API_ROOT}/api/Parks/${parkId}`,
    method: "GET",
    success: function (data) {
      const park = Array.isArray(data) ? data[0] : data;
      if (!park) {
        parkDetails.innerHTML = `<div class="alert alert-warning">No park found for ID ${parkId}.</div>`;
        return;
      }
      const trailMapLink = park.trailmapurl
        ? `<a href="${park.trailmapurl}" target="_blank">Trail Map</a>`
        : `<span class="text-muted">No trail map available</span>`;
      const mapsLink = `https://www.google.com/maps?q=${park.latitude},${park.longitude}`;
      const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${park.latitude},${park.longitude}`;
      const pictureurl = `https://home.547bikes.info/picturewall.html?parkId=${park.parkId}`;
      someparkname = park.name;
      someparkid = park.id;

      parkDetails.innerHTML = `
        <div>
          <h3>${park.name}</h3>
          <p><strong>Region:</strong> ${park.region}</p>
          <p><strong>Address:</strong> ${park.address}</p>
          <p><strong>Phone:</strong> ${park.phone}</p>
          <p><strong>Trail Length:</strong> ${park.trailLengthMiles} miles</p>
          <p><strong>Difficulty:</strong> ${park.difficulty}</p>
          <p><strong>Day Pass:</strong> $${typeof park.dayPassPriceUsd === "number" ? park.dayPassPriceUsd.toFixed(2) : "N/A"}</p>
          <p><strong>Description:</strong> ${park.description}</p>
          <p><strong>GPS:</strong> ${park.latitude}, ${park.longitude}</p>
          ${trailMapLink}<br>
          <a href="book5.html?parkId=${park.parkId}">Book This Park</a><br>
          <a href="${mapsLink}" target="_blank">Open in Google Maps</a>
          <a href="${directionsLink}" target="_blank">Get Driving Directions</a><br>
          <a href="reviews5.html?parkId=${park.parkId}" target="_blank">See Reviews</a>
          <a href="${pictureurl}" target="_blank">View Park Pictures</a>
        </div>
      `;
    },
    error: function (xhr, status, error) {
      console.error("❌ Error loading park:", status, error);
      parkDetails.innerHTML = `<div class="alert alert-danger">Error loading park details: ${error}</div>`;
    }
  });
}
<!-- ================== SCRIPT PART 3: Catalogue & Cart Item Functions ================== -->

// --- Catalogue Functions ---
async function loadCatalogue() {
  try {
    if (!parkId) throw new Error("Missing or invalid global parkId");

    const response = await fetch(`${API_ROOT}/api/SalesCatalogue`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const allItems = await response.json();
    catalogueItems = allItems.filter(item =>
      item.parkId === parkId || item.global === 1
    );

    catalogueItems.sort((a, b) => (a.description || '').localeCompare(b.description || ''));

    const catalogueSelect = document.getElementById('catalogue');
    catalogueSelect.innerHTML = '';

    catalogueItems.forEach(item => {
      const description = item.description || 'Unnamed Item';
      const price = typeof item.price === 'number' ? item.price : 0;
      const priceText = price > 0 ? `$${price.toFixed(2)}` : 'Free';

      const option = document.createElement('option');
      option.value = item.salesCatalogueId;
      option.text = `${description}, ${priceText}`;
      option.dataset.price = price.toFixed(2);
      option.dataset.vendor = item.serviceType || "Unknown";
      option.dataset.salescatid = item.salesCatalogueId;

      catalogueSelect.appendChild(option);
    });
  } catch (error) {
    console.error("❌ Failed to load catalogue:", error);
  }
}

function moveToSelected() {
  LoadNewCart();
  const catalogue = document.getElementById('catalogue');
  const selectedTable = document.getElementById('selected').querySelector('tbody');

  Array.from(catalogue.selectedOptions).forEach(option => {
    const description = option.text.split(',')[0];
    const price = parseFloat(option.dataset.price || '0.00');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="width:160px;">${description}</td>
      <td style="width:90px;">$${price.toFixed(2)}</td>
      <td><input type="number" class="adults" value="1" min="0" style="width:60px;"></td>
      <td><input type="number" class="children" value="0" min="0" style="width:60px;"></td>
      <td class="subtotal" style="width:90px;">$0.00</td>
      <td class="state-tax" style="width:90px;">$0.00</td>
      <td class="local-tax" style="width:90px;">$0.00</td>
      <td class="line-total" style="width:90px;">$0.00</td>
    `;
    
    selectedTable.appendChild(row);
    catalogue.removeChild(option);

    // Function to recalc totals for this row
    function recalc() {
      const adults = parseInt(row.querySelector('.adults').value) || 0;
      const children = parseInt(row.querySelector('.children').value) || 0;
      const qty = adults + children;

      const subtotal = qty * price;
      const stateTax = subtotal * 0.06;
      const localTax = subtotal * 0.015;
      const lineTotal = subtotal + stateTax + localTax;

      row.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
      row.querySelector('.state-tax').textContent = `$${stateTax.toFixed(2)}`;
      row.querySelector('.local-tax').textContent = `$${localTax.toFixed(2)}`;
      row.querySelector('.line-total').textContent = `$${lineTotal.toFixed(2)}`;
    }

    // Initial calculation
    recalc();

    // Recalculate whenever quantities change
    row.querySelector('.adults').addEventListener('input', recalc);
    row.querySelector('.children').addEventListener('input', recalc);
  });
}


function moveToCatalogue() {
  const catalogue = document.getElementById('catalogue');
  const selectedTable = document.getElementById('selected').querySelector('tbody');

  Array.from(selectedTable.querySelectorAll('tr')).forEach(row => {
    const description = row.cells[0].textContent;
    const price = row.cells[1].textContent.replace('$', '');
    const option = document.createElement('option');
    option.text = `${description}, $${price}`;
    catalogue.appendChild(option);
    row.remove();
  });
}

function applyQuantities() {
  const adults = parseInt(document.getElementById('qty-adults').value) || 0;
  const children = parseInt(document.getElementById('qty-children').value) || 0;

  const rows = document.querySelectorAll('#selected tbody tr');
  rows.forEach(row => {
    row.querySelector('.adults').textContent = adults;
    row.querySelector('.children').textContent = children;
  });
}

async function addSelectedToCart() {
  const rows = document.querySelectorAll('#selected tbody tr');
  const urlParams = new URLSearchParams(window.location.search);
  const parkId = parseInt(urlParams.get("parkId")) || null;
  const shopId = parkId;
  const startDate = document.getElementById("globalStartDate").value;
  const endDate   = document.getElementById("globalEndDate").value;
  const someuser = localStorage.getItem("uid");

  if (!cartId) {
    alert('Cart has not been created yet. Please wait or try again.');
    console.error('Attempted to save CartItems without a valid cartId.');
    return;
  }

  if (rows.length === 0) {
    alert('Please select at least one item to add to cart.');
    return;
  }

  const parkName = document.getElementById('currentParkName')?.textContent.trim() || "Unknown Park";

  for (const row of rows) {
    const description = row.cells[0].textContent.trim();
    const price = parseFloat(row.cells[1].textContent.replace('$','')) || 0;

    // Adults/Children are inputs
    const adults = parseInt(row.querySelector('.adults').value) || 0;
    const children = parseInt(row.querySelector('.children').value) || 0;
    const qty = adults + children;

    if (isNaN(price) || price <= 0 || qty <= 0) {
      console.warn(`Invalid item:`, description);
      continue;
    }

    // Read calculated values from the table cells
    const subtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('$','')) || 0;
    const stateTax = parseFloat(row.querySelector('.state-tax').textContent.replace('$','')) || 0;
    const localTax = parseFloat(row.querySelector('.local-tax').textContent.replace('$','')) || 0;
    const lineTotal = parseFloat(row.querySelector('.line-total').textContent.replace('$','')) || 0;

    // Proper date handling
    const now = new Date();
    const isoDate = now.toISOString();

    const cartItem = {
      cartid: cartId,
      cartitemdate: isoDate,
      itemvendor: "Unknown",
      itemdescription: description || "Unnamed Item",
      itemextendedprice: price.toFixed(2),
      itemqty: qty,
      adults,
      children,
      itemsubtotal: subtotal.toFixed(2),       // ✅ base subtotal
      statetaxtotal: stateTax.toFixed(2),      // ✅ state tax
      ustaxtotal: localTax.toFixed(2),         // ✅ local tax
      itemtotals: lineTotal,        // ✅ subtotal + taxes
      statetaxpercent: 6,
      statetaxauth: "SC",
      ustaxpercent: 1.5,
      salescatid: 0,
      productid: "0",
      shopid: shopId?.toString() || "0",
      parkid: parkId?.toString() || "0",
      created_date: isoDate,
      resStart: startDate,
      resEnd: endDate,
      qrcodeurl: "1",
      reservationcode: "1",
      memberid: "1",
      rewardsprovider: "Mariott",
      parkname: parkName,
      userid: parseInt(someuser) || 0
    };

    console.log('CartItem', cartItem);

    try {
      const response = await fetch("https://api242.onrender.com/CartItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem)
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Server responded with ${response.status}:\n${errorDetails}`);
      }

      console.log("✅ Item saved successfully.");
    } catch (err) {
      console.error("❌ Error saving item:", err.message);
      alert("Failed to save item. Check console for details.");
    }
  }

  // After all items are processed
  try {
    await setCartTotals();
    const uid = localStorage.getItem("uid");
    const urlParams = new URLSearchParams(window.location.search);
    const parkId = urlParams.get("parkId");
    const cartUrl = `cart5.html?uid=${encodeURIComponent(uid)}&parkId=${encodeURIComponent(parkId)}`;
    window.open(cartUrl, '_self');
  } catch (err) {
    console.error("❌ Error updating cart totals:", err.message);
    alert("Failed to update cart totals.");
  }
}


async function updateCartTotals(currentcartId, currentparkId) {
  try {
    const response = await fetch(`${baseUrl}/api/CartItem/cart/${currentcartId}`);
    const items = await response.json();

    let totalQty = 0;
    let subtotal = 0;       // product-only subtotal
    let totalTax = 0;       // aggregated state+local tax
    let totalAdults = 0;
    let totalChildren = 0;

    items.forEach(item => {
      const qty = item.itemqty ?? 0;
      const itemSubtotal = item.itemsubtotal ?? 0;
      const itemTax = item.statetaxtotal ?? 0;

      totalQty += qty;
      subtotal += itemSubtotal;
      totalTax += itemTax;

      // ✅ Adults and children only count for class P tickets
      //if (item.productclass === 'P') {
        totalAdults += item.adults ?? 0;
        totalChildren += item.children ?? 0;
      //}
    });

      // Get the Adults value
      let globaladults = document.getElementById("globalAdults").value;

      // Get the Children value
      let globalchildren = document.getElementById("globalChildren").value;

      // Get the TentSites value
      let globaltentSites = document.getElementById("globalTentSites").value;



    const totalPrice = subtotal + totalTax;

    let somedescription = "";
    if (totalQty === 1) {
      somedescription = "Single Item";
    } else if (totalQty === 2) {
      somedescription = "Two Items";
    } else {
      somedescription = "More Than Two Items in Cart";
    }

    const cartUpdate = {
      cartId: currentcartId,
      totalcartitems: totalQty,
      subtotal: subtotal,          // sum of product subtotals
      unitPrice: totalTax,         // sum of tax totals
      totalPrice: totalPrice.toFixed(2),      // subtotal + tax
      itemDescription: somedescription,
      adults: globaladults,         // only class P adults
      children: globalchildren,      // only class P children
      tentsites: globaltentSites
    };

    await fetch(`${baseUrl}/api/Cart/${currentcartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartUpdate)
    });

    console.log(`✅ Cart ${currentcartId} updated: ${totalQty} items, subtotal $${subtotal.toFixed(2)}, tax $${totalTax.toFixed(2)}, total $${totalPrice.toFixed(2)}, adults ${totalAdults}, children ${totalChildren}`);
    console.log(cartUpdate);
  } catch (err) {
    console.error("❌ Failed to update cart totals:", err);
  }
}
async function setCartTotals() {
      try {
        const response = await fetch(`${baseUrl}/api/CartItem/cart/${cartId}`);
        const items = await response.json();

        let totalQty = 0;
        let totalPrice = 0;
        let totalAdults = 0;
        let totalChildren = 0;

        items.forEach(item => {
          totalQty += item.itemqty ?? 0;
          totalPrice += item.itemtotals ?? 0;
          totalAdults += item.adults ?? 0;
          totalChildren += item.children ?? 0;
        });
          // Get the Adults value
          let globaladults = document.getElementById("globalAdults").value;

          // Get the Children value
          let globalchildren = document.getElementById("globalChildren").value;

          // Get the TentSites value
          let globaltentSites = document.getElementById("globalTentSites").value;

      
       	let somedescription = "";
      	if(totalQty == 1)
        {
        somedescription = "Single Item";
        }
        else if(totalQty == 2)
        {
        somedescription = "Two Items";
        }
        else
        {
        somedescription = "More Than Two Items in Cart";
        }
            
        const cartUpdate = {
          totalcartitems: totalQty,
          transactiontotal: totalPrice,
          itemDescription: somedescription,
          adults: globaladults,
          children: globalchildren,
          tensites: globaltentSites
        };

        await fetch(`${baseUrl}/api/Cart/${cartId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartUpdate)
        });

        console.log(`✅ Cart ${cartId} updated: ${totalQty} items, $${totalPrice.toFixed(2)}`);
        console.log(cartUpdate);
        alert('Cart Parent Updated! Click to Proceed to Payment');
      } catch (err) {
        console.error("❌ Failed to update cart totals:", err);
      }
    }

//PART5 - MODAL FORM SCRIPTS TO CREATE RESERVATION SHELL
 

function openReservationModal() {
  // Show the modal
  document.getElementById("reservationModal").style.display = "flex";

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Set the MODAL date fields (replace with your modal IDs)
  document.getElementById("modalStartDate").value = today;
  document.getElementById("modalEndDate").value = today;
}

  function submitModalDetails() {
    const adults = document.getElementById("modalAdults").value;
    const children = document.getElementById("modalChildren").value;
    const startDate = document.getElementById("modalStartDate").value;
    const endDate = document.getElementById("modalEndDate").value;
    const gtents = document.getElementById("modalTentSites").value;
    alert("Calling SubmitModal");
    // ✅ Update your existing global fields
    document.getElementById("globalAdults").value = adults;
    document.getElementById("globalChildren").value = children;
    document.getElementById("globalStartDate").value = startDate;
    document.getElementById("globalEndDate").value = endDate;
    document.getElementById("globalTentSites").value = gtents;


    // Close modal
    document.getElementById("reservationModal").style.display = "none";
  }

  function closeReservationModal() {
    document.getElementById("reservationModal").style.display = "none";
  }

function inc(id) {
  const el = document.getElementById(id);
  el.value = Number(el.value || 0) + 1;
}

function dec(id) {
  const el = document.getElementById(id);
  const newVal = Number(el.value || 0) - 1;
  el.value = newVal < 0 ? 0 : newVal;
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  await ensureCartMasterExists();
  await displayCartMaster();
  await loadParksDropdown();
  await loadParkSummary();
  await loadCatalogue();
});
