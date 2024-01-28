import { Node } from "./node.js";
import { Component } from "./component.js";


export class FullAdder extends Component {

    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);
        this.id = "FAD";
        this.editType = "noEdit";
    }

    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color);
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "A", 5, 25);

        this.nodes[1] = new Node(-20, 40, false, false, this.color);
        this.nodes[1].createPin(0, 40, -20, 40, this.component, "B", 5, 45);

        this.nodes[2] = new Node(-20, 60, false, false, this.color);
        this.nodes[2].createPin(0, 60, -20, 60, this.component, "Cin", 5, 65);

        this.nodes[3] = new Node(80, 20, true, false, this.color);
        this.nodes[3].createPin(60, 20, 80, 20, this.component, "S", 45, 25);

        this.nodes[4] = new Node(80, 60, true, false, this.color);
        this.nodes[4].createPin(60, 60, 80, 60, this.component, "C", 45, 65);

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const fullAdder = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0, 0, 60, 80);
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.setupNodes();
        this.component.add(fullAdder);
        this.layer.add(this.component);

    }

    execute() {

        // S = A ⊕ B ⊕ Cin
        // C = A.B + B.Cin + A.Cin

        this.nodes[3].setValue(this.nodes[0].value  ^ this.nodes[1].value ^ this.nodes[2].value); // S
        this.nodes[4].setValue(this.nodes[0].value & this.nodes[1].value | this.nodes[1].value & this.nodes[2].value | this.nodes[0].value & this.nodes[2].value); // C

    }
}