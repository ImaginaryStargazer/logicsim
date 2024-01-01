import { Node } from "./node.js";
import { Component } from "./component.js";


export class BusConnection extends Component {
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);

        this.id = "BUS";
        this.nodeCount = 5;
        this.editType = "chipEdit";
    }

    setEditInfo() {

        let inputValue = document.getElementById("bitEdit").value;

        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        this.destroy();
        this.nodeCount = inputValue;
        this.render();
    }

    setupNodes() {

        let shift = 0;

        this.nodes[0] = new Node(0, 0, false, false, this.color, "I0");
        this.nodes[0].createPin(0,0, this.nodeCount * 80, 0, this.component);

        for(let i = 1; i <= this.nodeCount; i++) {
            this.nodes[i] = new Node(this.nodeCount * 80 - shift, 0, true, false, this.color, "Q" + i);
            this.component.add(this.nodes[i].draw());

            shift += 80;
        }


        this.startNodeId = this.nodes[0].id;

    }


    render() {

        this.setupNodes();
        this.layer.add(this.component);
    }


    draw() {

        for(let i = 1; i <= this.nodeCount; i++)
            this.nodes[i].setValue(this.nodes[0].value);
        
    }

}
