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
import { WireMng } from "./logicalComponents/wire.js";

import { SevenSegmentDecoder } from "./logicalComponents/7segmentDecoder.js";
import { Timer } from "./logicalComponents/elementTimer.js";
import { backToEdit ,currentMouseAction} from "./main.js";


import { CURRENT_ACTION, INPUT_STATE } from "./logicalComponents/states.js";
import { icons } from "./icons.js";
import { SevenSegmentDisplay } from "./logicalComponents/7segmentDisplay.js";
import { D_FlipFlop } from "./logicalComponents/D_FlipFlop.js";
import { T_FlipFlop } from "./logicalComponents/T_FlipFlop.js";
import { Multiplexor } from "./logicalComponents/Multiplexor.js";
import { Demultiplexor } from "./logicalComponents/Demultiplexor.js";
import { Counter } from "./logicalComponents/Counter.js";
import { JK_FlipFlop } from "./logicalComponents/JK_FlipFlop.js";
import { Latch } from "./logicalComponents/Latch.js";
import { DecimalDisplay } from "./logicalComponents/decimalDisplay.js";
import { RingCounter } from "./logicalComponents/ringCounter.js";
import { HalfAdder } from "./logicalComponents/halfAdder.js";
import { SIPOregister } from "./logicalComponents/SIPOregister.js";
import { SequenceGenerator } from "./logicalComponents/sequenceGenerator.js";
import { nodeList } from "./logicalComponents/node.js";
import { ClockCounter } from "./logicalComponents/clockCounter.js";
import { BinarySwitch } from "./logicalComponents/binarySwitch.js";
import { LEDarray } from "./logicalComponents/LEDarray.js";
import { Oscilloscope, nodeValues } from "./logicalComponents/oscilloscope.js";
import { RGBLed } from "./logicalComponents/RGBLED.js";
import { FullAdder } from "./logicalComponents/fullAdder.js";
import { BusConnection } from "./logicalComponents/busConnection.js";
import { CustomLogic } from "./logicalComponents/customLogic.js";

Konva.pixelRatio = 1;
export const mainEditor = new Konva.Stage({container: "mainBoard"});
export const wireMng = new WireMng();
export let useIECgates = false;

