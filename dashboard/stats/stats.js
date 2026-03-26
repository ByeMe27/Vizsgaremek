let statusChart = null;
let feedbackChart = null;

const axisStyle = {
    ticks: { color: "#6b7280", font: { family: "Poppins", size: 11 } },
    grid: { color: "#3e4450" }
};

const statusColors = {
    "Leadva":     "#ff0000e6",
    "Átvehető":   "#ff8c32",
    "Átvéve":     "#2ecc71",
    "Kosárban":   "#41444bff"
};

async function loadStats() {
    try {
        const res = await fetch("./stats.php/query");
        if (!res.ok) throw new Error("Hiba a statisztikák lekérésekor.");
        const data = await res.json();

        document.getElementById("sc-osszes").textContent = data.osszes_rendeles + " db";
        document.getElementById("sc-bevetel").textContent = Number(data.osszes_bevetel).toLocaleString("hu-HU") + " Ft";
        document.getElementById("sc-atlag").textContent = Number(data.atlag_bevetel).toLocaleString("hu-HU") + " Ft";
        document.getElementById("sc-top").textContent = data.top_termek ?? "—";

        drawStatusChart(data.statuszok);
        drawFeedbackChart(data.visszajelzesek);
        showFeedbackCards(data.visszajelzes_lista);

    } catch (error) {
        console.error(error);
    }
}

function drawStatusChart(statuszok) {
    const colors = statuszok.map(s => statusColors[s.nev] ?? "#6b7280");

    const legend = document.getElementById("statusLegend");
    legend.innerHTML = statuszok.map((s, i) => `
        <span>
            <span class="legend-dot" style="background: ${colors[i]};"></span>
            ${s.nev} (${s.db})
        </span>
    `).join("");

    if (statusChart) statusChart.destroy();

    statusChart = new Chart(document.getElementById("statusChart"), {
        type: "doughnut",
        data: {
            labels: statuszok.map(s => s.nev),
            datasets: [{
                data: statuszok.map(s => parseInt(s.db)),
                backgroundColor: colors,
                borderColor: "#2e333b",
                borderWidth: 3,
                hoverOffset: 6
            }]
        },
        options: {
            plugins: { legend: { display: false } }
        }
    });
}

function drawFeedbackChart(visszajelzesek) {
    if (feedbackChart) feedbackChart.destroy();

    feedbackChart = new Chart(document.getElementById("feedbackChart"), {
        type: "bar",
        data: {
            labels: visszajelzesek.map(v => v.kategoria),
            datasets: [{
                data: visszajelzesek.map(v => parseInt(v.db)),
                backgroundColor: ["#ff8c32", "#2ecc71", "#3498db", "#9b59b6", "#e74c3c"],
                borderRadius: 7,
                borderSkipped: false
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { x: axisStyle, y: axisStyle }
        }
    });
}

function showFeedbackCards(lista) {
    const categoryColors = {
        "Termék":       "#ff8c32",
        "Kiszolgálás":  "#3498db",
        "Készlet":      "#9b59b6",
        "Ár":           "#2ecc71",
        "Egyéb":        "#6b7280"
    };

    const container = document.getElementById("feedbackCards");
    container.innerHTML = lista.map(f => {
        const color = categoryColors[f.kategoria] ?? "#6b7280";
        const datum = new Date(f.datumido).toLocaleString("hu-HU", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        });
        return `
            <div class="feedback-card">
                <div class="feedback-top">
                    <span class="feedback-badge" style="background: ${color}22; color: ${color}; border: 1px solid ${color}55;">
                        ${f.kategoria}
                    </span>
                    <span class="feedback-date">
                        <i class="fa-regular fa-clock"></i> ${datum}
                    </span>
                </div>
                <div class="feedback-text">${f.szoveg}</div>
            </div>
        `;
    }).join("");
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        const res = await fetch("../../login/login.php/logout", { credentials: "include" });
        if (!res.ok) throw new Error("Kijelentkezés sikertelen");
        window.location.href = "../../login/login.html";
    } catch (err) {}
});

window.addEventListener("DOMContentLoaded", loadStats);