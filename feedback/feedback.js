let errordiv = document.getElementById("errordiv");
errordiv.innerHTML = "";

let kivalasztottKategoria = "";

// Kategória → badge CSS osztály mapping
function getBadgeClass(kategoria) {
  switch (kategoria) {
    case "Termék":
      return "badge-cat badge-cat-termek";
    case "Kiszolgálás":
      return "badge-cat badge-cat-kiszolgalas";
    case "Ár":
      return "badge-cat badge-cat-ar";
    default:
      return "badge-cat badge-cat-egyeb";
  }
}

async function UjPoszt() {
  try {
    let datumres = await fetch("./feedback.php/userslatestpost");
    let datumData = await datumres.json();

    if (datumData.varjmeg > 0) {
      errordiv.hidden = false;
      errordiv.innerHTML = `Túl gyorsan posztolsz, várj még ${datumData.varjmeg} percet!`;
      errordiv.classList = "alert alert-danger";
    } else {
      let szoveg = document.getElementById("feedback_szoveg").value;
      let kategoria = document.getElementById("kat_select").value;

      document.getElementById("feedback_szoveg").value = "";
      document.getElementById("kat_select").value = "Mivel kapcsolatban írsz?";

      let ujposztres = await fetch("./feedback.php/newfeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ szoveg: szoveg, kategoria: kategoria }),
      });

      if (!ujposztres.ok) {
        let ujposztData = await ujposztres.json();
        errordiv.hidden = false;
        errordiv.innerHTML = ujposztData.valasz;
        errordiv.classList = "alert alert-danger";
      } else {
        errordiv.hidden = false;
        errordiv.innerHTML = "Visszajelzés közzétéve!";
        errordiv.classList = "alert alert-success";
        VisszajelzesekBetolt("osszes");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

document.getElementById("post_feedback").addEventListener("click", UjPoszt);

function kategoriaValasztas(event) {
  let btn = event.target;
  let cat = btn.dataset.cat;

  if (kivalasztottKategoria == cat) return;

  document
    .querySelectorAll(".category-btn")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
  kivalasztottKategoria = cat;

  VisszajelzesekBetolt(kivalasztottKategoria);
}
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", kategoriaValasztas);
});

async function VisszajelzesekBetolt(kat) {
  document.getElementById("feedbacks").innerHTML = "";
  try {
    let res = await fetch(`./feedback.php/feedbacks?kategoria=${kat}`);
    let Data = await res.json();

    if (res.ok) {
      for (const fb of Data) {
        document.getElementById("feedbacks").innerHTML += `
          <div class="feedback-card">
            <div class="feedback-card-header">
              <span id="poszt_kategoria" class="${getBadgeClass(fb.kategoria)}">${fb.kategoria}</span>
              <span id="poszt_datum" class="feedback-card-date">
                <i class="fa-regular fa-clock" style="font-size:11px;"></i> ${fb.datumido}
              </span>
            </div>
            <p id="poszt_szoveg" class="feedback-card-text">${fb.szoveg}</p>
          </div>
        `;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
window.addEventListener("load", VisszajelzesekBetolt("osszes"));

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
    window.location.href = "./profile/profile.html";
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
