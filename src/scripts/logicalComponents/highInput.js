import { Component } from "./component.js";
import { Node } from "./node.js";

export class HighInput extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.value = true;

        
        this.id = "HI";
        this.editType = "noEdit";
    }


    setupNodes() {

        this.nodes[0] = new Node(100, 20, true, this.value, this.color);
        this.nodes[0].createPin(40, 20, 100, 20, this.component);

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
        
        
        const high = new Konva.Text({
            x: 12,
            y: 11,
            fill: this.color,
            text: "1",
            fontSize: 25,
        })


        this.setupNodes();
        this.component.add(body, high);


        this.layer.add(this.component);
    }
    

    execute() {
        
    }


}