let orders_cont = document.getElementById("orders-container");
orders_cont.innerHTML = "";
let errordiv = document.getElementById("errordiv");
errordiv.innerHTML = "";

let rendelessData = []; // ide mentjük a betöltött rendeléseket, az újrarendeléshez kell

async function rendelesekBetolt() {
  try {
    let res = await fetch("./myorders.php?action=myorders");
    let data = await res.json();

    if (!res.ok) {
      throw data.valasz;
    }

    rendelessData = data;

    if (data.length === 0) {
      orders_cont.innerHTML = `<p class="text-muted">Még nincs leadott rendelésed.</p>`;
      return;
    }


    const statusClass = {
      "Leadva":    "status-pending",   
      "Átvehető":  "status-done",      
      "Átvéve":    "status-cancelled", 
    };

    for (const rendeles of data) {
      const badgeClass = statusClass[rendeles.statusz] ?? "status-pending";

      let termekSorok = "";
      for (const t of rendeles.termekek) {
        termekSorok += `
          <span class="order-meta">
            <span><i class="fa-solid fa-box"></i>${t.nev}</span>
            <span><i class="fa-solid fa-hashtag"></i>${t.mennyiseg} db &nbsp;·&nbsp; ${t.ar} Ft/db</span>
          </span>
          <hr class="order-divider">
        `;
      }

      orders_cont.innerHTML += `
        <div class="col-lg-4 col-md-6 mb-4 d-flex">
          <div class="card w-100 ${badgeClass}">
            <div class="card-body">
              <div class="order-header">
                <span class="order-id" style="font-size: 18px;">#${rendeles.rendeles_id}</span>
                <span class="order-status ${badgeClass}">${rendeles.statusz}</span>
              </div>
              <hr class="order-divider">
              ${termekSorok}
              <div class="order-meta" style="margin-top:4px;">
                <span><i class="fa-regular fa-clock"></i>${rendeles.datumido}</span>
              </div>
              <div class="mt-auto d-flex justify-content-end" style="margin-top:12px;">
                <button class="order-again ujra-rendel" data-rendeles-id="${rendeles.rendeles_id}">
                  <i class="fa-solid fa-rotate-right me-1"></i>Újra megrendelem
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }


    document.querySelectorAll(".ujra-rendel").forEach((gomb) => {
      gomb.addEventListener("click", ujraRendel);
    });

  } catch (error) {
    errordiv.hidden = false;
    errordiv.innerHTML = error;
    errordiv.className = "alert alert-danger";
  }
}

async function ujraRendel(e) {
  const rendelesId = parseInt(e.currentTarget.dataset.rendelesId);

  const rendeles = rendelessData.find((r) => r.rendeles_id === rendelesId);
  if (!rendeles) return;

  const termekek = rendeles.termekek.map((t) => ({
    term_id:   t.term_id,
    menu_id:   t.menu_id,
    mennyiseg: t.mennyiseg,
  }));

  try {
    const res = await fetch("./myorders.php?action=orderagain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ termekek }),
    });

    const data = await res.json();

    errordiv.hidden = false;
    errordiv.innerHTML = data.valasz;
    errordiv.className = res.ok ? "alert alert-success" : "alert alert-danger";

    if (res.ok) {
      orders_cont.innerHTML = "";
      rendelesekBetolt();
    }
  } catch (error) {
    errordiv.hidden = false;
    errordiv.innerHTML = "Hiba történt az újrarendelés során.";
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

/* ===========================
   BÜFÉ STÁTUSZ
=========================== */
function bufeStatusz() {
  const most = new Date();
  const nap = most.getDay(); // 0=vasárnap, 1=hétfő … 5=péntek
  const perc = most.getHours() * 60 + most.getMinutes();
  const nyit = 6 * 60 + 55; // 6:55
  const zar = 13 * 60 + 35; // 13:35

  const nyitva = nap >= 1 && nap <= 5 && perc >= nyit && perc < zar;

  const card = document.getElementById("bufe-status");
  card.className = "bufe-status-card " + (nyitva ? "open" : "closed");
  card.innerHTML = `
    <span class="status-dot"></span>
    <span>${nyitva ? "Nyitva" : "Zárva"}</span>
  `;
}

bufeStatusz();
setInterval(bufeStatusz, 30000);