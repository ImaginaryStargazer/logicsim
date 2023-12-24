import { Component } from "./component.js";
import { Node } from "./node.js";

export class LogicalSwitch extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "LSW";
        this.editType = "noEdit";

        this.component.on("pointerdblclick", () => {this.doubleClick()});

    }

    setupNodes() {

        this.nodes[0] = new Node(100, 20, true, false, this.color);
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


        this.component.add(body, button, output);
        this.setupNodes();

        this.layer.add(this.component);
    }

    draw() {

    }


    doubleClick() {
        this.toggle();
        this.nodes[0].setValue(this.value);

        if(this.nodes[0].getValue()) {

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
