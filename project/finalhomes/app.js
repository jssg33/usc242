const API_ROOT = "https://api242.onrender.com/api/homes";

// Switch views
function showUserView() {
  document.getElementById("userView").style.display = "block";
  document.getElementById("adminPage").style.display = "none";
}

function showAdminPage() {
  document.getElementById("userView").style.display = "none";
  document.getElementById("adminPage").style.display = "block";
  loadAdminTable();
}

// Load homes for user view
async function loadHomes() {
  const res = await fetch(API_ROOT);
  const homes = await res.json();

  const container = document.getElementById("homesContainer");
  container.innerHTML = "";

  homes.forEach((home) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card home-card shadow-sm">
        <img src="${home.images?.[0] || 'https://via.placeholder.com/400'}" class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">${home.address.street}, ${home.address.city}</h5>
          <p class="card-text">
            <strong>Price:</strong> $${home.price.toLocaleString()}<br>
            <strong>Bedrooms:</strong> ${home.floorPlan.bedrooms}<br>
            <strong>Bathrooms:</strong> ${home.floorPlan.bathrooms}<br>
            <strong>SqFt:</strong>${home.floorPlan.squareFeet}<br>
            <strong>Descr:</strong>${home.floorPlan.layoutDescription}
          </p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Load admin table
async function loadAdminTable() {
  const res = await fetch(API_ROOT);
  const homes = await res.json();

  const table = document.getElementById("adminTableBody");
  table.innerHTML = "";

  homes.forEach((home) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${home._id || "N/A"}</td>
      <td>${home.address.street}, ${home.address.city}</td>
      <td>$${home.price.toLocaleString()}</td>
      <td>${home.status}</td>
      <td>${home.floorPlan.bedrooms}</td>
      <td>${home.floorPlan.bathrooms}</td>
       <td>
        <button class="btn btn-warning btn-sm" onclick="updateHome('${home._id}')">Update Realtor Info</button>
        <button class="btn btn-warning btn-sm" onclick="updateHome('${home._id}')">Update Property Info</button>
        <button class="btn btn-danger btn-sm" onclick="deleteHome('${home._id}')">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });
}

// Update home (simple prompt-based demo)
async function updateHome(id) {
  const newPrice = prompt("Enter new price:");

  if (!newPrice) return;

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: Number(newPrice) })
  });

  alert("Home updated!");
  loadAdminTable();
}

// Delete home
async function deleteHome(id) {
  if (!confirm("Are you sure you want to delete this home?")) return;

  await fetch(`${API_ROOT}/${id}`, {
    method: "DELETE"
  });

  alert("Home deleted!");
  loadAdminTable();
}

// Initial load
loadHomes();
