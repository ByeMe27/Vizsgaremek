const emailes = document.getElementById("emailes");
let result = document.createElement("div");
result.id = "result";
result.style.marginTop = "10px";
result.style.color = "red";
result.style.textAlign = "center";
emailes.appendChild(result);

const changeemail = async () => {
  const email = document.getElementById("email").value;

  if (!email) {
    result.style.color = "red";
    result.textContent = "Kérlek, töltsd ki a mezőt!";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.style.color = "red";
    result.textContent = "Kérlek, írj be egy érvényes e-mail címet!";
    return;
  }

  try {
    const response = await fetch("./profile.php/changeemail", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    const data = await response.json();
    if (response.ok) {
      result.style.color = "green";
      result.textContent = "Sikeres módósítás!";
    }
  } catch (error) {
    result.style.color = "red";
    result.textContent = "Hiba történt a módósítás során!";
    console.error(error);
  }
};

document.getElementById("changebtn").addEventListener("click", changeemail);
