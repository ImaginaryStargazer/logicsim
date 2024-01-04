import { circuitEditor, componentsMap } from "./circuitEditor.js";
import { executeSelectedAction } from "./toolbar.js";
import { icons } from "./icons.js";
import { CURRENT_ACTION } from "./logicalComponents/states.js";
import { openAlert } from "./userInterface.js";
import { Node, nodeList } from "./logicalComponents/node.js";
import { nodeValues } from "./logicalComponents/oscilloscope.js";



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
            editor.mainEditor.container().focus();
            editor.mainEditor.container().style.cursor = "default";
            editor.mainEditor.draggable(false);

            if(!editor.simRunning)
                editor.enableEditing();

            break;

        case "Move-Editor":

            currentMouseAction = CURRENT_ACTION.DRAG_EDITOR;
            editor.disableEditing();
            editor.mainEditor.container().focus();
            editor.mainEditor.container().style.cursor = "move";
            editor.mainEditor.draggable(true);

            break;

        case "Remove-Wire":

            editor.mainEditor.container().style.cursor = "default";
            currentMouseAction = CURRENT_ACTION.REMOVE_WIRE;

            if(!editor.simRunning)
                editor.enableEditing();

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
            
            editor.rotateComponent();

            break;

        case "delete":

            
            for(let i = editor.components.length - 1; i >= 0; i--) {
                if(editor.components[i].isFullySelected) {

                    editor.components[i].destroy();
                    delete editor.components[i];
                    editor.components.splice(i, 1);

                }
            }

            editor.wireMng.draw();
            editor.transformer.nodes([]);
            
            /*
            for(let i = 0; i < editor.components.length; i++) {
                if(editor.components[i].isFullySelected) {

                    editor.components[i].destroy();
                    editor.components.splice(i, 1);

                }
            }

            editor.wireMng.draw();
            editor.transformer.nodes([]);
            */

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
        
        for(let i = editor.components.length - 1; i >= 0; i--) {
            if(editor.components[i].isFullySelected) {

                editor.components[i].destroy();
                delete editor.components[i];
                editor.components.splice(i, 1);

            }
        }

        editor.wireMng.draw();
        editor.transformer.nodes([]);

    } else if (ev.key == "r" || ev.key === 'R') {

        editor.rotateComponent();

        
    } else if(ev.key == "c") {
        //clone kód
    } 
})


//////////////////////////////////////////////////////////////////////////
//
//
// Nastavenia vzhľadu editora obvodov
//
//
//////////////////////////////////////////////////////////////////////////


/* Zapnutie a vypnutie osciloskopu */

