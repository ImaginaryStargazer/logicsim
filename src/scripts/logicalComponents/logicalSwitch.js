import { mainEditor } from "../circuitEditor.js";
import { Component } from "./component.js";
import { Node } from "./node.js";

export class LogicalSwitch extends Component {
    constructor(x, y, color, highlightColor) {
        super(x, y, color, highlightColor);
        this.x = x;
        this.y = y;
        this.color = color;
        this.highlightColor = highlightColor;

        this.component.setAttrs({
            id: "LSW"
        })

        this.component.on("dblclick", () => {this.doubleClick()});

        this.output = new Node(100, 20, true, false, this.color);

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
        
        
        const button = new Konva.Circle({
            x: 20,
            y: 20,
            radius: 10,
            strokeWidth: 2,
            stroke: this.color,
            fill: "#343a40",
            id: "button"
        })

        const output = new Konva.Line({
            points: [40, 20, 100, 20],
            stroke: this.color,
            strokeWidth: 2,
            
        })


        this.component.add(body, button, output, this.output.draw());

        this.layer.add(this.component);
    }

    draw() {

    }


    doubleClick() {
        
        this.toggle();
        this.output.setValue(this.value);

        if(this.output.getValue()) {

            this.component.findOne("#button").setAttrs({
                fill: "green"
            });
        } else {
            this.component.findOne("#button").setAttrs({
                fill: "#343a40"
            });
        }
    }
}