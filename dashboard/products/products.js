function showGlobalAlert(message, type = "success", duration = 5000) {
  const container = document.getElementById("global-alerts");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} shadow-sm`;
  alert.style.marginBottom = "10px";
  alert.innerText = message;
  container.appendChild(alert);
  setTimeout(() => {
    alert.style.transition = "opacity 0.5s, transform 0.5s";
    alert.style.opacity = "0";
    alert.style.transform = "translateY(20px)";
    setTimeout(() => alert.remove(), 500);
  }, duration);
}

async function loadProducts() {
  try {
    const res = await fetch("./products.php/query");
    if (!res.ok) throw new Error("Hiba a termékek lekérésekor.");

    const products = await res.json();

    const container = document.getElementById("showproduct");
    container.innerHTML = "";

    container.innerHTML = `<div class="row" id="productRow"></div>`;
    const row = document.getElementById("productRow");

    products.forEach((product) => {
      row.innerHTML += `
        <div class="col-md-4 mb-4 d-flex">
          <div class="card shadow-sm w-100">
            <img src="http://localhost/projekt/dashboard/products/uploads/${product.img}"
                 class="card-img-top"
                 alt="${product.nev}"
                 style="object-fit: cover; height: 200px; border-radius: 16px 16px 0 0;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.nev}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${product.kategoria}</h6>
              <p class="card-text">${product.leiras}</p>
              <p class="fw-bold mt-auto">${product.ar} Ft</p>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hiba a termékek betöltésekor!", "danger");
  }
}

async function loadSelectProducts() {
  try {
    const res = await fetch("./products.php/select");
    if (!res.ok) throw new Error("Hiba a select adatok lekérésekor");
    const products = await res.json();

    const changeSelect = document.getElementById("changeSelect");
    const deleteSelect = document.getElementById("deleteSelect");

    changeSelect.innerHTML =
      "<option selected disabled>Válassz terméket a módósításhoz...</option>";
    deleteSelect.innerHTML =
      "<option selected disabled>Válassz terméket törléshez...</option>";

    products.forEach((prod) => {
      const option1 = document.createElement("option");
      option1.value = prod.id;
      option1.text = prod.nev;
      changeSelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = prod.id;
      option2.text = prod.nev;
      deleteSelect.appendChild(option2);
    });
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hiba a termékek betöltésekor!", "danger");
  }
}

async function createProduct() {
  const upname = document.getElementById("upname").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const imageFile = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("nev", upname);
  formData.append("leiras", description);
  formData.append("kategoria", category);
  formData.append("ar", price);
  formData.append("image", imageFile);

  try {
    const response = await fetch("./products.php/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      showGlobalAlert(data.Hiba || "Hiba történt!", "danger");
    } else {
      showGlobalAlert("Sikeres termék hozzáadás!", "success");
      await loadSelectProducts();
    }
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hálózati hiba!", "danger");
  }
}

async function changeProduct() {
  const id = document.getElementById("changeSelect").value;
  const nev = document.getElementById("changename").value;
  const kategoria = document.getElementById("changecategory").value;
  const leiras = document.getElementById("changedescription").value;
  const ar = document.getElementById("changeprice").value;

  if (!id || id === "Válassz terméket a módósításhoz...") {
    showGlobalAlert("Kérlek válassz egy terméket!", "danger");
    return;
  }

  try {
    const response = await fetch("./products.php/change", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, nev, kategoria, leiras, ar }),
    });
    const data = await response.json();

    if (!response.ok) {
      showGlobalAlert(data.Hiba || "Hiba történt!", "danger");
    } else {
      showGlobalAlert("Sikeres módosítás!", "success");
      await loadSelectProducts();
    }
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hálózati hiba!", "danger");
  }
}

async function deleteProduct() {
  const id = document.getElementById("deleteSelect").value;
  const deleteReason = document.getElementById("deleteReason").value;

  if (!id || id === "Válassz terméket törléshez...") {
    showGlobalAlert("Kérlek válassz egy terméket!", "danger");
    return;
  }
  if (!deleteReason) {
    showGlobalAlert("Kérlek add meg az törlés okát!", "danger");
    return;
  }

  try {
    const response = await fetch("./products.php/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();

    if (!response.ok) {
      showGlobalAlert(data.Hiba || "Hiba történt!", "danger");
    } else {
      showGlobalAlert("Sikeres törlés!", "success");
      await loadSelectProducts();
    }
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hálózati hiba!", "danger");
  }
}

document.getElementById("createBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  await createProduct();
  await loadProducts();
});
document.getElementById("selectBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  await changeProduct();
  await loadProducts();
});
document.getElementById("deleteBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  await deleteProduct();
  await loadProducts();
});

const userBtnEl = document.getElementById("user-login");
const userPopup = document.getElementById("user-popup");
const popupUsername = document.getElementById("popup-username");
const logoutBtn = document.getElementById("logout-btn");

userBtnEl.addEventListener("click", (e) => {
  e.stopPropagation();
  userPopup.style.display =
    userPopup.style.display === "block" ? "none" : "block";
  });
  
document.addEventListener("click", (e) => {
  if (!userPopup.contains(e.target) && e.target !== userBtnEl) {
    userPopup.style.display = "none";
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("../../login/login.php/logout", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Kijelentkezés sikertelen");
    
    window.location.href = "../../login/login.html";
  } catch (err) {
    showGlobalAlert(err.message, "danger");
  }
});

async function userBtn() {
  const res = await fetch("../../login/login.php/me");
    const data = await res.json();
    if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");
    console.log(data);
    userBtnEl.innerHTML = data.name.split(" ")[0].charAt(0).toString().toUpperCase() + data.name.split(" ")[1].charAt(0).toString().toUpperCase();
}

async function userName() {
    const res = await fetch("../../login/login.php/me");
    const data = await res.json();
    if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");
    popupUsername.innerHTML += `Helló, ${data.name}!`;
}

window.addEventListener("DOMContentLoaded", loadSelectProducts);
window.addEventListener("DOMContentLoaded", loadProducts);
window.addEventListener("DOMContentLoaded", async () => {
  await userBtn();
  await userName();
});

