import { mainEditor } from "../circuitEditor.js";
import { Node } from "./node.js";
import { Component } from "./component.js";

export class LogicalOutput extends Component {

    constructor(x, y, color, highlightColor) {
        super(x, y, color, highlightColor);
        this.x = x;
        this.y = y;
        this.color = color;
        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "output"
        })

        this.input = new Node(-60, 20, false, false, this.color)

        this.layer = mainEditor.findOne("#componentLayer");
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
        
        
        const value = new Konva.Text({
            x: 12,
            y: 11,
            fill: this.color,
            text: "?",
            fontSize: 25,
        })

        const output = new Konva.Line({
            points: [0, 20, -60, 20],
            stroke: this.color,
            strokeWidth: 2,
        })


        this.component.add(body, value, output, this.input.draw());

        this.layer.add(this.component);
    }


    draw() {
        if(this.input.getValue()) {
            this.component.findOne("Text").text("1")
        } else {
            this.component.findOne("Text").text("0")
        }
    }

}