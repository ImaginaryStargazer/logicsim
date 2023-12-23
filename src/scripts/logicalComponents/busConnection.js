import { Node } from "./node.js";
import { Component } from "./component.js";


export class BusConnection extends Component {
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);

        this.id = "BUS";
        this.nodeCount = 10;
        this.editType = "bitEdit";
    }

    setEditInfo(value) {

        this.nodeCount = value;

    }

    setupNodes() {

        let shift = 0;

        this.nodes[0] = new Node(0, 0, false, false, this.color, "I0");
        this.component.add(this.nodes[0].draw());


        for(let i = 1; i <= this.nodeCount; i++) {
            this.nodes[i] = new Node(this.nodeCount * 90 - shift, 0, true, false, this.color, "Q" + i);
            this.component.add(this.nodes[i].draw());

            shift += 80;
        }


        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const busConnection = new Konva.Line({
            points: [0, 0, this.nodeCount * 90, 0],
            stroke: this.color,
            strokeWidth: this.strokeWidth,
            hitStrokeWidth: 30
        })


        this.component.add(busConnection);
        this.setupNodes();
        this.layer.add(this.component);
    }


    draw() {

        for(let i = 1; i <= this.nodeCount; i++) {

            this.nodes[i].setValue(this.nodes[0].value);
        }
    }

}
