const API = "https://api242.onrender.com/licenses";

/* ===================== LOAD ALL LICENSES ===================== */
async function loadLicenses() {
  const res = await fetch(API);
  console.log("all", res);
  const data = await res.json();

  const tbody = document.querySelector("#licenseTable tbody");
  tbody.innerHTML = "";

  data.forEach(lic => {
    const row = `
      <tr>
        <td>${lic.licenseid}</td>
        <td>${lic.version}</td>
        <td>${lic.installdate}</td>
        <td>${lic.enddate}</td>
        <td>${lic.customerid}</td>
        <td>${lic.productid}</td>
        <td>${lic.description}</td>
        <td>${lic.releaseyear}</td>
        <td><button class="btn btn-sm btn-primary" onclick='selectLicense(${JSON.stringify(lic)})'>Select</button></td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

/* ===================== SELECT LICENSE FOR UPDATE ===================== */
function selectLicense(lic) {
  const form = document.querySelector("#updateForm");

  Object.keys(lic).forEach(key => {
    if (form[key]) form[key].value = lic[key];
  });
}

/* ===================== INSERT LICENSE ===================== */
document.querySelector("#insertForm").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  alert("License inserted");
  loadLicenses();
});

/* ===================== UPDATE LICENSE ===================== */
document.querySelector("#updateForm").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());
  const id = formData.licenseid;

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  alert("License updated");
  loadLicenses();
});

/* Load on startup */
loadLicenses();
