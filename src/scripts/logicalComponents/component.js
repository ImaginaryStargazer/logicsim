import { mainEditor, wireMng, useIECgates } from "../circuitEditor.js";
import { openAlert } from "../userInterface.js";


export class Component {
    constructor(x, y, color, rotation) {

        this.component = new Konva.Group({
            x: x,
            y: y,
            name: "component",
            draggable: true,
            width: 60,
            height: 80,
            rotation: rotation
        })

        /*
        this.component.setAttrs({
            x: this.posX = this.component.x(),
            y: this.posY = this.component.y(),
            rotation: this.rotation = this.component.rotation(),
        })
        */

        this.component.setAttr("componentType", this)
        
        this.color = color;
        this.strokeWidth = 2;
        this.isFullySelected = false;
        this.nodes = [];
        this.useIECgates = useIECgates;

        this.startNodeId = undefined;


        this.component.on("contextmenu", (event) => {this.rightClick(event)});
        this.layer = mainEditor.findOne("#componentLayer");
        this.graphingLayer = mainEditor.findOne("#graphingLayer");



    }


    useEuroGates() {

        this.useIECgates = useIECgates;

        return this.useIECgates;
    }


    mouseOver() {

        this.component.getChildren().forEach(shape => {
            shape.setAttrs({
                stroke: "red"
            })
        })
    }


    mouseOut() {

        this.component.getChildren().forEach(shape => {
            shape.setAttrs({
                stroke: "white"
            })
        })
    }


    toggle() {
        this.value ^= true;
    }


    getEditInfo() {

        this.hideEditInfo();

        switch(this.editType) {

            case "gateEdit":
                gateEditBox.style.display = "block";
                break;
            case "clockGenEdit":
                clockGenEditBox.style.display = "block";
                break;
            case "ledArrEdit":
                ledArrEditBox.style.display = "block";
                break;
            case "chipEdit":
                chipEditBox.style.display = "block";
                break;
            case "colorEdit":
                colorEdit.style.display = "block";
                break;
            case "decimalDisplayEdit":
                decimalDisplayEdit.style.display = "block";
                break;
            case "sequenceEdit":
                sequenceGenEditBox.style.display = "block";
                break;
            case "clockCountEdit":
                clockCountEditBox.style.display = "block";
                break;
            case "customEdit":
                customLogicEditBox.style.display = "block";
                break;
            case "labelEdit":
                labelEditBox.style.display = "block";
            default: break;
        }

    }

    hideEditInfo() {
        gateEditBox.style.display = "none";
        clockGenEditBox.style.display = "none";
        ledArrEditBox.style.display = "none";
        chipEditBox.style.display = "none";
        colorEdit.style.display = "none";
        decimalDisplayEdit.style.display = "none";
        sequenceGenEditBox.style.display = "none";
        clockCountEditBox.style.display = "none";
        customLogicEditBox.style.display = "none";
        labelEditBox.style.display = "none";
    }


    rightClick(event) {
        
        if(event.target.name() === "node") return;

        componentEditBox.style.display = "block";
        this.getEditInfo();
        

        document.getElementById("applyComponent").onclick = () => {

            this.setEditInfo();
        
        }
        

        document.getElementById("okComponent").onclick = () => {

            componentEditBox.style.display  = "none";
        }

    }

    updatePosition() {

        this.posX = this.component.x();
        this.posY = this.component.y();


    }

    updateRotation() {
        this.rotation = this.component.rotation();
    }


    calculatePositionToScale(value) {

        return {
            xAxis: value / mainEditor.scaleX() - mainEditor.x() / mainEditor.scaleX(),
            yAxis: value / mainEditor.scaleY() - mainEditor.y() / mainEditor.scaleY(),
        };
    }




    refreshNodes() {

        let currentID = this.startNodeId;


        for(let i = 0; i < this.nodes.length; i++) {

            this.nodes[i].setID(currentID);
            currentID++;
        }
    }

    
    destroy() {

        //
    

        for(let i = 0; i < this.nodes.length; i++) {

            if(this.nodes[i] === undefined) continue;

            this.nodes[i].destroy();
            //delete nodeList[this.nodes[i].id]
            delete this.nodes[i];
        
        }

        this.component.destroy();
        wireMng.draw();
    }


    validateInputFields() {

        var pattern = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;

    
        for (var i = 0; i < arguments.length; i++) {
            if (!pattern.test(arguments[i])) {
                arguments[i] = "";
                openAlert("error", "WrongInput");
                return false;
            }
        }
    
        return true;
    }

    
}

