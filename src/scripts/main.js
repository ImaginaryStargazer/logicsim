import { circuitEditor } from "./circuitEditor.js";
import { executeSelectedAction } from "./toolbar.js";
import { icons } from "./icons.js";
import { CURRENT_ACTION } from "./logicalComponents/states.js";


const container = document.querySelector("#mainBoardContainer");
const mainEditorWidth = document.getElementById("mainBoardContainer").clientWidth;
const mainEditorHeight = document.getElementById("mainBoardContainer").clientHeight;


const editor = new circuitEditor(mainEditorWidth, mainEditorHeight);


export let currentMouseAction = CURRENT_ACTION.EDIT;


document.body.onload = function() {

    editor.mainEditorBoard(); 

}




function resizeMainBoard() {

    editor.mainEditor.width(container.offsetWidth);
    editor.mainEditor.height(container.offsetHeight);

    editor.createGrid();
}

window.addEventListener("resize", resizeMainBoard);



executeSelectedAction((selectedTool) => {



    switch (selectedTool) {

        case "Edit":
            
            currentMouseAction = CURRENT_ACTION.EDIT;
            editor.enableEditing();
            editor.mainEditor.container().focus();
            editor.mainEditor.draggable(false);

            break;

        case "Move-Editor":

            currentMouseAction = CURRENT_ACTION.DRAG_EDITOR;
            editor.disableEditing();
            editor.mainEditor.container().focus();
            editor.mainEditor.container().style.cursor = "move";
            editor.mainEditor.draggable(true);

            break;

        case "Remove-Wire":
        
            editor.enableEditing();
            currentMouseAction = CURRENT_ACTION.REMOVE_WIRE;
            editor.disableEditing();

            break;

        case "zoomIn":

            editor.mainEditor.scale({x: editor.minScale, y: editor.minScale})
            editor.createGrid();

            break;

        case "zoomOut":
            
            editor.mainEditor.scale({x: editor.maxScale, y: editor.maxScale})
            editor.createGrid();

            break;

        case "rotate":
            
            

            break;

        case "delete":
        

            break;
            
        case "clone":


            break;

        case "center":

            break;


        default:

            break;
    }
});


export function resetMenu() {

    currentMouseAction = CURRENT_ACTION.EDIT;
    let activeElements = document.getElementsByClassName("component");

    for (let i = 0; i < activeElements.length; i++) {

        activeElements[i].classList.remove('selectedComponent')
    }
    document.getElementById("mainBoard").style.cursor = "default";
}


export function backToEdit() {

    resetMenu();
    document.getElementsByClassName("Edit")[0].classList.add("selectedComponent");
    currentMouseAction = CURRENT_ACTION.EDIT;
}

// Priadanie event listenerov pre klávesnicu na delete [delete key], rotate [r key]

document.addEventListener("keydown", (ev) => {
    ev = ev || window.event;


    if(editor.selectedComponents <= 0) {
        return;
    }


    if(ev.key == "Delete") {
        

    } else if (ev.key == "r") {


        
    } else if(ev.key == "c") {

        
    }
})


//////////////////////////////////////////////////////////////////////////
//
//
// Nastavenia vzhľadu editora obvodov
//
//
//////////////////////////////////////////////////////////////////////////


/* Zmena farby napätia na kábloch a svorkách */

document.getElementById("changeVoltageColor").addEventListener("change", (e) => {

    
})


/* Zmena komponentov v editore a v menu komponentov na ANSI a IEC */

document.getElementById("IEC").addEventListener("change", (e) => {

    const isIEC = e.target.checked;
    editor.isIEC = isIEC;

    editor.convertToIECorANSI();

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


/* Zmena štvorcovej mriežky zapínanie a vypínanie */


document.getElementById("grid").onchange = (e) => {
        

    if(e.target.checked === true) {

        editor.gridLayer.show();

    } else {

        editor.gridLayer.hide();
    }

};


 
/* Označovanie komponentov v menu a nastavenie vybraného komponentu */

document.querySelectorAll(".component").forEach((component) => {
            
    component.addEventListener("mousedown", () => {

        let active = document.getElementsByClassName("selectedComponent");


        if (active.length > 0) {
            active[0].className = active[0].className.replace(" selectedComponent", "");
        }

        component.className += " selectedComponent";

        editor.mouseSelectedComponent = component.getAttribute("part");

    })

    

})


/* Zmena farebného motívu v editore aj používateľského rozhrania */

const toggleTheme = document.getElementById("theme");

toggleTheme.addEventListener("change", () => {

    const darkTheme = "dark-theme";
    const lightTheme = "light-theme";
    const defaultTheme = darkTheme;

    let currentTheme = localStorage.getItem("color-theme") || defaultTheme;

    const option = toggleTheme.value;

    if ([darkTheme, lightTheme].includes(option)) {
        document.body.classList.replace(currentTheme, option);
        currentTheme = option;
        localStorage.setItem("color-theme", option);
        logoHolder.src = icons[localStorage.getItem("color-theme")];
    }
    
});


