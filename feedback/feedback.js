let errordiv = document.getElementById("errordiv");
errordiv.innerHTML = "";

let kivalasztottKategoria = "";

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
        body: JSON.stringify({ "szoveg": szoveg, "kategoria": kategoria })
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

  document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
  kivalasztottKategoria = cat;

  VisszajelzesekBetolt(kivalasztottKategoria)
}
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", kategoriaValasztas);
});


async function VisszajelzesekBetolt(kat){
  document.getElementById("feedbacks").innerHTML ="";
  try {
    let res = await fetch(`./feedback.php/feedbacks?kategoria=${kat}`);
    let Data = await res.json();

    if(res.ok){

      for (const fb of Data) {
        document.getElementById("feedbacks").innerHTML+=
      `
        <div class="feedback-card card mb-3 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <p id="poszt_kategoria" class="card-text mb-0">${fb.kategoria}</p>
              <small id="poszt_datum" class="text-white">${fb.datumido}</small>
            </div>
            <h5 id="poszt_szoveg" class="card-title mt-3">${fb.szoveg}</h5>
          </div>
        </div>
      `
      }
      
    }
  } catch (error) {
    console.log(error)
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