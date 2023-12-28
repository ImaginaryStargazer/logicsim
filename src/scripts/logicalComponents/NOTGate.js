import { Component } from "./component.js";
import { Node } from "./node.js";

export class NOTGate extends Component {
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation)

        this.id = "NOT";
        this.editType = "noEdit";
    }

    setupNodes() {
        
        this.nodes[0] = new Node(-60, 40, false, false, this.color); // I0
        this.nodes[0].createPin(0, 40, -60, 40, this.component);

        this.nodes[1] = new Node(120, 40, true, false, this.color); // Y0
        this.nodes[1].createPin(60, 40, 120, 40, this.component);

        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const IECgateBody = new Konva.Shape({
            
            sceneFunc: (context, shape) => {

                context.fillStyle = this.color;
                context.font = "bold 25px Arial";
                context.beginPath();
                context.rect(0,0,60,this.numOfInputs * 40);
                context.fillText("&", 20, 40);
                context.fillStrokeShape(shape);
            },

            id: "IEC",
            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        const ANSIgateBody = new Konva.RegularPolygon({
            x: 20,
            y: 40,
            sides: 3,
            radius: 40,
            stroke: this.color,
            strokeWidth: this.strokeWidth,
            rotation: 90,
            visible: false,
            id: "ANSI",
        })

        const bubble = new Konva.Circle({
            x: 65,
            y: 40,
            radius: 5,
            fill: this.color,
            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })

        if(this.useEuroGates()) {
            IECgateBody.visible(true);
            ANSIgateBody.visible(false);
        } else {
            IECgateBody.visible(false);
            ANSIgateBody.visible(true);
        }


        this.setupNodes();
        this.component.add(IECgateBody, bubble, ANSIgateBody);


        this.layer.add(this.component);
    }


    calculateValue() {

        return !this.nodes[0].getValue();

    }



    draw() {
        this.nodes[1].setValue(this.calculateValue());
    }

} 