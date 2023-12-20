import { Component } from "./component.js";
import { Node } from "./node.js";

export class ORGate extends Component {
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation)



        this.id = "OR";
        this.editType = "inputEdit";
        this.numOfInputs = 2;
    }


    setupNodes() {

        this.nodes[0] = new Node(-60, 20, false, false, this.color); // I0
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-60, 60, false, false, this.color); // I1
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(120, 40, true, false, this.color); // Y0
        this.component.add(this.nodes[2].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {
        
        const gateBody = new Konva.Rect({
            x: 0,
            y: 0,
            width: 60,
            height: 80,
            stroke: this.color,
            strokeWidth: this.strokeWidth,
            visible: true,
            id: "IEC"
        });

        
        const symbol = new Konva.Text({
            x: 22,
            y: 28,
            fill: this.color,
            text: "1",
            fontSize: 30,
            visible: true,
            id: "IEC"
        });
        
        var ANSIgateBody = new Konva.Shape({
            sceneFunc: (context, shape) => {
                context.beginPath();
                context.moveTo(-5, 10);
                context.quadraticCurveTo(35, 5, 60, 40);
                context.quadraticCurveTo(35, 75, -5, 70);
                context.quadraticCurveTo(10, 40, -4, 10);
                context.closePath();
                context.fillStrokeShape(shape);

            },

            height: 80,
            stroke: this.color,
            strokeWidth: this.strokeWidth,
            visible: false,
            id: "ANSI",

          });
        

        const firstInput = new Konva.Line({
            points: [0, 20, -60, 20],
            stroke: this.color,
            strokeWidth: this.strokeWidth,
        });

        const secondInput = new Konva.Line({
            points: [0, 60, -60, 60],
            stroke: this.color,
            strokeWidth: this.strokeWidth,
        });

        const output = new Konva.Line({
            points: [60, 40, 120, 40],
            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })


        this.component.add(firstInput, gateBody, secondInput, symbol, output, ANSIgateBody);
        this.setupNodes();

        this.layer.add(this.component);
    }


    calculateValue() {

        return this.nodes[0].getValue() || this.nodes[1].getValue();

    }


    generateOutput() {

        this.nodes[2].setValue(this.calculateValue());
    }


    draw() {
        this.generateOutput();
    }

}