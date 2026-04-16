let orders_cont = document.getElementById("orders-container");
orders_cont.innerHTML = ""
let errordiv = document.getElementById("errordiv")
errordiv.innerHTML = "";

async function RendelesekBetolt(){
  try {
    let res = await fetch("./myorders.php/myorders");

    if(res.ok){
      let data = await res.json()

      for (const order of data) {
        orders_cont.innerHTML = `
          <div class="col-md-4 mb-4 d-flex">
            <div class="card shadow-sm w-100">
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
        `
      }
    }
    else{
      errordiv.hidden = false
      errordiv.innerHTML = "Korábbi rendeléseid betöltése sikertelen"
      errordiv.className = "alert alert-danger"
    }
  } catch (error) {
    
  }
}
window.addEventListener("load", RendelesekBetolt)










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




