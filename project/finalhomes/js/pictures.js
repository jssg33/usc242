/* =====================================
   PICTURES MANAGEMENT
===================================== */

// Open Pictures Modal
function openPicturesModal(id, homeJson) {
  const home = JSON.parse(decodeURIComponent(homeJson));
  
  // Set the hidden ID
  document.getElementById("picturesHomeId").value = id;

  // Display current images
  const container = document.getElementById("picturesCurrent");
  container.innerHTML = "";

  const images = home.images || [];
  
  if (images.length === 0) {
    container.innerHTML = `<p class="text-muted">No images currently uploaded.</p>`;
  } else {
    images.forEach((imgUrl, index) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";
      col.innerHTML = `
        <div class="position-relative">
          <img src="${imgUrl}" 
               class="img-fluid rounded shadow-sm" 
               style="max-height: 160px; width: 100%; object-fit: cover;">
          <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                  onclick="removeImage('${id}', ${index})">
            Remove
          </button>
        </div>
        <small class="text-muted d-block text-center mt-1">${imgUrl.split('/').pop()}</small>
      `;
      container.appendChild(col);
    });
  }

  // Clear new images textarea
  document.getElementById("picturesNew").value = "";

  // Show modal
  new bootstrap.Modal(document.getElementById("picturesModal")).show();
}

// Save new pictures (append)
async function savePictures() {
  const id = document.getElementById("picturesHomeId").value;
  const textarea = document.getElementById("picturesNew");
  const newUrlsText = textarea.value.trim();

  if (!newUrlsText) {
    alert("Please enter at least one image URL.");
    return;
  }

  const newUrls = newUrlsText
    .split("\n")
    .map(url => url.trim())
    .filter(url => url.length > 5); // basic validation

  if (newUrls.length === 0) return;

  try {
    const response = await fetch(`${API_ROOT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newUrls })
    });

    if (response.ok) {
      alert("Pictures updated successfully!");
      bootstrap.Modal.getInstance(document.getElementById("picturesModal")).hide();
      loadAdminTable(); // Refresh the admin table
    } else {
      alert("Failed to update pictures.");
    }
  } catch (error) {
    console.error("Error saving pictures:", error);
    alert("Error saving pictures. Check console for details.");
  }
}

// Remove a single image (optional - needs backend support)
async function removeImage(id, index) {
  if (!confirm("Remove this image?")) return;

  try {
    // For now, this is a placeholder. 
    // You may need a better backend endpoint to remove specific image by index.
    alert("Image removal by index requires backend support.\n\nFor now, you can use 'Add New Image URLs' to replace them.");
    
    // Future improvement example:
    // await fetch(`${API_ROOT}/${id}/images/${index}`, { method: "DELETE" });
    // loadAdminTable();
  } catch (err) {
    console.error(err);
  }
}
