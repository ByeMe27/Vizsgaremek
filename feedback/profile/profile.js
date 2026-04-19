const profile = document.getElementById("profile");
let result = document.createElement("div");
result.id = "result";
result.style.marginTop = "10px";
result.style.color = "red";
result.style.textAlign = "center";
profile.appendChild(result);

const changename = async () => {
  const name = document.getElementById("name").value;

  if (!name) {
    result.style.color = "red";
    result.textContent = "Kérlek, töltsd ki a mezőt!";
    return;
  }

  try {
    const response = await fetch("./profile.php/changename", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
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

document.getElementById("changebtn").addEventListener("click", changename);
