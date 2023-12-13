import { Component } from "./component.js";
import { Node } from "./node.js";

export class LowInput extends Component{
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation)

        this.value = false;


        this.id = "LI";


    }

    setupNodes() {

        this.nodes[0] = new Node(100, 20, true, this.value, this.color);
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


        this.component.add(body, low, output);
        this.setupNodes();

        this.layer.add(this.component);
    }

    draw() {
        
    }


    
}