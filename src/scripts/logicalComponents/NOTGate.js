import { Component } from "./component.js";
import { mainEditor } from "../circuitEditor.js";
import { Node } from "./node.js";

export class NOTGate extends Component {
    constructor(x, y, color, highlightColor) {

        super(x, y, color, highlightColor)

        this.x = x;
        this.y = y;
        this.color = color;
        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "NOT",
        })

        this.layer = mainEditor.findOne("#componentLayer");


        this.input = new Node(-60, 40, false, false, this.color);
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

        const firstInput = new Konva.Line({
            points: [0, 40, -60, 40],
            stroke: this.color,
            strokeWidth: this.strokeWidth,
        });


        const output = new Konva.Line({
            points: [60, 40, 120, 40],
            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })

        this.component.add(firstInput, gateBody, symbol, output, bubble, ANSIgateBody, this.input.draw(), this.output.draw());

        this.layer.add(this.component);
    }


    calculateValue() {

        return !this.input.getValue();

    }


    generateOutput() {

        this.output.setValue(this.calculateValue());
    }


    destroy() {

        this.input.destroy();
        delete this.input;
        this.output.destroy();
        delete this.output;

        this.component.destroy();

    }

    draw() {
        this.generateOutput();
    }

} 