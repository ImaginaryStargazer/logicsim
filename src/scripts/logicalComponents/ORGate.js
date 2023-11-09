import { Component } from "./component.js";
import { mainEditor } from "../circuitEditor.js";
import { Node } from "./node.js";

export class ORGate extends Component {
    constructor(x, y, color, highlightColor) {

        super(x, y, color, highlightColor)

        this.x = x;
        this.y = y;
        this.color = color;
        this.highlightColor = highlightColor;
        

        this.component.setAttrs({
            id: "OR",
        })

        this.layer = mainEditor.findOne("#componentLayer");

        this.input = [];

        this.input.push(new Node(-60, 20, false, false, this.color))
        this.input.push(new Node(-60, 60, false, false, this.color))

        this.output = new Node(120, 40, true, false, this.color);
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
            sceneFunc: function (context, shape) {
              context.beginPath();
              context.moveTo(-5,10);
              context.quadraticCurveTo(35, 5, 60, 40);
              context.quadraticCurveTo(35, 75, -5, 70);
              context.quadraticCurveTo(10, 40, -4, 10);
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


        this.component.add(firstInput, gateBody, secondInput, symbol, output, ANSIgateBody, this.input[0].draw(), this.input[1].draw(), this.output.draw());

        this.layer.add(this.component);
    }


    calculateValue() {

        return this.input[0].getValue() || this.input[1].getValue();

    }


    generateOutput() {

        this.output.setValue(this.calculateValue());
    }

    destroy() {

        for(let i = 0; i < this.input.length; i++) {

            this.input[i].destroy();
            delete this.input[i];

        }

        this.output.destroy();
        delete this.output;

        this.component.destroy();
        
    }

    draw() {
        this.generateOutput();
    }

}