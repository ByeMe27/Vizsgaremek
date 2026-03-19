let errordiv = document.getElementById("errordiv");
let menus_container = document.getElementById("menus-container")
async function menukBetolt(){
  try {
    let res = await fetch("./menus.php/minden");
    let Data = await res.json();

    if(!res.ok){
      throw Data.valasz
    }

    for (const menu of Data) {
      menus_container.innerHTML += `
        <div class="col-md-4 mb-4 d-flex">
          <div class="card shadow-sm w-100">
            <img src="../dashboard/menus/uploads/${menu.img}" class="card-img-top" style="height:200px; object-fit:cover;" alt="${menu.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${menu.name}</h5>
              <p class="card-text">${menu.termekek}</p>
              <p class="fw-bold mt-auto">${menu.price} Ft</p>
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
window.addEventListener("load", menukBetolt)





































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

window.addEventListener("DOMContentLoaded", async () => {
  await userBtn();
  await userName();
});
