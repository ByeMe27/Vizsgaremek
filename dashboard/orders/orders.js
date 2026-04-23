function getStatusBorder(statusz_id) {
  switch (parseInt(statusz_id)) {
    case 2:
      return "1px solid rgba(255, 0, 0, 0.9)";
    case 3:
      return "1px solid rgba(255, 140, 50, 0.5)";
    case 4:
      return "1px solid rgba(46, 204, 113, 0.5)";
    default:
      return "1px solid #3e4450";
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

    card.style.border = getStatusBorder(statusz_id);

    if (parseInt(statusz_id) === 4) {
      setTimeout(async () => {
        card.style.transition = "opacity 1s, transform 1s";
        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";
        setTimeout(async () => {
          await loadOrders();
        }, 500);
      }, 5000);
    }
  } catch (err) {
    console.error(err);
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
    await loadOrders();
  } catch (err) {
    console.error(err);
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
      const totalAr = order.termekek.reduce((total, t) => total + t.ar, 0);

      const termekekStr = order.termekek
        .map((t) => {
          const alap = `${t.nev} (${t.mennyiseg}db)`;
          if (t.menu_termekek && t.menu_termekek.length > 0) {
            return `${alap}: ${t.menu_termekek.join(", ")}`;
          }
          return alap;
        })
        .join(" | ");

      const card = document.createElement("div");
      card.className = "order-card";
      card.style.border = getStatusBorder(order.statusz_id);

      card.innerHTML = `
        <div class="order-id-col">
          <span class="order-id-label">ID</span>
          <span class="order-id-value">${order.id}</span>
        </div>
        <div class="order-divider"></div>
        <div class="order-info">
          <span class="order-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${order.datumido}
          </span>
          <div class="order-products"><strong>Termék:</strong> ${termekekStr}</div>
          <span class="order-price">${totalAr.toLocaleString("hu-HU")} Ft</span>
        </div>
        <div class="order-actions">
          <button class="btn-action btn-delete delete-btn">Törlés</button>
          <button class="btn-action btn-process status-btn" data-status="2">Feldolgozás alatt</button>
          <button class="btn-action btn-ready status-btn" data-status="3">Átvehető</button>
          <button class="btn-action btn-done status-btn" data-status="4">Átvéve</button>
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
  } catch (err) {}
});

window.addEventListener("DOMContentLoaded", loadOrders);
