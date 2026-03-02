const form = document.querySelector("form");
const nameInput = form.querySelector("input[name='name']");
const emailInput = form.querySelector("input[name='email']");
const classInput = form.querySelector("input[name='class']");
const passwordInput = form.querySelector("input[name='psw']");

let result = document.createElement("div");
result.id = "result";
result.style.marginTop = "10px";
result.style.color = "red";
form.appendChild(result);

const registerCheck = async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const className = classInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !className || !password) {
    result.style.color = "red";
    result.textContent = "Kérlek, töltsd ki az összes mezőt!";
    return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    result.style.color = "red";
    result.textContent =
      "A jelszónak legalább 8 karakterből kell állnia és tartalmaznia kell legalább egy nagybetűt és egy számot!";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.style.color = "red";
    result.textContent = "Kérlek, írj be egy érvényes e-mail címet!";
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
      const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        result.style.color = "green";
        result.textContent =
          "Sikeres regisztráció! Átírányítás a bejelentkezés oldalra" +
          ".".repeat(dots);
      }, 300);

      setTimeout(() => {
        clearInterval(interval);
        window.location.href = "../login.html";
      }, 1500);
    } else {
      result.style.color = "red";
      result.textContent = data.error || "Hiba történt a regisztráció során!";
    }
  } catch (error) {
    console.error(error);
  }
};

document.getElementById("registerbtn").addEventListener("click", registerCheck);
