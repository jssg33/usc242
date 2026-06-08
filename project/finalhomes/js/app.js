const API_ROOT = "https://api242.onrender.com/api/homes";

/* -------------------------------
   VIEW SWITCHING
--------------------------------*/
function showUserView() {
  document.getElementById("userView").style.display = "block";
  document.getElementById("adminPage").style.display = "none";
}

function showAdminPage() {
  document.getElementById("userView").style.display = "none";
  document.getElementById("adminPage").style.display = "block";
  loadAdminTable();
}

/* -------------------------------
   USER VIEW – LOAD HOMES
--------------------------------*/
async function loadHomes() {
  try {
    const res = await fetch(API_ROOT);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const homes = await res.json();

    const container = document.getElementById("homesContainer");
    if (!container) return;
    container.innerHTML = "";

    homes.forEach((home) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card home-card shadow-sm h-100">
          <img src="${home.images?.[0] || './images/defaulthome.jpg'}" 
               class="card-img-top" 
               alt="${home.address?.street || 'Home'}"
               style="height: 220px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${home.address?.street || ''}, ${home.address?.city || ''}</h5>
            <p class="card-text flex-grow-1">
              <strong>Price:</strong> $${Number(home.price || 0).toLocaleString()}<br>
              <strong>Bedrooms:</strong> ${home.floorPlan?.bedrooms || 'N/A'}<br>
              <strong>Bathrooms:</strong> ${home.floorPlan?.bathrooms || 'N/A'}<br>
              <strong>SqFt:</strong> ${home.floorPlan?.squareFeet || 'N/A'}
            </p>
            <button class="btn btn-primary mt-auto" onclick="showDetails('${home._id}')">View Details</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading homes:", error);
  }
}

/* -------------------------------
   ADMIN VIEW – LOAD TABLE
--------------------------------*/
async function loadAdminTable() {
  try {
    const res = await fetch(API_ROOT);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const homes = await res.json();

    const table = document.getElementById("adminTableBody");
    table.innerHTML = "";

    homes.forEach((home) => {
      const encoded = encodeURIComponent(JSON.stringify(home));
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${home._id}</td>
        <td>${home.address?.street || ''}, ${home.address?.city || ''}</td>
        <td>$${Number(home.price || 0).toLocaleString()}</td>
        <td>${home.status || 'N/A'}</td>
        <td>${home.floorPlan?.bedrooms || 'N/A'}</td>
        <td>${home.floorPlan?.bathrooms || 'N/A'}</td>
        <td>
          <button class="btn btn-warning btn-sm mb-1" onclick="openRealtorModal('${home._id}', '${encoded}')">Realtor</button><br>
          <button class="btn btn-info btn-sm mb-1" onclick="openPropertyModal('${home._id}', '${encoded}')">Property</button><br>
          <button class="btn btn-secondary btn-sm mb-1" onclick="openPicturesModal('${home._id}', '${encoded}')">Pictures</button><br>
          <button class="btn btn-danger btn-sm" onclick="deleteHome('${home._id}')">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading admin table:", error);
  }
}

/* -------------------------------
   REALTOR MODAL
--------------------------------*/
function openRealtorModal(id, homeJson) {
  const home = JSON.parse(decodeURIComponent(homeJson));
  document.getElementById("realtorId").value = id;
  document.getElementById("realtorUsername").value = home.username || "";
  document.getElementById("realtorReseller").value = home.resellerName || "";
  document.getElementById("realtorEmail").value = home.contactEmail || "";
  document.getElementById("realtorPhone").value = home.contactPhone || "";

  new bootstrap.Modal(document.getElementById("realtorModal")).show();
}

document.getElementById("realtorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("realtorId").value;

  const body = {
    username: document.getElementById("realtorUsername").value,
    resellerName: document.getElementById("realtorReseller").value,
    contactEmail: document.getElementById("realtorEmail").value,
    contactPhone: document.getElementById("realtorPhone").value,
  };

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  bootstrap.Modal.getInstance(document.getElementById("realtorModal")).hide();
  loadAdminTable();
});

/* -------------------------------
   PROPERTY MODAL
--------------------------------*/
function openPropertyModal(id, homeJson) {
  const home = JSON.parse(decodeURIComponent(homeJson));
  document.getElementById("propertyId").value = id;

  // Address
  document.getElementById("editStreet").value = home.address?.street || "";
  document.getElementById("editUnit").value = home.address?.unit || "";
  document.getElementById("editCity").value = home.address?.city || "";
  document.getElementById("editState").value = home.address?.state || "";
  document.getElementById("editZip").value = home.address?.zipCode || "";
  document.getElementById("editLat").value = home.address?.coordinates?.lat || 0;
  document.getElementById("editLng").value = home.address?.coordinates?.lng || 0;

  // Property Info
  document.getElementById("editPrice").value = home.price || "";
  document.getElementById("editStatus").value = home.status || "available";
  document.getElementById("editType").value = home.propertyType || "";
  document.getElementById("editYear").value = home.yearBuilt || "";
  document.getElementById("editLot").value = home.lotSizeSqFt || "";
  document.getElementById("editDescription").value = home.description || "";

  // Floor Plan
  document.getElementById("editBedrooms").value = home.floorPlan?.bedrooms || "";
  document.getElementById("editBathrooms").value = home.floorPlan?.bathrooms || "";
  document.getElementById("editSqft").value = home.floorPlan?.squareFeet || "";
  document.getElementById("editLayout").value = home.floorPlan?.layoutDescription || "";

  new bootstrap.Modal(document.getElementById("propertyModal")).show();
}

document.getElementById("propertyForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("propertyId").value;

  const body = {
    address: {
      street: document.getElementById("editStreet").value,
      unit: document.getElementById("editUnit").value,
      city: document.getElementById("editCity").value,
      state: document.getElementById("editState").value,
      zipCode: document.getElementById("editZip").value,
      coordinates: {
        lat: Number(document.getElementById("editLat").value) || 0,
        lng: Number(document.getElementById("editLng").value) || 0,
      },
    },
    price: Number(document.getElementById("editPrice").value) || 0,
    status: document.getElementById("editStatus").value,
    propertyType: document.getElementById("editType").value,
    yearBuilt: Number(document.getElementById("editYear").value) || 0,
    lotSizeSqFt: Number(document.getElementById("editLot").value) || 0,
    description: document.getElementById("editDescription").value,
    floorPlan: {
      bedrooms: Number(document.getElementById("editBedrooms").value) || 0,
      bathrooms: Number(document.getElementById("editBathrooms").value) || 0,
      squareFeet: Number(document.getElementById("editSqft").value) || 0,
      layoutDescription: document.getElementById("editLayout").value,
    },
  };

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  bootstrap.Modal.getInstance(document.getElementById("propertyModal")).hide();
  loadAdminTable();
});

/* -------------------------------
   PICTURES MODAL
--------------------------------*/
function openPicturesModal(id, homeJson) {
  const home = JSON.parse(decodeURIComponent(homeJson));
  document.getElementById("picturesHomeId").value = id;

  const container = document.getElementById("picturesCurrent");
  container.innerHTML = (home.images || []).map((img, i) => `
    <div class="col-md-4 mb-3">
      <img src="${img}" class="img-fluid rounded" style="max-height:160px; object-fit:cover;">
      <small class="text-muted d-block text-center mt-1">${img.split('/').pop()}</small>
    </div>
  `).join("");

  document.getElementById("picturesNew").value = "";
  new bootstrap.Modal(document.getElementById("picturesModal")).show();
}

async function savePictures() {
  const id = document.getElementById("picturesHomeId").value;
  const newUrls = document.getElementById("picturesNew").value
    .trim()
    .split("\n")
    .map(url => url.trim())
    .filter(url => url);

  if (newUrls.length === 0) return alert("Enter at least one image URL");

  try {
    await fetch(`${API_ROOT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newUrls }),   // Backend should merge these
    });

    bootstrap.Modal.getInstance(document.getElementById("picturesModal")).hide();
    loadAdminTable();
  } catch (err) {
    console.error(err);
    alert("Failed to update pictures");
  }
}

/* -------------------------------
   DELETE
--------------------------------*/
async function deleteHome(id) {
  if (!confirm("Delete this home permanently?")) return;
  try {
    await fetch(`${API_ROOT}/${id}`, { method: "DELETE" });
    loadAdminTable();
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
}

/* -------------------------------
   DETAILS MODAL
--------------------------------*/
async function showDetails(id) {
  try {
    const res = await fetch(`${API_ROOT}/${id}`);
    const home = await res.json();

    const html = `
      <h4>${home.address?.street}, ${home.address?.city}, ${home.address?.state} ${home.address?.zipCode}</h4>
      <hr>
      <h5>Realtor</h5>
      <p><strong>${home.resellerName}</strong><br>
         ${home.contactEmail}<br>
         ${home.contactPhone}</p>

      <h5>Property</h5>
      <p><strong>Price:</strong> $${Number(home.price).toLocaleString()}<br>
         <strong>Status:</strong> ${home.status}<br>
         <strong>Type:</strong> ${home.propertyType}</p>

      <h5>Floor Plan</h5>
      <p><strong>${home.floorPlan?.bedrooms} Bed | ${home.floorPlan?.bathrooms} Bath</strong><br>
         ${home.floorPlan?.squareFeet} SqFt</p>

      <h5>Images</h5>
      <div class="row g-2">
        ${(home.images || []).map(src => `
          <div class="col-md-4">
            <img src="${src}" class="img-fluid rounded">
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById("detailsContent").innerHTML = html;
    new bootstrap.Modal(document.getElementById("detailsModal")).show();
  } catch (e) {
    console.error(e);
  }
}

/* -------------------------------
   ADD NEW HOME
--------------------------------*/
function openNewHomeModal() {
  document.getElementById("newHomeForm").reset();
  new bootstrap.Modal(document.getElementById("newHomeModal")).show();
}

document.getElementById("newHomeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    username: document.getElementById("newUsername").value || "admin",
    resellerName: document.getElementById("newReseller").value,
    contactEmail: document.getElementById("newEmail").value,
    contactPhone: document.getElementById("newPhone").value || "",

    address: {
      street: document.getElementById("newStreet").value,
      unit: document.getElementById("newUnit").value || "",
      city: document.getElementById("newCity").value,
      state: document.getElementById("newState").value,
      zipCode: document.getElementById("newZip").value,
      coordinates: { lat: 0, lng: 0 }
    },

    price: Number(document.getElementById("newPrice").value),
    status: document.getElementById("newStatus").value,
    propertyType: document.getElementById("newType").value,
    yearBuilt: Number(document.getElementById("newYear").value) || 0,
    lotSizeSqFt: Number(document.getElementById("newLot").value) || 0,
    description: document.getElementById("newDescription").value || "",

    floorPlan: {
      bedrooms: Number(document.getElementById("newBedrooms").value),
      bathrooms: Number(document.getElementById("newBathrooms").value),
      squareFeet: Number(document.getElementById("newSqft").value),
      layoutDescription: document.getElementById("newLayout").value || "",
    },

    images: [
      document.getElementById("img1").value,
      document.getElementById("img2").value,
      document.getElementById("img3").value
    ].filter(url => url && url.trim() !== "")
  };

  try {
    const res = await fetch(API_ROOT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert("✅ Home created successfully!");
      bootstrap.Modal.getInstance(document.getElementById("newHomeModal")).hide();
      loadAdminTable();
    } else {
      alert("Failed to create home");
    }
  } catch (err) {
    console.error(err);
    alert("Error creating home");
  }
});

/* -------------------------------
   INITIAL LOAD
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  loadHomes();
  if (document.getElementById("adminTableBody")) {
    loadAdminTable();
  }
});