document.getElementById("oscilloscope").addEventListener("click", (e) => {

    if(editor.graph.oscilloscope.visible())
        editor.graph.oscilloscope.visible(false);
     else 
        editor.graph.oscilloscope.visible(true);
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

/* Prepínanie svoriek počas simulácie */


document.getElementById("nodes").onchange = (e) => {
        

    if(e.target.checked === true) {
        editor.toggleNodes = true;
        if(editor.simRunning)
            editor.hideNodes();
    } else {
        editor.toggleNodes = false;
        editor.showNodes();
    }



};


 
/* Označovanie komponentov v menu a nastavenie vybraného komponentu */

document.querySelectorAll(".component").forEach((component) => {

            
    component.addEventListener("mousedown", () => {

        let selectedTool = component.getAttribute("selected-tool");
        
        if(editor.simRunning && selectedTool !== "Move-Editor" && selectedTool !== "Edit") {
            openAlert("info", "EditDisabled");
            return;
        };


        let active = document.getElementsByClassName("selectedComponent");

        if (active.length > 0) {
            active[0].className = active[0].className.replace(" selectedComponent", "");
        }

        component.className += " selectedComponent";


        editor.mouseSelectedComponent = component.getAttribute("data-part");

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

        //editor.componentColor = option == darkTheme ? "white" : "black";
    }


    
});

/* Resetovanie simulácie, časovača a osciloskopu */


document.getElementById("resetClock").onclick = () => {

    editor.timer.resetTimer();
    editor.graph.resetOscilloscope();

}


//////////////////////////////////////////////////////////////////////////
//
//
// Uloženie a načítanie obvodov do editora, nový obvod
//
//
//////////////////////////////////////////////////////////////////////////


export class FileManager {
    constructor() {

        this.loadedFile = undefined;
    }


    loadFile(customFilePath) {

        const reader = new FileReader();

        const readAndParseFile = (file) => {

        
            if (file) {

                
                reader.onload = () => {

                    editor.newBlankCircuit();

                    const fileContent = reader.result;
                    let parsed = JSON.parse(fileContent);

                    let parsedComponents = JSON.parse(fileContent).components;
                    

                    for (let i = 0; i < parsedComponents.length; i++) {

                        const currentComponentId = parsedComponents[i].id;
                        const objectParsed = parsedComponents[i];
                    
                        if (componentsMap[currentComponentId]) {
                            
                            const ComponentClass = componentsMap[currentComponentId];
                            const newComponent = new ComponentClass(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation);

                            Object.assign(newComponent, objectParsed);

                            editor.components.push(newComponent);

                            Node.setCurrentId(objectParsed.startNodeId);
                            newComponent.render();
                            editor.snapToGrid(newComponent.component);
                        }
                    }


                    editor.convertToIECorANSI();


                    if("wires" in parsed) {

                        for (let i = 0; i < fileContent.length; i++) {

                            let objectParsed = JSON.parse(fileContent).wires[i];
        
                            if (objectParsed == undefined) break;
        
                            

                            editor.wireMng.addNode(nodeList[objectParsed.startID]);
                            editor.wireMng.wire[i].points = objectParsed.points;
                            editor.wireMng.addNode(nodeList[objectParsed.endID]);

                            //Object.assign(editor.wireMng.wire[i], objectParsed)
                            

                        }

                        
                    }

                    if("oscilloscope" in parsed) {

                        for (let i = 0; i < fileContent.length; i++) {

                            let objectParsed = JSON.parse(fileContent).oscilloscope[i];
        
                            if (objectParsed == undefined) break;
                            
                            nodeValues.push(nodeList[objectParsed.id]);

                        }

                        
                    }

                    if("editor" in parsed) {
                    
                        let objectParsed = JSON.parse(fileContent).editor;
                        editor.setEditorSettings(objectParsed);

                        console.log(editor.getEditorSettings())
                    }

                    editor.wireMng.draw();
                };

                reader.readAsText(file);

            }

            if(editor.simRunning) {
                editor.stopSimulation();
                editor.graph.resetOscilloscope();
                editor.timer.resetTimer();
            } 
        }

        if (customFilePath) {

            fetch(customFilePath)
                .then((response) => response.blob())
                .then((blob) => {
                    const file = new File([blob], customFilePath.split('/').pop());
                    readAndParseFile(file);
                    this.loadedFile = file;
                    projectTitle.innerText = this.loadedFile.name;
                })
                .catch((error) => {
                    console.error('Error fetching file:', error);
                });

        } else {


            let input = document.createElement('input');
            input.type = 'file';
            input.click();
    
            input.addEventListener('change', (e) => {

                const file = e.target.files[0];
                readAndParseFile(file);
    
                this.loadedFile = file;
                projectTitle.innerText = this.loadedFile.name;
            });
    
        }
        
    
        
    }

    saveFile() {

        let JSONworkspace = FileManager.getJSONworkspace();
        let blob = new Blob([JSONworkspace], { type: 'application/json' });
        
        
        let url = URL.createObjectURL(blob);


        let link = document.createElement('a');
    
        link.href = url;
        link.download = projectTitle.innerText; 
        
        link.onerror = () => {
            console.error('Download failed');
            return;
        };
        
        link.click();
        openAlert("success", "DownloadCompleted")
        
        URL.revokeObjectURL(url);
    }


    static getJSONworkspace() {

        let workspace = new Object();

        workspace["components"] = editor.components;
        workspace["wires"] = editor.wireMng.wire;
        workspace["oscilloscope"] = nodeValues;
        workspace["editor"] = editor.getEditorSettings();

        let jsonWorkspace = JSON.stringify(workspace,
            function (key, value) {
                switch (key) {
                    case "mainEditor":
                    case "nodes":
                    case "layer":
                    case "node":
                    case "wire":
                    case "startNode":
                    case "endNode":
                    case "component":
                    case "segment":
                    case "symbols":
                    case "number":
                    case "isFullySelected":
                    case "radius":
                    case "LED":
                    case "graphingLayer":
                    case "type":
                    case "bulb":
                    case "labelInfo":
                    case "textValue":
                    case "pin":
                    case "button":
                    case "digitalNumber":
                        return undefined;
                }

                return value;
            }, '\t');
        return jsonWorkspace;

    }
}


const fileManager = new FileManager();



// zatial takto sú pridané dva listenery zbytočne

document.getElementById("blankCircuit").addEventListener("click", () => {

    editor.newBlankCircuit();

    // pridať vynulovanie a resetovanie simulácie
})


document.getElementById("saveAndLoadBlank").addEventListener("click", () => {

    fileManager.saveFile();
    editor.newBlankCircuit();


    // pridať vynulovanie a resetovanie simulácie
})


document.getElementById("downloadCircuit").addEventListener("click", () => {

    fileManager.saveFile();
    // pridať vynulovanie a resetovanie simulácie
})


document.getElementById("loadCircuit").addEventListener("click", () => {

    fileManager.loadFile();
        

    // pridať vynulovanie a resetovanie simulácie
})

//////////////////////////////////////////////////////////////////////////
//
//
// Načítanie obvodov na ukážku
//
//
//////////////////////////////////////////////////////////////////////////



const sampleCircuits = document.querySelectorAll(".sampleCircuits");

sampleCircuits.forEach(circuit => {
    circuit.onclick = () => {
        let circuitPath = circuit.getAttribute("data-path");

        fileManager.loadFile(circuitPath);

    }
})