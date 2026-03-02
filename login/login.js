const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("remember");

let result = document.createElement("div");
result.id = "result";
result.style.marginTop = "10px";
result.style.color = "red";
form.appendChild(result);

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
    result.style.color = "red";
    result.textContent = "Kérlek, töltsd ki az összes mezőt!";
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
      const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        result.style.color = "green";
        result.textContent = "Bejelentkezés folyamatban" + ".".repeat(dots);
      }, 300);

      setTimeout(() => {
        clearInterval(interval);
        console.log(data);
        if (data.user.role === "admin" || data.user.role === "bufes") {
          window.location.href = "../dashboard/orders/orders.html";
        } else {
          window.location.href = "../products/products.html";
        }
      }, 1200);
    } else {
      result.style.color = "red";
      result.textContent = data.error || "Hiba történt a bejelentkezés során!";
    }
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener("load", rememberMe);
document.getElementById("loginbtn").addEventListener("click", loginCheck);
