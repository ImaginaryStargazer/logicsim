import { Node } from "./node.js";
import { Component } from "./component.js";


export class BinarySwitch extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "BSW";
        this.editType = "noEdit";

        this.lastClock = false;
    }


    setupNodes() {

        this.nodes[0] = new Node(80, 20, true, false, this.color);
        this.nodes[0].createPin(60, 20, 80, 20, this.component, "T", 45, 25);

        this.nodes[1] = new Node(80, 40, true, false, this.color);
        this.nodes[1].createPin(60, 40, 80, 40, this.component, "F", 45, 45);

        this.nodes[2] = new Node(-20, 20, false, false, this.color);
        this.nodes[2].createPin(0, 20, -20, 20, this.component, "I0", 5, 25);

        this.startNodeId = this.nodes[0].id;
        
    }

    render() {

        const binarySwitch = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, 60, 60);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.setupNodes();
        this.component.add(binarySwitch);
        this.layer.add(this.component);

    }


    draw() {

        if(this.lastClock) {

            this.nodes[0].value = true;
            this.nodes[1].value = false;
            
        } else {
            this.nodes[0].value = false;
            this.nodes[1].value = true;
        }

        this.lastClock = this.nodes[2].value;

    }


}