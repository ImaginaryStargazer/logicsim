import { Component } from "./component.js";
import { Node } from "./node.js";

export class ORGate extends Component {
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation)

        this.id = "OR";
        this.editType = "gateEdit";
        this.numOfInputs = 2;
    }

    setEditInfo() {

        let inputValue = document.getElementById("inputEdit").value;

        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        this.destroy();
        this.numOfInputs = inputValue;
        this.render();
    }

    setupNodes() {

        let shift = 20;

        for(let i = 0; i < this.numOfInputs; i++) {
            this.nodes[i] = new Node(-60, shift, false, false, this.color, "I" + i);
            this.nodes[i].createPin(0, shift, -60, shift, this.component);

            shift += 40;
        }


        this.nodes[this.numOfInputs] = new Node(120, (this.numOfInputs * 40) / 2, true, false, this.color, "Y0"); // Y0
        this.nodes[this.numOfInputs].createPin(60, (this.numOfInputs * 40) / 2, 120,  (this.numOfInputs * 40) / 2, this.component);

        this.startNodeId = this.nodes[0].id;
    }


    render() {
        
        const IECgateBody = new Konva.Shape({
            
            sceneFunc: (context, shape) => {

                context.fillStyle = this.color;
                context.font = "bold 25px Arial";
                context.beginPath();
                context.rect(0,0,60,this.numOfInputs * 40);
                context.fillText("1", 20, 40);
                context.fillStrokeShape(shape);
            },

            id: "IEC",
            stroke: this.color,
            strokeWidth: this.strokeWidth
        })
        
        var ANSIgateBody = new Konva.Shape({
            sceneFunc: (context, shape) => {
                context.beginPath();
                context.moveTo(-5, 10);

                context.quadraticCurveTo(35, 0, 60, (this.numOfInputs * 40) / 2);
                context.quadraticCurveTo(35, this.numOfInputs * 40, -5, this.numOfInputs * 40 - 10);
                context.quadraticCurveTo(10, (this.numOfInputs * 40) / 2, -5, 10);
                
                context.fillStrokeShape(shape);

            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,
            visible: false,
            id: "ANSI",
        });

        if(this.useEuroGates()) {
            IECgateBody.visible(true);
            ANSIgateBody.visible(false);
        } else {
            IECgateBody.visible(false);
            ANSIgateBody.visible(true);
        }
        

        this.setupNodes();
        this.component.add(IECgateBody, ANSIgateBody);

        this.layer.add(this.component);
    }


    calculateValue() {

        let q = false;

        for(let i = 0; i < this.numOfInputs; i++) 
            q |= this.nodes[i].value;
        
        return q;

    }



    execute() {

        this.nodes[this.numOfInputs].setValue(this.calculateValue());
    }

}