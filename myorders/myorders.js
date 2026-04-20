let orders_cont = document.getElementById("orders-container");
orders_cont.innerHTML = ""
let errordiv = document.getElementById("errordiv")
errordiv.innerHTML = "";

async function rendelesekBetolt() {
  try {
    let res = await fetch("./myorders.php/myorders");
    let data = await res.json();

    if (!res.ok) {
      throw data.valasz;
    }

    const borderSzin = {
      "Leadva":     "border: 2px solid orange;",
      "Átvéve":     "border: 2px solid red;",
      "Átvehető":   "border: 2px solid green;"
    };

    for (const rendeles of data) {
      //ha ismeretlen lenne a statusz
      const border = borderSzin[rendeles.statusz] ?? "border: 2px solid gray;";

      
      let termekSorok = "";
      for (const t of rendeles.termekek) {
        termekSorok += `<li>${t.nev} – ${t.mennyiseg} db – ${t.ar} Ft/db</li>`;
      }

      orders_cont.innerHTML += `
        <div class="col-lg-4 col-md-6 mb-4 d-flex">
          <div class="card shadow-sm w-100" style="${border}">
            <div class="card-body d-flex flex-column">
              <h3 class="card-title">Rendelés száma: #${rendeles.rendeles_id}</h3>
              <p class="card-text">${rendeles.datumido}</p>
              <p class="card-text">Státusz: <strong>${rendeles.statusz}</strong></p>
              <ul class="card-text">
                ${termekSorok}
              </ul>
              <div class="mt-auto d-flex justify-content-end">
                <button class="btn btn-sm order-again ujra-rendel" data-rendeles-id="${rendeles.rendeles_id}">
                  Újra megrendelem
                </button>
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
window.addEventListener("load", rendelesekBetolt);










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




