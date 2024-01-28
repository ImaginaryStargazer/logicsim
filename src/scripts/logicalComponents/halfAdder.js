import { Node } from "./node.js";
import { Component } from "./component.js";


export class HalfAdder extends Component {
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);
        this.id = "HAD";
        this.editType = "noEdit";
    }

    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color);
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "A", 10, 25);

        this.nodes[1] = new Node(-20, 60, false, false, this.color);
        this.nodes[1].createPin(0, 60, -20, 60, this.component, "B", 10, 65);

        this.nodes[2] = new Node(80, 20, true, false, this.color);
        this.nodes[2].createPin(60, 20, 80, 20, this.component, "S", 40, 25);

        this.nodes[3] = new Node(80, 60, true, false, this.color);
        this.nodes[3].createPin(60, 60, 80, 60, this.component, "C", 40, 65);

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const halfAdder = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0, 0, 60, 80);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.setupNodes();
        this.component.add(halfAdder);
        this.layer.add(this.component);

    }


    execute() {

        // S = A ⊕ B
        // C = A.B

        this.nodes[2].setValue(this.nodes[0].value ^ this.nodes[1].value); // S
        this.nodes[3].setValue(this.nodes[0].value & this.nodes[1].value); // C
    }

}