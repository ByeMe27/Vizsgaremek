let products_container = document.getElementById("products-container");
let errordiv = document.getElementById("errordiv");

let kivalasztottKategoria = "";

let kosardiv = document.getElementById("cart-content");
let kosar = [];

function kategoriaValasztas(event) {
  let btn = event.target;
  let cat = btn.dataset.cat;

  if (kivalasztottKategoria == cat) return;

  document
    .querySelectorAll(".category-btn")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
  kivalasztottKategoria = cat;
}

async function minden() {
  try {
    let req = await fetch("./products.php/minden");
    let Data = await req.json();
    if (req.ok) {
      errordiv.hidden = true;
      for (const d of Data) {
        products_container.innerHTML += `
          <div class="col-12 col-md-6 col-lg-4 mb-3">
              <div class="card shadow-sm h-100">
                  <img src="${d.img}" class="card-img-top" alt="${d.nev}">
                  <div class="card-body d-flex flex-column">
                      <h5 id="product-name" class="card-title">${d.nev}</h5>
                      <p class="card-text">${d.leiras}</p>
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                          <span class="fw-bold">${d.ar} Ft</span>
                          <button class="btn btn-sm to-cart" data-id="${d.id}" data-nev="${d.nev}" data-ar="${d.ar}">Kosárba</button>
                      </div>
                  </div>
              </div>
          </div>
        `;
      }
    } else {
      products_container.innerHTML = "";
      throw Data.valasz;
    }
  } catch (error) {
    errordiv.hidden = false;
    errordiv.innerHTML = error;
    errordiv.className = "alert alert-danger";
  }
}

async function szures() {
  let min = document.getElementById("min-price").value;
  let max = document.getElementById("max-price").value;

  console.log("Keresés:", kivalasztottKategoria, min, max);

  try {
    let req = await fetch(
      `./products.php/szures?kategoria=${kivalasztottKategoria}&min=${min}&max=${max}`,
    );
    let Data = await req.json();

    if (req.ok) {
      errordiv.hidden = true;
      products_container.innerHTML = "";

      for (const d of Data) {
        products_container.innerHTML += `
          <div class="col-12 col-md-6 col-lg-4 mb-3">
              <div class="card shadow-sm h-100">
                <img src="${d.img}" class="card-img-top" alt="${d.nev}"> 
                <div class="card-body d-flex flex-column">
                      <h5 id="product-name" class="card-title">${d.nev}</h5>
                      <p class="card-text">${d.leiras}</p>
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                          <span class="fw-bold">${d.ar} Ft</span>
                          <button data-id="${d.id}" data-nev="${d.nev}" data-ar="${d.ar}" class="btn btn-primary btn-sm to-cart">Kosárba</button>
                      </div>
                  </div>
              </div>
          </div>
        `;
      }
    } else {
      products_container.innerHTML = "";
      throw Data.valasz;
    }
  } catch (error) {
    errordiv.hidden = false;
    errordiv.innerHTML = error;
    errordiv.className = "alert alert-danger";
  }
}

///////////////////////////////////////////////     KOSÁR MECHANIKA     /////////////////////////////////////////
products_container.addEventListener("click", function (event) {
  if (!event.target.classList.contains("to-cart")) return;

  let btn = event.target;

  let termek = {
    id: Number(btn.dataset.id),
    nev: btn.dataset.nev,
    ar: Number(btn.dataset.ar),
  };

  kosarbaRakas(termek);
});

function kosarbaRakas(termek) {
  let index = kosar.findIndex((t) => t.id === termek.id);

  if (index != -1) {
    kosar[index].db++;
  } else {
    kosar.push({
      id: termek.id,
      nev: termek.nev,
      ar: termek.ar,
      db: 1,
    });
  }

  kosarBetolt();
}

function kosarBetolt() {
  if (kosar.length == 0) {
    kosardiv.innerHTML = "A kosár jelenleg üres";
    return;
  }

  let stringbe = "";
  let osszeg = 0;

  for (const elem of kosar) {
    let reszosszeg = elem.ar * elem.db;
    osszeg += reszosszeg;

    stringbe += `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <strong>${elem.nev}</strong><br>
          <small>${elem.db} x ${elem.ar}</small>
        </div>
        <div class="fw-bold">
          ${reszosszeg} Ft
        </div>
      </div>  
    `;
  }

  stringbe += `
    <hr>
    <div class="d-flex justify-content-between fw-bold">
      <span>Összesen: ${osszeg} Ft</span>
    </div>
  `;

  kosardiv.innerHTML = stringbe;
}

async function rendeles() {

}


//////////////////SESSION

const userBtnEl = document.getElementById("user-login");
const userPopup = document.getElementById("user-popup");
const popupUsername = document.getElementById("popup-username");
const logoutBtn = document.getElementById("logout-btn");
const profileBtn = document.getElementById("profile");

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
    const res = await fetch("../login/login.php/logout", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Kijelentkezés sikertelen");

    window.location.href = "../login/login.html";
  } catch (err) {
    showGlobalAlert(err.message, "danger");
  }
});

profileBtn.addEventListener("click", async () => {
  try {
    window.location.href = "../profile/profile.html";
  } catch (err) {
    showGlobalAlert(err.message, "danger");
  }
});

async function userBtn() {
  const res = await fetch("../login/login.php/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");
  console.log(data);
  userBtnEl.innerHTML =
    data.name.split(" ")[0].charAt(0).toString().toUpperCase() +
    data.name.split(" ")[1].charAt(0).toString().toUpperCase();
}

async function userName() {
  const res = await fetch("../login/login.php/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");
  popupUsername.innerHTML += `Helló, ${data.name}!`;
}

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", kategoriaValasztas);
});
window.addEventListener("load", minden);
document.getElementById("search-btn").addEventListener("click", szures);
document.getElementById("place-order").addEventListener("click", rendeles);

window.addEventListener("DOMContentLoaded", async () => {
  await userBtn();
  await userName();
});
