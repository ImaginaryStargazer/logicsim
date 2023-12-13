import { circuitEditor } from "./circuitEditor.js";
import { executeSelectedAction } from "./toolbar.js";
import { icons } from "./icons.js";
import { CURRENT_ACTION } from "./logicalComponents/states.js";
import { openAlert } from "./userInterface.js";
import { NOTGate } from "./logicalComponents/NOTGate.js";
import { ANDGate } from "./logicalComponents/ANDGate.js";
import { ORGate } from "./logicalComponents/ORGate.js";
import { NORGate } from "./logicalComponents/NORGate.js";
import { NANDGate } from "./logicalComponents/NANDGate.js";
import { XORGate } from "./logicalComponents/XORGate.js";
import { XNORGate } from "./logicalComponents/XNORGate.js";
import { Node ,nodeList } from "./logicalComponents/node.js";
import { LowInput } from "./logicalComponents/lowInput.js";
import { HighInput } from "./logicalComponents/highInput.js";
import { ClockGen } from "./logicalComponents/clockGen.js";
import { LogicalSwitch } from "./logicalComponents/logicalSwitch.js";
import { LogicalOutput } from "./logicalComponents/logicalOutput.js";
import { LightBulb } from "./logicalComponents/lightBulb.js";
import { SevenSegmentDecoder } from "./logicalComponents/7segmentDecoder.js";
import { SevenSegmentDisplay } from "./logicalComponents/7segmentDisplay.js";
import { Counter } from "./logicalComponents/counter.js";
import { D_FlipFlop } from "./logicalComponents/D_FlipFlop.js";
import { T_FlipFlop } from "./logicalComponents/T_FlipFlop.js";
import { JK_FlipFlop } from "./logicalComponents/JK_FlipFlop.js";
import { Latch } from "./logicalComponents/latch.js";
import { Multiplexor } from "./logicalComponents/Multiplexor.js";
import { Demultiplexor } from "./logicalComponents/Demultiplexor.js";
import { RingCounter } from "./logicalComponents/ringCounter.js";
import { DecimalDisplay } from "./logicalComponents/decimalDisplay.js";
import { HalfAdder } from "./logicalComponents/halfAdder.js";
import { SIPOregister } from "./logicalComponents/SIPOregister.js";
import { SequenceGenerator } from "./logicalComponents/sequenceGenerator.js";
import { ClockCounter } from "./logicalComponents/clockCounter.js";
import { BinarySwitch } from "./logicalComponents/binarySwitch.js";
import { LEDarray } from "./logicalComponents/LEDarray.js";
import { RGBLed } from "./logicalComponents/RGBLED.js";


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

    } else if (ev.key == "r") {

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


    loadFile() {

        let input = document.createElement("input");
        input.type = "file";

        input.addEventListener("change", (e) => {
            
            // prázdny obvod
            editor.newBlankCircuit();
            editor.enableEditing();
            backToEdit();

            
            const file = e.target.files[0];
    

            if (file) {

                const reader = new FileReader();
    
                reader.onload = () => {

                    const fileContent = reader.result;
                    let parsed = JSON.parse(fileContent);

                    let parsedComponents = JSON.parse(fileContent).components;

                    editor.newBlankCircuit();

                    for(let i = 0; i < parsedComponents.length; i++) {

                        let currentComponentId = parsedComponents[i].id;
                        let objectParsed = parsedComponents[i];

                        

                        switch(currentComponentId) {
                            case "NOT":
                                editor.components.push(new NOTGate(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "AND":
                                editor.components.push(new ANDGate(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "OR":
                                editor.components.push(new ORGate(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "NOR":
                                editor.components.push(new NORGate(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "NAND":
                                editor.components.push(new NANDGate(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "XOR":
                                editor.components.push(new XORGate(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "XNOR":
                                editor.components.push(new XNORGate(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "LI":
                                editor.components.push(new LowInput(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "HI":
                                editor.components.push(new HighInput(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "CLK":
                                editor.components.push(new ClockGen(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "LSW":
                                editor.components.push(new LogicalSwitch(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "OUT":
                                editor.components.push(new LogicalOutput(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "BLB":
                                editor.components.push(new LightBulb(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "LDA":
                                editor.components.push(new LEDarray(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "RGB":
                                editor.components.push(new RGBLed(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "SSD":
                                editor.components.push(new SevenSegmentDecoder(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "SSL":
                                editor.components.push(new SevenSegmentDisplay(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "DFF":
                                editor.components.push(new D_FlipFlop(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "TFF":
                                editor.components.push(new T_FlipFlop(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "JKFF":
                                editor.components.push(new JK_FlipFlop(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "LTC":
                                editor.components.push(new Latch(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "MUX":
                                editor.components.push(new Multiplexor(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "DEMUX":
                                editor.components.push(new Demultiplexor(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "CTR":
                                editor.components.push(new Counter(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "RCTR":
                                editor.components.push(new RingCounter(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "DLD":
                                editor.components.push(new DecimalDisplay(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "HAD":
                                editor.components.push(new HalfAdder(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "SIPO":
                                editor.components.push(new SIPOregister(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "SQG":
                                editor.components.push(new SequenceGenerator(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "CLC":
                                editor.components.push(new ClockCounter(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                            case "BSW":
                                editor.components.push(new BinarySwitch(objectParsed.posX, objectParsed.posY, objectParsed.color, objectParsed.rotation));
                                break;
                        
                            default: break;
                        }

                        Node.setCurrentId(objectParsed.startNodeId);
        
                        editor.components[i].render();
                        editor.snapToGrid(editor.components[i].component);
                    }


                    editor.convertToIECorANSI();


                    if("wires" in parsed) {

                        for (let i = 0; i < fileContent.length; i++) {

                            let objectParsed = JSON.parse(fileContent).wires[i];
        
                            if (objectParsed == undefined) {
                                break;
                            }


                            /*
                            editor.wireMng.addNode(nodeList.find(node => node.id === objectParsed.startID));
                            editor.wireMng.addNode(nodeList.find(node => node.id === objectParsed.endID));
                            

                            
                            
                            console.log(nodeList.find(node => node.id  === objectParsed.startID));
                            console.log(nodeList.find(node => node.id === objectParsed.endID));
                            

                            editor.wireMng.addNode(nodeList.find(node => node.id === objectParsed.startID));
                            editor.wireMng.addNode(nodeList.find(node => node.id === objectParsed.endID));
                            */
                            
                            editor.wireMng.addNode(nodeList[objectParsed.startID]);
                            editor.wireMng.addNode(nodeList[objectParsed.endID]);
                            
                            //Object.assign(editor.wireMng.wire[i], objectParsed)
                            

                        }

                        
                    }

                    editor.wireMng.draw();
                };
    
                reader.readAsText(file);
            }
    

            this.loadedFile = file;
            projectTitle.innerText = this.loadedFile.name;
        });
    
        input.click();
    
        
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