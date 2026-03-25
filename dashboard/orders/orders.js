function showGlobalAlert(message, type = "success", duration = 5000) {
  const container = document.getElementById("global-alerts") || document.body;
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} shadow-sm`;
  alert.style.marginBottom = "10px";
  alert.style.backgroundColor =
    type === "success" ? "#01a828" : type === "danger" ? "#b82632" : "#947615";
  alert.style.color = "#fff";
  alert.style.padding = "10px 15px";
  alert.style.borderRadius = "8px";
  alert.style.transition = "opacity 0.5s, transform 0.5s";
  alert.innerText = message;

  container.appendChild(alert);

  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.transform = "translateY(20px)";
    setTimeout(() => alert.remove(), 500);
  }, duration);
}

function getStatusColor(statusz_id) {
  switch (parseInt(statusz_id)) {
    case 2:
      return "#b82632";
    case 3:
      return "#947615";
    case 4:
      return "#01a828";
    default:
      return "#3b4049";
  }
}

async function changeOrderStatus(id, statusz_id, card) {
  try {
    const res = await fetch("./orders.php/change", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statusz_id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");

    card.style.backgroundColor = getStatusColor(statusz_id);
    showGlobalAlert("Státusz módosítva!", "success");

    if (parseInt(statusz_id) === 4) {
      setTimeout(() => {
        card.style.transition = "opacity 1s, transform 1s";
        card.style.opacity = "0";
        card.style.transform = "translateX(100%)";
        setTimeout(async () => {
          await deleteOrder(id);
        }, 1000);
      }, 5000);
    }
  } catch (err) {
    console.error(err);
    showGlobalAlert(err.message, "danger");
  }
}

async function deleteOrder(id) {
  try {
    const res = await fetch("./orders.php/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.Hiba || "Hiba történt!");
    showGlobalAlert("Rendelés törölve!", "success");
    await loadOrders();
  } catch (err) {
    console.error(err);
    showGlobalAlert(err.message, "danger");
  }
}

async function loadOrders() {
  try {
    const res = await fetch("./orders.php/query");
    if (!res.ok) throw new Error("Jelenleg nincsenek rendelések!");
    const orders = await res.json();

    const cardsContainer = document.getElementById("cards");
    cardsContainer.innerHTML = "";

    orders.forEach((order) => {
      const card = document.createElement("div");
      card.className =
        "card shadow-sm p-3 d-flex flex-row justify-content-between align-items-center";
      card.style.backgroundColor = getStatusColor(order.statusz_id);

      card.innerHTML = `
        <div>
          <strong>ID:</strong> ${order.id} <br>
          <strong>Dátum:</strong> ${order.datumido} <br>
          <strong>Termék:</strong> ${order.termekek
            .map((t) => `${t.nev} (${t.mennyiseg}db)`)
            .join(", ")} <br>
          <strong>Ár:</strong> ${order.termekek.reduce((total, t) => total + t.ar, 0)} Ft
        </div>
        <div class="d-flex gap-1 flex-column flex-md-row">
          <button class="btn btn-sm btn-danger delete-btn">Törlés</button>
          <button class="btn btn-sm btn-outline-danger status-btn text-light" data-status="2">Feldolgozás alatt</button>
          <button class="btn btn-sm btn-outline-warning status-btn text-light" data-status="3">Átvehető</button>
          <button class="btn btn-sm btn-outline-success status-btn text-light" data-status="4">Átvéve</button>
        </div>
      `;

      cardsContainer.appendChild(card);

      card
        .querySelector(".delete-btn")
        .addEventListener("click", () => deleteOrder(order.id));
      card
        .querySelectorAll(".status-btn")
        .forEach((btn) =>
          btn.addEventListener("click", () =>
            changeOrderStatus(order.id, btn.dataset.status, card),
          ),
        );
    });
  } catch (error) {
    console.error(error);
    showGlobalAlert(error.message, "danger");
  }
}

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

window.addEventListener("DOMContentLoaded", loadOrders);
