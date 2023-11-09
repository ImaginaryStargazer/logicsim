import { NOTGate } from "./logicalComponents/NOTGate.js";
import { ANDGate } from "./logicalComponents/ANDGate.js";
import { ORGate } from "./logicalComponents/ORGate.js";
import { NORGate } from "./logicalComponents/NORGate.js";
import { NANDGate } from "./logicalComponents/NANDGate.js";
import { XORGate } from "./logicalComponents/XORGate.js";
import { XNORGate } from "./logicalComponents/XNORGate.js";

import { LowInput } from "./logicalComponents/lowInput.js";
import { HighInput } from "./logicalComponents/highInput.js";
import { LogicalSwitch } from "./logicalComponents/logicalSwitch.js";
import { ClockGen } from "./logicalComponents/clockGen.js";

import { LogicalOutput } from "./logicalComponents/logicalOutput.js";
import { LightBulb } from "./logicalComponents/lightBulb.js";

import { SevenSegmentDecoder } from "./logicalComponents/7segmentDecoder.js";
import { SevenSegmentDisplay } from "./logicalComponents/7segmentDisplay.js";
import { D_FlipFlop } from "./logicalComponents/D_FlipFlop.js";

import { resetMenu, backToEdit , currentMouseAction} from "./main.js";

export const mainEditor = new Konva.Stage({container: "mainBoard"});

export class circuitEditor {
    constructor(width, height) {

        this.mainEditor = mainEditor;

        this.mainEditor.setAttrs({
            width: width,
            height: height,
            x: 0,
            y: 0 
        })

        this.layer = new Konva.Layer({
            id: "componentLayer"
        });

        this.gridLayer = new Konva.Layer();
        this.graphingLayer = new Konva.Layer();

        this.mainEditor.add(this.gridLayer);
        this.mainEditor.add(this.layer);
        this.mainEditor.add(this.graphingLayer);

        this.simulation = null;
        this.tileSize = 20;
        this.time = 0;
        this.timestep = 5e-6;
        this.showGrid = true;
        this.selectedComponents = [];
        this.components = [];
        this.componentColor = "white";
        this.highlightColor = "#fcb103";
        this.newComponent = null;
        this.scaleBy = 1.05;
        this.isComponentSelected = false;
        this.simRunning = false;
        this.maxScale = 0.25;
        this.minScale = 4;
        this.isIEC = false;
        this.mouseSelectedComponent = null;
    
        this.transformer = new Konva.Transformer({
            resizeEnabled: false,
            rotateEnabled: false,
            borderEnabled: false
        })


        this.layer.add(this.transformer);

        this.mainEditor.on("contextmenu", (e) => e.evt.preventDefault());

        window.onkeydown = (e) => this.onKeyDown(e);
        window.onkeyup = (e) => this.onKeyUp(e);
        this.mainEditor.on("wheel", (e) => this.onWheel(e));

    }

    simulate() {
        
    
    }


    createGrid() {


        /* Prekresli grid pri každej zmene */

        this.gridLayer.removeChildren();


        /* Vypočíta viditelnú šírku a výšku vzhladom ku mierke */
        
        const visibleWidth = (this.mainEditor.width() / this.mainEditor.scaleX())
        const visibleHeight = (this.mainEditor.height() / this.mainEditor.scaleY())


        /* Vypočíta začiatočný bod pre x a y a koncový bod pre x a y súradnice*/

        const startX = Math.floor(((-this.mainEditor.x() / this.mainEditor.scaleX())) / this.tileSize) * this.tileSize;
        const endX = Math.floor(((-this.mainEditor.x() / this.mainEditor.scaleX()) +  visibleWidth + this.tileSize ) / this.tileSize) * this.tileSize;
        const startY = Math.floor(((-this.mainEditor.y() / this.mainEditor.scaleY())) / this.tileSize) * this.tileSize;
        const endY = Math.floor(((-this.mainEditor.y() / this.mainEditor.scaleY()) + visibleHeight + this.tileSize) / this.tileSize) * this.tileSize;



        let gridShape = new Konva.Shape({
            sceneFunc: (context, shape) => {
                context.beginPath();

                for (let x = startX; x < endX; x += this.tileSize) {
                    context.moveTo(x, startY);
                    context.lineTo(x, endY);
                }
    
                for (let y = startY; y < endY; y += this.tileSize) {
                    context.moveTo(startX, y);
                    context.lineTo(endX, y);
                }
    
                context.strokeStyle = "#606060";
                context.lineWidth = 0.5;
                context.stroke();
                context.fillStrokeShape(shape);
            },
        });
    
        this.gridLayer.add(gridShape);

    }
    


    mainEditorBoard() {


        /* Prekresli grid pri každom pohybe */

        this.mainEditor.on('dragmove', (e) => {

            if(e.target != this.mainEditor) return;
            this.createGrid();

        });


        this.createGrid();
    }



    onKeyDown(e) {


        if(e.key == "Escape") {

            this.mainEditor.container().focus();
            this.mainEditor.container().style.cursor = "default";


            this.mouseSelectedComponent = null;

            this.enableEditing();
            backToEdit();

        }
    
        

    }


    onWheel(e) {

    
        let oldScale = this.mainEditor.scaleX();
        let pointer = this.mainEditor.getPointerPosition();
      
        let mousePointTo = {

            x: (pointer.x - this.mainEditor.x()) / oldScale,
            y: (pointer.y - this.mainEditor.y()) / oldScale,

        };
      
        let direction = e.evt.deltaY > 0 ? -1 : 1;
      

        if (e.evt.ctrlKey) {
          direction = -direction;
        }
    

        let newScale = direction > 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy;
        newScale = Math.max(this.maxScale, Math.min(this.minScale, newScale));
      
        this.mainEditor.scale({ x: newScale, y: newScale });
      
        let newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        
        this.mainEditor.position(newPos);
        this.createGrid();
    
    }


    calculatePositionToScale(variable) {

        return {
            xAxis: variable / this.mainEditor.scaleX() - this.mainEditor.x() / this.mainEditor.scaleX(),
            yAxis: variable / this.mainEditor.scaleY() - this.mainEditor.y() / this.mainEditor.scaleY(),
        };
    }


    getClickedComponent() {
        
        let components = {

            "NOT": NOTGate,
            "AND": ANDGate,
            "OR": ORGate,
            "NOR": NORGate,
            "NAND": NANDGate,
            "XOR": XORGate,
            "XNOR": XNORGate,
            "LI": LowInput,
            "HI": HighInput,
            "LSW": LogicalSwitch,
            "CLK": ClockGen,
            "LO": LogicalOutput,
            "BLB": LightBulb,
            "7SD": SevenSegmentDecoder,
            "7SL": SevenSegmentDisplay,
            "DFF": D_FlipFlop
        };

        return components[this.mouseSelectedComponent];
    }


    getAllComponents() {
        
        return this.mainEditor.find(".component");
    }


    enableEditing() {
        
        document.getElementById("mainBoard").style.cursor = "default";

        this.getAllComponents().forEach(component => {
            component.listening(true)
        })

        this.mainEditor.draggable(false);
    }


    disableEditing() {

        this.getAllComponents().forEach(component => {
            component.listening(false)
        })
    }
}
