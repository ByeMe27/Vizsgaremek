function showGlobalAlert(message, type = "success", duration = 5000) {
  const container = document.getElementById("global-alerts") || document.body;
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

async function loadMenus() {
  try {
    const res = await fetch("./menus.php/query");
    if (!res.ok) throw new Error("Hiba a menük lekérésekor");
    const menus = await res.json();

    const container = document.getElementById("result");
    container.innerHTML = '<div class="row" id="menuRow"></div>';
    const row = document.getElementById("menuRow");

    menus.forEach((menu) => {
      row.innerHTML += `
        <div class="col-md-3 mb-4 d-flex">
          <div class="card shadow-sm w-100">
            <img src="uploads/${menu.img}" class="card-img-top" style="height:200px; object-fit:contain;" alt="${menu.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${menu.name}</h5>
              <p class="card-text">${menu.termekek}</p>
              <p class="fw-bold mt-auto">${menu.price} Ft</p>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hiba a menük betöltésekor!", "danger");
  }
}

async function loadSelectProducts() {
  try {
    const res = await fetch("./menus.php/select");
    const products = await res.json();

    const p1 = document.getElementById("product1");
    const p2 = document.getElementById("product2");
    p1.innerHTML =
      "<option selected disabled>Válaszd az első terméket...</option>";
    p2.innerHTML =
      "<option selected disabled>Válaszd a második terméket...</option>";

    products.forEach((prod) => {
      const o1 = document.createElement("option");
      o1.value = prod.id;
      o1.textContent = prod.nev;
      p1.appendChild(o1);

      const o2 = document.createElement("option");
      o2.value = prod.id;
      o2.textContent = prod.nev;
      p2.appendChild(o2);
    });
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hiba a termékek betöltésekor!", "danger");
  }
}

async function loadMenuSelect() {
  try {
    const res = await fetch("./menus.php/selectmenu");
    const menus = await res.json();

    const changeSelect = document.getElementById("changeSelect");
    const deleteSelect = document.getElementById("deleteSelect");
    changeSelect.innerHTML =
      "<option selected disabled>Válassz menüt módosításhoz...</option>";
    deleteSelect.innerHTML =
      "<option selected disabled>Válassz menüt törléshez...</option>";

    menus.forEach((menu) => {
      const o1 = document.createElement("option");
      o1.value = menu.id;
      o1.textContent = menu.name;
      changeSelect.appendChild(o1);

      const o2 = document.createElement("option");
      o2.value = menu.id;
      o2.textContent = menu.name;
      deleteSelect.appendChild(o2);
    });
  } catch (error) {
    console.error(error);
    showGlobalAlert("Hiba a menük betöltésekor!", "danger");
  }
}

async function createMenu() {
  const name = document.getElementById("newName").value;
  const price = document.getElementById("newPrice").value;
  const prod1 = document.getElementById("product1").value;
  const prod2 = document.getElementById("product2").value;
  const imageFile = document.getElementById("newImage").files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("termek_id1", prod1);
  formData.append("termek_id2", prod2);
  formData.append("image", imageFile);

  try {
    const res = await fetch("./menus.php/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");
    document.getElementById("form").reset();

    showGlobalAlert(data.Siker, "success");
    await loadMenuSelect();
    await loadMenus();
  } catch (error) {
    console.error(error);
    showGlobalAlert(error.message, "danger");
  }
}

async function changeMenu() {
  const id = document.getElementById("changeSelect").value;
  const name = document.getElementById("changeName").value;
  const price = document.getElementById("changePrice").value;

  try {
    const res = await fetch("./menus.php/change", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, price }),
    });
    const data = await res.json();
    if (!res.ok) {
      return showGlobalAlert(data.Hiba || "Hiba történt!", "danger");
    }
    document.getElementById("form2").reset();

    showGlobalAlert(data.Siker, "success");
    await loadMenuSelect();
    await loadMenus();
  } catch (error) {
    console.error(error);
    showGlobalAlert(error.Error, "danger");
  }
}

async function deleteMenu() {
  const id = document.getElementById("deleteSelect").value;
  const deleteReason = document.getElementById("deleteReason");

  if (deleteReason.value == "") {
    return showGlobalAlert("Hiányzó adat!", "danger");
  }

  try {
    const res = await fetch("./menus.php/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) return showGlobalAlert(data.Hiba || "Hiba történt!");
    document.getElementById("form3").reset();

    showGlobalAlert(data.Siker, "success");
    await loadMenuSelect();
    await loadMenus();
  } catch (error) {
    console.error(error);
    showGlobalAlert(error.message, "danger");
  }
}

document.getElementById("newBtn").addEventListener("click", (e) => {
  e.preventDefault();
  createMenu();
});
document.getElementById("changeBtn").addEventListener("click", (e) => {
  e.preventDefault();
  changeMenu();
});
document.getElementById("deleteBtn").addEventListener("click", (e) => {
  e.preventDefault();
  deleteMenu();
});

const logoutBtn = document.getElementById("logoutBtn");

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

async function loadCurrent() {
  const changeSelect = document.getElementById("changeSelect").value;
  let changename = document.getElementById("changeName");
  let changeprice = document.getElementById("changePrice");
  const res = await fetch("./menus.php/dataquery?id=" + changeSelect);
  if (!res.ok) throw new Error("Hiba a termékek lekérésekor.");
  const data = await res.json();

  changename.value = data[0].name;
  changeprice.value = data[0].price;
}

const changeSelect = document.getElementById("changeSelect");
changeSelect.addEventListener("change", loadCurrent);

window.addEventListener("DOMContentLoaded", async () => {
  await loadSelectProducts();
  await loadMenuSelect();
  await loadMenus();
});
