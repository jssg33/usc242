// pictures.js

// Open modal and show current images
function openPicturesModal(id, homeJson) {
  const home = JSON.parse(decodeURIComponent(homeJson));

  document.getElementById("picturesHomeId").value = id;

  const container = document.getElementById("picturesCurrent");
  container.innerHTML = "";

  (home.images || []).forEach((url, index) => {
    container.innerHTML += `
      <div class="col-md-4 text-center">
        <img src="${url}" class="img-fluid rounded border mb-2">
        <button class="btn btn-danger btn-sm w-100" onclick="removePicture('${id}', ${index})">
          Remove
        </button>
      </div>
    `;
  });

  new bootstrap.Modal(document.getElementById("picturesModal")).show();
}

// Remove a single image by index
async function removePicture(id, index) {
  const res = await fetch(`${API_ROOT}/${id}`);
  const home = await res.json();

  home.images.splice(index, 1);

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images: home.images })
  });

  loadAdminTable();
  refreshPicturesModal(id);
}

// Refresh modal after deletion
async function refreshPicturesModal(id) {
  const res = await fetch(`${API_ROOT}/${id}`);
  const home = await res.json();
  const encoded = encodeURIComponent(JSON.stringify(home));
  openPicturesModal(id, encoded);
}

// Save new images
async function savePictures() {
  const id = document.getElementById("picturesHomeId").value;

  const newUrls = document.getElementById("picturesNew").value
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const res = await fetch(`${API_ROOT}/${id}`);
  const home = await res.json();

  home.images = [...home.images, ...newUrls];

  await fetch(`${API_ROOT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images: home.images })
  });

  document.getElementById("picturesNew").value = "";

  // ✅ THIS is the important line
  bootstrap.Modal.getInstance(document.getElementById("picturesModal")).hide();

  loadAdminTable();
}