export const componentsMap =  {

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
    "OUT": LogicalOutput,
    "BLB": LightBulb,
    "SSD": SevenSegmentDecoder,
    "SSL": SevenSegmentDisplay,
    "DFF": D_FlipFlop,
    "TFF": T_FlipFlop,
    "JKFF": JK_FlipFlop,
    "LTC": Latch,
    "MUX": Multiplexor,
    "DEMUX": Demultiplexor,
    "CTR": Counter,
    "RCTR": RingCounter,
    "DLD": DecimalDisplay,
    "HAD": HalfAdder,
    "SIPO": SIPOregister,
    "SQG": SequenceGenerator,
    "CLC": ClockCounter,
    "BSW": BinarySwitch,
    "LDA": LEDarray,
    "RGB": RGBLed,
    "FAD": FullAdder,
    "BUS": BusConnection,
    "CML": CustomLogic
};


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

        this.gridLayer = new Konva.Layer({
            listening: false,
        });

        this.graphingLayer = new Konva.Layer({
            id: "graphingLayer",
        });

        this.mainEditor.add(this.gridLayer);
        this.mainEditor.add(this.layer);
        this.mainEditor.add(this.graphingLayer);

        this.simulation = null;
        this.tileSize = 20;
        this.time = 0;
        this.timestep = 5e-3;
        this.showGrid = true;
        this.selectedComponents = [];
        this.components = [];
        this.componentColor = "white";
        this.highlightColor = "yellow"; // #fcb103
        this.newComponent = null;
        this.scaleBy = 1.05;
        this.isComponentSelected = false;
        this.timer = new Timer(200, 100, 0, 0, this.time, this.timestep);
        this.graph = new Oscilloscope(this.mainEditor.width() - 200, 100, 200, 0);
        this.simRunning = false;
        this.maxScale = 0.25;
        this.minScale = 4;
        this.isIEC = useIECgates;
        this.mouseSelectedComponent = null;


        this.wireMng = wireMng;
    
        this.transformer = new Konva.Transformer({
            resizeEnabled: false,
            rotateEnabled: false,
            borderEnabled: true
        })


        this.timer.renderTimer(this.graphingLayer)
        this.graph.renderOscilloscope(this.graphingLayer);
        this.graphingLayer.add(this.transformer);

        this.mainEditor.on("contextmenu", (e) => e.evt.preventDefault());

        window.onkeydown = (e) => this.onKeyDown(e);
        this.mainEditor.on("wheel", (e) => this.onWheel(e));
    }

    simulate() {
        
        if (this.simRunning) {

            this.timer.time += this.timestep;
            let fixed = this.timer.time.toFixed(6);
            this.timer.clock.text(`t = ${fixed} s`);
    
            let iter = 15;
    
            for (let i = 0; i < iter; i++) {


                for (const component of this.components)
                    component.draw();
                


                this.wireMng.update();

            }

            
            nodeList.forEach((node) => {
                node.fillValue();
            });
            

            if(this.graph.oscilloscope.visible())
                this.graph.draw();
    

        }

        this.simulation = requestAnimationFrame(() => this.simulate());
    }
    

    stopSimulation() {

        this.simRunning = false;
        startSimulation.innerHTML = icons.startSimulation;
        cancelAnimationFrame(this.simulation);
        this.enableEditing();
        backToEdit();
    }


    startSimulation() {

        this.disableEditing();
        this.simRunning = true;
        startSimulation.innerHTML = icons.stopSimulation;
        this.simulate();

        this.mouseSelectedComponent = null;
        this.newComponent = null;
    }


    createGrid() {

        this.gridLayer.removeChildren();

        
        const visibleWidth = (this.mainEditor.width() / this.mainEditor.scaleX())
        const visibleHeight = (this.mainEditor.height() / this.mainEditor.scaleY())


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


        this.timer.setStaticPosition(this.mainEditor.scaleY(), this.calculatePositionToScale(0).xAxis, this.calculatePositionToScale(0).yAxis);
        this.graph.setStaticPosition(this.mainEditor.scaleY(), this.calculatePositionToScale(0).xAxis, this.calculatePositionToScale(0).yAxis);
    }
    


    mainEditorBoard() {

        document.getElementById("startSimulation").onclick = () => {

            if(this.simRunning) {

                this.stopSimulation();

            } else {

                this.startSimulation();
                
            }
            
        }


        this.mainEditor.on('dragmove', (e) => {

            if(e.target != this.mainEditor) return;
            this.createGrid();

        
        });

        
        this.mainEditor.on("mouseenter", () => {


            if (this.mouseSelectedComponent != null) {

                this.enableEditing();
                
                let newPart = this.getClickedComponent();

                this.mainEditor.container().style.cursor = "default";

                this.newComponent = new newPart(0, 0, this.componentColor);


                this.newComponent.render();
                this.components.push(this.newComponent);

                this.highlightComponent(this.newComponent.component)
                this.snapToGrid(this.newComponent.component);

                //this.convertToIECorANSI();
        
            } 
        });


        
        this.mainEditor.on("mousemove", () => {

            if (this.newComponent != null && this.mouseSelectedComponent != null) {

                const pos = this.mainEditor.getPointerPosition();

                let x = this.calculatePositionToScale(pos.x).xAxis;
                let y = this.calculatePositionToScale(pos.y).yAxis;


                this.newComponent.component.x(x - this.newComponent.component.width() / 2);
                this.newComponent.component.y(y - this.newComponent.component.height() / 2);
                
                
            }
        });
        

        this.mainEditor.on("mouseup mouseleave", (e) => {

            
            
            if(this.newComponent != null && this.mouseSelectedComponent != null) {

                // snap to grid
                            
                this.newComponent.component.position({

                    x: Math.round(this.newComponent.component.x() / this.tileSize) * this.tileSize,
                    y: Math.round(this.newComponent.component.y() / this.tileSize) * this.tileSize
                })
                
                this.newComponent.updatePosition();

                this.mouseSelectedComponent = null;
                this.newComponent = null;

                backToEdit();
            }
        
        });
    

        
        this.createGrid();
        this.highlightSelectedComponent();
        this.createWire();

    }


    createWire() {
    

        this.layer.on("pointerclick", (event) => {

            if(event.evt.button != 0) return;

            if(event.target.name() === "wire" && currentMouseAction != CURRENT_ACTION.EDIT) {

                let wireObj = event.target.getAttr("Wire"); 
                
                if(wireObj.endNode == null || currentMouseAction != CURRENT_ACTION.REMOVE_WIRE) return;

                const index = this.wireMng.wire.findIndex(wire => wire === wireObj);

              
                this.wireMng.wire[index].destroy();
                this.wireMng.wire[index].wire.destroy();
                this.wireMng.wire.splice(index, 1);
            }

            if(event.target.name() === "node") {
        
                if(this.simRunning) return;

                let nodeObj = event.target.getAttr("Node"); 


                if(nodeObj.inputState == INPUT_STATE.FREE || nodeObj.isOutput) {

                    this.wireMng.addNode(nodeObj);
                    this.wireMng.draw();
                    

                    return true;
        
                }
        
                return false;
                
            }

        })

          
        this.layer.on("dragmove dragend", () => {

            this.wireMng.draw();
        
        })

        
        
        this.mainEditor.on("mousemove", (e) => {

            if(this.wireMng.finishedDrawing) return;
            this.wireMng.draw();
    
        })
        
    }

    
    highlightSelectedComponent() {



        this.layer.on("pointerdown", (event) => {

            if(event.target.name() === "node" || event.target.name() === "wire") {
                return;
            }

            let modifierKeysPressed =  event.evt.ctrlKey || event.evt.altKey;

            
            let selectedComponent = event.target.findAncestor('.component').getAttr("componentType");
            

            if(modifierKeysPressed) {
                
                if(this.selectedComponents.includes(selectedComponent.component)) {
                    return;
                } 

                this.highlightComponent(selectedComponent.component);
                this.transformer.nodes(this.selectedComponents);


            } else if (!modifierKeysPressed) {

                if(this.transformer.nodes().length > 0) return;

                this.unhighlightAllComponents();

                this.highlightComponent(selectedComponent.component);
            } 

            
        });
    
        this.mainEditor.on("click tap", (event) => {

            if(event.target !== this.mainEditor || this.selectedComponents.length <= 0) {
                return;
            }
        
            this.unhighlightAllComponents();
        });
    }

    
    highlightComponent(component) {

        if(this.simRunning) return;

        component.getChildren().forEach(shape => {
            if(shape.name() === "node") {

                shape.setAttr("stroke", "grey");

            } else {
                shape.setAttr("stroke", this.highlightColor);
            }
        });

        this.selectedComponents.push(component);

        for(let i = 0; i < this.selectedComponents.length; i++) {
            this.selectedComponents[i].getAttr("componentType").isFullySelected = true;
        }
    }
    
    unhighlightAllComponents() {

        this.selectedComponents.forEach(component => {
            component.getChildren().forEach(shape => {
                if(shape.name() === "node") {

                    shape.setAttr("stroke", "grey");

                } else {
                    shape.setAttr("stroke", this.componentColor);
                }
            });
        });


        for(let i = 0; i < this.selectedComponents.length; i++) {
            this.selectedComponents[i].getAttr("componentType").isFullySelected = false;
        }
        
        this.selectedComponents = [];
        this.transformer.nodes([]);
    }
    

    useIECgates() {

        useIECgates = this.isIEC;

        return useIECgates;

    }


    convertToIECorANSI() {

        const iecComponents = this.mainEditor.find("#IEC");
        const ansiComponents = this.mainEditor.find("#ANSI");
        
        const componentsToShow = this.isIEC ? iecComponents : ansiComponents;
        const componentsToHide = this.isIEC ? ansiComponents : iecComponents;
    
        componentsToShow.forEach((component) => {
            component.show();

        });
    
        componentsToHide.forEach((component) => {
            component.hide();

        });

        this.useIECgates();
    }


    snapToGrid(component) {

        component.on('dragend', () => {

            
            component.position({

                x: Math.round(component.x() / this.tileSize) * this.tileSize,
                y: Math.round(component.y() / this.tileSize) * this.tileSize
            })

            component.getAttr("componentType").updatePosition();
        })
    }


    onKeyDown(e) {

        if(this.simRunning) return;

        if(e.key == "Escape") {

            this.enableEditing();
            backToEdit();

            if(this.newComponent == null) return;

            this.mainEditor.container().focus();
            this.mainEditor.container().style.cursor = "default";

            
            this.newComponent.component.position({

                x: Math.round(this.newComponent.component.x() / this.tileSize) * this.tileSize,
                y: Math.round(this.newComponent.component.y() / this.tileSize) * this.tileSize
            })
            
            
            this.mouseSelectedComponent = null;

        }
    
        

    }

    
    onWheel(e) {;

        if(this.selectedComponents.length > 0) {
            this.unhighlightAllComponents();
        }
    
    
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


    calculatePositionToScale(value) {

        return {
            xAxis: value / this.mainEditor.scaleX() - this.mainEditor.x() / this.mainEditor.scaleX(),
            yAxis: value / this.mainEditor.scaleY() - this.mainEditor.y() / this.mainEditor.scaleY(),
        };
    }


    getClickedComponent() {

        return componentsMap[this.mouseSelectedComponent];
    }


    getAllComponents() {
        
        return this.mainEditor.find(".component");
    }


    enableEditing() {

        document.getElementById("mainBoard").style.cursor = "default";
        this.graphingLayer.listening(true);

        this.components.forEach(component => {


            component.component.listening(true);
            component.component.draggable(true);

            if(component.id == "LSW") {

                component.component.on("contextmenu", (event) => {component.rightClick(event)});

            }
        })

        this.mainEditor.draggable(false);
    }


    disableEditing() {


        this.unhighlightAllComponents();
        this.graphingLayer.listening(false);
        
        this.components.forEach(component => {
    
            component.component.listening(false);

            if(component.id == "LSW") {
                component.component.listening(true);
                component.component.draggable(false);

                component.component.off("contextmenu");

            }

        })
    }


    rotateComponent() {

        for(let i = 0; i < this.components.length; i++) {

            if(this.components[i].isFullySelected) {
                this.components[i].component.rotate(90);
                
            }


            if(this.components[i].component.rotation() == 360) {
                this.components[i].component.rotation(0)
            }

            
            this.components[i].updateRotation();

        }

        this.wireMng.draw();

    }


    newBlankCircuit() {

        this.layer.removeChildren();
    
        this.components.splice(0, this.components.length);
        this.wireMng.wire.splice(0, this.wireMng.wire.length);
        nodeList.splice(0, nodeList.length);
        nodeValues.splice(0, nodeValues.length);
        this.graph.resetOscilloscope();
    
    }


    getEditorSettings() {

        let settings = {
            x: this.mainEditor.position().x,
            y: this.mainEditor.position().y,
            scaleX: this.mainEditor.scale().x,
            scaleY: this.mainEditor.scale().y,
        }

        return settings;

    }


    setEditorSettings(settings) {

        this.mainEditor.position({ x: settings.x, y: settings.y })
        this.mainEditor.scale({ x: settings.scaleX , y: settings.scaleY });
        this.createGrid();


        
    }

      
    
}
