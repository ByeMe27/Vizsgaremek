const password = document.getElementById("password");
let result = document.createElement("div");
result.id = "result";
result.style.marginTop = "10px";
result.style.color = "red";
result.style.textAlign = "center";
password.appendChild(result);

const changepassword = async () => {
  const pwd = document.getElementById("pwd").value;
  const newpwd = document.getElementById("newpwd").value;

  if (!pwd || !newpwd) {
    result.style.color = "red";
    result.textContent = "Kérlek, töltsd ki a mezőt!";
    return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newpwd)) {
    result.style.color = "red";
    result.textContent =
      "A jelszónak legalább 8 karakterből kell állnia és tartalmaznia kell legalább egy nagybetűt és egy számot!";
    return;
  }

  try {
    const response = await fetch("./profile.php/changepasswd", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pwd: pwd, newpwd: newpwd }),
    });

    const data = await response.json();
    if (response.ok) {
      result.style.color = "green";
      result.textContent = "Sikeres módósítás!";
    } else {
      result.style.color = "red";
      result.textContent = data.error || "Hiba történt a módósítás során!";
    }
  } catch (error) {
    console.error(error);
  }
};

document.getElementById("changebtn").addEventListener("click", changepassword);
