import { Node } from "./node.js";
import { Component } from "./component.js";

export class LogicalOutput extends Component {

    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "OUT";
        this.editType = "noEdit";

    }

    setupNodes() {

        this.nodes[0] = new Node(-60, 20, false, false, this.color);
        this.component.add(this.nodes[0].draw());

        this.startNodeId = this.nodes[0].id;
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


        this.component.add(body, value, output);
        this.setupNodes();

        this.layer.add(this.component);
    }


    draw() {
        if(this.nodes[0].getValue()) {
            this.component.findOne("Text").text("1")
        } else {
            this.component.findOne("Text").text("0")
        }
    }


}