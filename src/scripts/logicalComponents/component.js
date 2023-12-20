import { mainEditor } from "../circuitEditor.js";


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

        this.component.setAttrs({
            x: this.posX = this.component.x(),
            y: this.posY = this.component.y(),
            rotation: this.rotation = this.component.rotation(),
        })

        this.component.setAttr("componentType", this)
        
        this.color = color;
        this.strokeWidth = 2;
        this.isFullySelected = false;
        this.nodes = [];

        this.startNodeId = undefined;


        this.component.on("contextmenu", (event) => {this.doubleClick(event)});
        this.layer = mainEditor.findOne("#componentLayer");
        this.graphingLayer = mainEditor.findOne("#graphingLayer");

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


    doubleClick(event) {
        
        if(event.target.name() === "node") return;

        let editedProperty;

        inputOption.style.display = "none";
        colorOption.style.display = "none";
        clockGenOption.style.display = "none";
        bitOption.style.display = "none";
        clockCountOption.style.display = "none";
        sequenceOption.style.display = "none";
        

        componentEditBox.style.display = "block";


        switch (this.editType) {
            case "inputEdit":
                inputOption.style.display = "block";
                editedProperty = this.numOfInputs;
                break;
            
            case "colorEdit":
                colorOption.style.display = "block";
                editedProperty = this.ledColor;
                break;

            case "clockGenEdit":
                clockGenOption.style.display = "block";
                editedProperty = this.T;
                break;           

            case "bitEdit":
                bitOption.style.display = "block";
                editedProperty = this.bits;
                break;     
        
            case "clockCountEdit":
                clockCountOption.style.display = "block";
                editedProperty = this.clockCount;
                break;   


            case "sequenceEdit":
                sequenceOption.style.display = "block";
                editedProperty = this.sequence;
                break;   

            default:
                break;
        }
        

        document.getElementById("applyComponent").onclick = () => {

            if(this.editType == "noEdit") return;

            this.ledColor = document.getElementById(this.editType).value;
            
            
            
            console.log(this)

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


    calculatePositionToScale(variable) {

        return {
            xAxis: variable / mainEditor.scaleX() - mainEditor.x() / mainEditor.scaleX(),
            yAxis: variable / mainEditor.scaleY() - mainEditor.y() / mainEditor.scaleY(),
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

            this.nodes[i].destroy();
            //delete nodeList[this.nodes[i].id]
            delete this.nodes[i];
        
        }

        this.component.destroy();

        //Node.resetNodelistId(); 
        
    }
    

    /*
    refreshNodes()

    {
        let currentID = this.nodes[0].id;


        for(let i = 0; i < this.nodes.length; i++) {

            this.nodes[i].setId(currentID);
            currentID++;
            console.log(currentID)
        }
    }
    */
    

    
}

