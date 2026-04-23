const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("remember");
const errordiv = document.getElementById("errordiv");

function showAlert(message, type = "error") {
  const isSuccess = type === "success";
  const icon = isSuccess ? "fa-circle-check" : "fa-circle-exclamation";

  errordiv.className = "login-alert" + (isSuccess ? " success" : "");
  errordiv.innerHTML = `
    <div class="alert-icon">
      <i class="fa-solid ${icon}"></i>
    </div>
    <span>${message}</span>
  `;
  errordiv.hidden = false;
}

const rememberMe = async () => {
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }
};

const loginCheck = async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showAlert("Kérlek, töltsd ki az összes mezőt!");
    return;
  }

  try {
    const response = await fetch("./login.php/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, pwd: password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      if (rememberCheckbox.checked) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      let dots = 0;
      showAlert("Bejelentkezés folyamatban", "success");

      const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        errordiv.querySelector("span").textContent =
          "Bejelentkezés folyamatban" + ".".repeat(dots);
      }, 300);

      setTimeout(() => {
        clearInterval(interval);
        if (data.user.role === "admin" || data.user.role === "bufes") {
          window.location.href = "../dashboard/stats/stats.html";
        } else {
          window.location.href = "../products/products.html";
        }
      }, 1200);
    } else {
      showAlert(data.error || "Hiba történt a bejelentkezés során!");
    }
  } catch (error) {
    console.error(error);
    showAlert("Hálózati hiba. Kérlek, próbáld újra!");
  }
};

window.addEventListener("load", rememberMe);
document.getElementById("loginbtn").addEventListener("click", loginCheck);
