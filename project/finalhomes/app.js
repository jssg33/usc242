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
      card.className = "col-md-4";

      card.innerHTML = `
        <div class="card home-card shadow-sm">
          <img src="${home.images?.[0] || 'https://via.placeholder.com/400'}"
               class="card-img-top"
               alt="${home.address.street || 'Home'}">

          <div class="card-body">
            <h5 class="card-title">${home.address.street}, ${home.address.city}</h5>
            <p class="card-text">
              <strong>Price:</strong> $${(home.price || 0).toLocaleString()}<br>
              <strong>Bedrooms:</strong> ${home.floorPlan?.bedrooms || 'N/A'}<br>
              <strong>Bathrooms:</strong> ${home.floorPlan?.bathrooms || 'N/A'}<br>
              <strong>SqFt:</strong> ${home.floorPlan?.squareFeet || 'N/A'}<br>
              <strong>Description:</strong><br> ${home.floorPlan?.layoutDescription || 'No description available'}
            </p>
          </div>
        </div>
      `;

      const homeCard = card.querySelector(".home-card");
      homeCard.style.cursor = "pointer";
      homeCard.addEventListener("click", () => showDetails(home._id));

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
  const res = await fetch(API_ROOT);
  const homes = await res.json();

  const table = document.getElementById("adminTableBody");
  table.innerHTML = "";

  homes.forEach((home) => {
    const encoded = encodeURIComponent(JSON.stringify(home));

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${home._id}</td>
      <td>${home.address.street}, ${home.address.city}</td>
      <td>$${home.price.toLocaleString()}</td>
      <td>${home.status}</td>
      <td>${home.floorPlan.bedrooms}</td>
      <td>${home.floorPlan.bathrooms}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="openRealtorModal('${home._id}', '${encoded}')">Realtor Info</button>
        <button class="btn btn-info btn-sm" onclick="openPropertyModal('${home._id}', '${encoded}')">Property Info</button>
        <button class="btn btn-danger btn-sm" onclick="deleteHome('${home._id}')">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

/* -------------------------------
   REALTOR INFO MODAL
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
    contactPhone: document.getElementById("realtorPhone").value
  };

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  bootstrap.Modal.getInstance(document.getElementById("realtorModal")).hide();
  loadAdminTable();
});

/* -------------------------------
   PROPERTY INFO MODAL
--------------------------------*/
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
        lat: Number(document.getElementById("editLat").value),
        lng: Number(document.getElementById("editLng").value)
      }
    },

    price: Number(document.getElementById("editPrice").value),
    status: document.getElementById("editStatus").value,
    propertyType: document.getElementById("editType").value,
    yearBuilt: Number(document.getElementById("editYear").value),
    lotSizeSqFt: Number(document.getElementById("editLot").value),
    description: document.getElementById("editDescription").value,

    floorPlan: {
      bedrooms: Number(document.getElementById("editBedrooms").value),
      bathrooms: Number(document.getElementById("editBathrooms").value),
      squareFeet: Number(document.getElementById("editSqft").value),
      layoutDescription: document.getElementById("editLayout").value
    }
  };

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  bootstrap.Modal.getInstance(document.getElementById("propertyModal")).hide();
  loadAdminTable();
});



document.getElementById("propertyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("propertyId").value;

  const body = {
    price: Number(document.getElementById("propertyPrice").value),
    status: document.getElementById("propertyStatus").value,
    floorPlan: {
      bedrooms: Number(document.getElementById("propertyBedrooms").value),
      bathrooms: Number(document.getElementById("propertyBathrooms").value),
      squareFeet: Number(document.getElementById("propertySqft").value)
    }
  };

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  bootstrap.Modal.getInstance(document.getElementById("propertyModal")).hide();
  loadAdminTable();
});

/* -------------------------------
   DELETE HOME
--------------------------------*/
async function deleteHome(id) {
  if (!confirm("Are you sure you want to delete this home?")) return;

  await fetch(`${API_ROOT}/${id}`, { method: "DELETE" });

  alert("Home deleted!");
  loadAdminTable();
}

