const form = document.querySelector("form");
const nameInput = form.querySelector("input[name='name']");
const emailInput = form.querySelector("input[name='email']");
const classInput = form.querySelector("input[name='class']");
const passwordInput = form.querySelector("input[name='psw']");
const errordiv = document.getElementById("errordiv");

function showAlert(message, type = "error") {
  const isSuccess = type === "success";
  const icon = isSuccess ? "fa-circle-check" : "fa-circle-exclamation";

  errordiv.className = "register-alert" + (isSuccess ? " success" : "");
  errordiv.innerHTML = `
    <div class="alert-icon">
      <i class="fa-solid ${icon}"></i>
    </div>
    <span>${message}</span>
  `;
  errordiv.hidden = false;
}

const registerCheck = async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const className = classInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !className || !password) {
    showAlert("Kérlek, töltsd ki az összes mezőt!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert("Kérlek, írj be egy érvényes e-mail címet!");
    return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    showAlert(
      "A jelszónak legalább 8 karakterből kell állnia, és tartalmaznia kell legalább egy nagybetűt és egy számot!",
    );
    return;
  }

  try {
    const response = await fetch("./register.php/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        class: className,
        pwd: password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      let dots = 0;
      showAlert("Sikeres regisztráció! Átirányítás", "success");

      const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        errordiv.querySelector("span").textContent =
          "Sikeres regisztráció! Átirányítás" + ".".repeat(dots);
      }, 300);

      setTimeout(() => {
        clearInterval(interval);
        window.location.href = "../login.html";
      }, 1500);
    } else {
      showAlert(data.error || "Hiba történt a regisztráció során!");
    }
  } catch (error) {
    console.error(error);
    showAlert("Hálózati hiba. Kérlek, próbáld újra!");
  }
};

document.getElementById("registerbtn").addEventListener("click", registerCheck);
