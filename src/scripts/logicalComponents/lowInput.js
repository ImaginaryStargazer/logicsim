import { mainEditor } from "../circuitEditor.js";
import { Component } from "./component.js";
import { Node } from "./node.js";

export class LowInput extends Component{
    constructor(x, y, color, highlightColor) {
        super(x, y, color, highlightColor)
        this.x = x;
        this.y = y;
        this.color = color;
        this.value = false;

        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "LI",
        })

        this.layer = mainEditor.findOne("#componentLayer");

        this.output = new Node(100, 20, true, this.value, this.color);
    }

    render() {

        const body = new Konva.Rect({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            stroke: this.color,
            strokeWidth: 2
        })
        
        
        const low = new Konva.Text({
            x: 12,
            y: 11,
            fill: this.color,
            text: "0",
            fontSize: 25,
        })

        const output = new Konva.Line({
            points: [40, 20, 100, 20],
            stroke: this.color,
            strokeWidth: 2,
        })


        this.component.add(body, low, output, this.output.draw());

        this.layer.add(this.component);
    }

    draw() {
        
    }
}