/* -------------------------------
   DETAILS MODAL
--------------------------------*/
async function showDetails(id) {
  const res = await fetch(`${API_ROOT}/${id}`);
  const home = await res.json();

  const html = `
    <h4>${home.address.street}, ${home.address.city}, ${home.address.state}</h4>
    <hr>

    <h5>Realtor Info</h5>
    <p>
      <strong>Username:</strong> ${home.username || "N/A"}<br>
      <strong>Reseller:</strong> ${home.resellerName}<br>
      <strong>Email:</strong> ${home.contactEmail}<br>
      <strong>Phone:</strong> ${home.contactPhone || "N/A"}
    </p>

    <h5>Property Info</h5>
    <p>
      <strong>Price:</strong> $${home.price.toLocaleString()}<br>
      <strong>Status:</strong> ${home.status}<br>
      <strong>Type:</strong> ${home.propertyType}<br>
      <strong>Year Built:</strong> ${home.yearBuilt || "N/A"}<br>
      <strong>Lot Size:</strong> ${home.lotSizeSqFt || "N/A"} sq ft<br>
      <strong>Description:</strong> ${home.description || "N/A"}
    </p>

    <h5>Floor Plan</h5>
    <p>
      <strong>Bedrooms:</strong> ${home.floorPlan.bedrooms}<br>
      <strong>Bathrooms:</strong> ${home.floorPlan.bathrooms}<br>
      <strong>Square Feet:</strong> ${home.floorPlan.squareFeet}<br>
      <strong>Layout:</strong> ${home.floorPlan.layoutDescription || "N/A"}
    </p>

    <h5>Address Details</h5>
    <p>
      <strong>Street:</strong> ${home.address.street}<br>
      <strong>Unit:</strong> ${home.address.unit || "N/A"}<br>
      <strong>City:</strong> ${home.address.city}<br>
      <strong>State:</strong> ${home.address.state}<br>
      <strong>Zip:</strong> ${home.address.zipCode}<br>
      <strong>Coordinates:</strong> ${home.address.coordinates?.lat}, ${home.address.coordinates?.lng}
    </p>

    <h5>Images</h5>
    <div class="row">
      ${(home.images || []).map(img => `
        <div class="col-md-4 mb-3">
          <img src="${img}" class="img-fluid rounded border" />
        </div>
      `).join("")}
    </div>
  `;

  document.getElementById("detailsContent").innerHTML = html;

  new bootstrap.Modal(document.getElementById("detailsModal")).show();
}

/* -------------------------------
   ADD NEW HOME
--------------------------------*/
function openNewHomeModal() {
  new bootstrap.Modal(document.getElementById("newHomeModal")).show();
}

document.getElementById("newHomeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    userid: "string",
    username: document.getElementById("newUsername")?.value || "string",
    resellerName: document.getElementById("newReseller")?.value || "string",
    contactEmail: document.getElementById("newEmail")?.value || "string",
    contactPhone: document.getElementById("newPhone")?.value || "string",

    address: {
      street: document.getElementById("newStreet").value,
      unit: document.getElementById("newUnit")?.value || "",
      city: document.getElementById("newCity").value,
      state: document.getElementById("newState").value,
      zipCode: document.getElementById("newZip").value,
      coordinates: {
        lat: Number(document.getElementById("newLat")?.value || 0),
        lng: Number(document.getElementById("newLng")?.value || 0)
      }
    },

    floorPlan: {
      bedrooms: Number(document.getElementById("newBedrooms").value),
      bathrooms: Number(document.getElementById("newBathrooms").value),
      squareFeet: Number(document.getElementById("newSqft").value),
      layoutDescription: document.getElementById("newLayout").value,
      images: document.getElementById("newFloorImages").value
        .split(",")
        .map(i => i.trim())
        .filter(i => i.length > 0)
    },

    yearBuilt: Number(document.getElementById("newYear").value),
    lotSizeSqFt: Number(document.getElementById("newLot").value),
    propertyType: document.getElementById("newType").value,
    price: Number(document.getElementById("newPrice").value),
    status: document.getElementById("newStatus").value,
    description: document.getElementById("newDescription").value,

    images: document.getElementById("newImages").value
      .split(",")
      .map(i => i.trim())
      .filter(i => i.length > 0),

    createdAt: new Date().toISOString()
  };

  const res = await fetch(API_ROOT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    alert("Failed to create home.");
    return;
  }

  bootstrap.Modal.getInstance(document.getElementById("newHomeModal")).hide();
  loadAdminTable();
});

/* -------------------------------
   INITIAL LOAD
--------------------------------*/
document.addEventListener("DOMContentLoaded", loadHomes);
