const classs = document.getElementById("classs");
let result = document.createElement("div");
result.id = "result";
result.style.marginTop = "10px";
result.style.color = "red";
result.style.textAlign = "center";
classs.appendChild(result);

const changeclass = async () => {
  const classes = document.getElementById("classes").value;

  if (!classes) {
    result.style.color = "red";
    result.textContent = "Kérlek, töltsd ki a mezőt!";
    return;
  }

  try {
    const response = await fetch("./profile.php/changeclass", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ class: classes }),
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

document.getElementById("changebtn").addEventListener("click", changeclass);
