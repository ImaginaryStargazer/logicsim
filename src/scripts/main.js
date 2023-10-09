//////////////////////////////////////////////////////////////////////////
//
//
// Nastavenia vzhľadu editora obvodov
//
//
//////////////////////////////////////////////////////////////////////////




/* Zmena komponentov v editore a v menu komponentov na ANSI a IEC */

document.getElementById("IEC").addEventListener("change", (e) => {

    const isIEC = e.target.checked;


    document.querySelectorAll(".componentImage").forEach((image) => {
        if (isIEC) {
            image.src = image.src.replace("ANSI.png", ".png");
        } else {
            if (!image.src.endsWith("ANSI.png")) {
                image.src = image.src.replace(".png", "ANSI.png");
            }
        }
    });

});





/* Označovanie komponentov v menu a nastavenie vybraného komponentu */

document.querySelectorAll(".component").forEach((component) => {
            
    component.addEventListener("mousedown", () => {

        let active = document.getElementsByClassName("selectedComponent");


        if (active.length > 0) {
            active[0].className = active[0].className.replace(" selectedComponent", "");
        }

        component.className += " selectedComponent";
    })

})


