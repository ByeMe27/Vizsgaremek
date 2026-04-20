let errordiv = document.getElementById("errordiv");
let menus_container = document.getElementById("menus-container");
let kosardiv = document.getElementById("cart-content");
let kosar = [];
async function menukBetolt() {
  try {
    let res = await fetch("./menus.php/minden");
    let Data = await res.json();

    if (!res.ok) {
      throw Data.valasz;
    }

    for (const menu of Data) {
      menus_container.innerHTML += `
        <div class="col-md-4 mb-4 d-flex">
          <div class="card shadow-sm w-100">
            <img src="../dashboard/menus/uploads/${menu.img}" class="card-img-top" style="height:200px; object-fit:contain;" alt="${menu.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title menu-name">${menu.name}</h5>
              <p class="card-text">${menu.termekek}</p>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <span class="fw-bold">${menu.price} Ft</span>
                <button class="btn btn-sm to-cart" data-id="${menu.id}" data-nev="${menu.name}" data-ar="${menu.price}">Kosárba</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    errordiv.hidden = false;
    errordiv.innerHTML = error;
    errordiv.className = "alert alert-danger";
  }
}
window.addEventListener("load", menukBetolt);

menus_container.addEventListener("click", function (event) {
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
        <div class="d-flex align-items-center gap-3">
          <span class="fw-bold">${reszosszeg} Ft</span>
          <button type="button" class="remove-from-cart btn btn-danger" data-id="${elem.id}">x</button>
        </div>
      </div>  
    `;
  }

  document.getElementById("cart-price").innerHTML = `
    <hr>
    <div class="d-flex justify-content-between fw-bold">
      <span>Összesen: ${osszeg} Ft</span>
    </div>
  `;

  kosardiv.innerHTML = stringbe;
}


document.getElementById("cart-content").addEventListener("click", function (event) {
  

  let btn = event.target;

  for (let i = 0; i < kosar.length; i++) {
    if(kosar[i].id == btn.dataset.id) {
      let index = i;
      kosar.splice(index, 1);
    }
  }

  kosarBetolt()


  
});


///////////////////////////////////////////////     RENDELÉS LEADÁS     /////////////////////////////////////////
async function rendeles() {
  document.getElementById("cart-price").innerHTML = "";
  if (kosar.lenght == 0) {
    kosardiv.innerHTML = "A kosár üres!";
    return;
  }

  try {
    let res = await fetch("./menus.php/rendeles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        kosar.map((t) => ({
          id: t.id,
          db: t.db,
        })),
      ),
    });

    let data = await res.json();

    if (!res.ok) {
      throw new Error(data.valasz || "Váratlan hiba történt!");
    }

    kosardiv.innerHTML = `<div role="alert" class="alert alert-success">
        Rendelés sikeresen leadva! <br> A Rendeléseim menüpontban nyomon követheted a rendeléseidet!
      </div>`;
    kosar = [];
  } catch (error) {
    kosardiv.innerHTML = `<div role="alert" class="alert alert-danger">Hiba a rendelés során: ${error.message}</div>`;
    document.getElementById("cart-price").innerHTML = "";
  }
}
document.getElementById("place-order").addEventListener("click", rendeles)

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
    window.location.href = "profile/profile.html";
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

window.addEventListener("DOMContentLoaded", async () => {
  await userBtn();
  await userName();
});
