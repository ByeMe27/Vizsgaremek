let selectedCategory = null;

function selectCategory(event) {
    const btn = event.target;
    const cat = btn.dataset.cat;

    if (selectedCategory === cat) return;

    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    selectedCategory = cat;
}

document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", selectCategory);
});

document.getElementById("search-btn").addEventListener("click", async () => {
    const min = document.getElementById("min-price").value;
    const max = document.getElementById("max-price").value;

    console.log("Keresés:", selectedCategory, min, max);


    // await fetch(`./products.php?kategoria=${selectedCategory}&min=${min}&max=${max}`);
});
async function minden(){
    let products_container = document.getElementById("products-container")
    let errordiv = document.getElementById("errordiv")
    //console.log(errordiv)

    try {
        let req = await fetch("./products.php/minden")
        let Data = await req.json();
        //console.log(Data)
/////////////////////////////////////////////////////////////
        //ki kel egesziteni hogy a kartya az adott termek id-jet valahogy tartalmazza a kosarba rakashoz
//////////////////////////////////////////////////////////////
        if(req.ok){
            errordiv.hidden = true
            for (const d of Data) {
                products_container.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 mb-3">
                    <div class="card shadow-sm h-100">
                        <img src="${d.foto}" class="card-img-top" alt="${d.nev}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${d.nev}</h5>
                            <p class="card-text text-muted">${d.leiras}</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fw-bold">${d.ar} Ft</span>
                                <button class="btn btn-primary btn-sm">Kosárba</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        }
        else{
            throw Data.valasz
        }  

    } catch (error) {
        errordiv.hidden = false
        errordiv.innerHTML = Data.valasz;
        errordiv.className = "alert alert-danger"
    }
}
window.addEventListener("load", minden)


