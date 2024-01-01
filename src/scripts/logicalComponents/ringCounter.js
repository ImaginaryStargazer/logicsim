import { Node } from "./node.js";
import { Component } from "./component.js";


export class RingCounter extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "RCTR";
        this.editType = "chipEdit";
        this.bits = 10;

        this.lastClock = undefined;

    }

    setEditInfo() {

        let inputValue = document.getElementById("bitEdit").value;


        if (!this.validateInputFields(inputValue) || inputValue < 5  || inputValue == "") return;

        this.destroy();
        this.bits = Number(inputValue);
        this.render();
    }


    setupNodes() {

        let shift = 20;

        for(let i = 0; i < this.bits; i++) {

            this.nodes[i] = new Node(shift, -20, true, false, this.color);
            this.nodes[i].createPin(shift, 0, shift, -20, this.component, "Q" + i, shift - 10, 15, 9);

            shift += 20;

        }

        this.nodes[this.bits] = new Node(60, 80, false, false, this.color);
        this.nodes[this.bits].createPin(60, 60, 60, 80, this.component, "CE'", 50, 50);

        this.nodes[this.bits + 1] = new Node(100, 80, false, false, this.color);
        this.nodes[this.bits + 1].createPin(100, 60, 100, 80, this.component, "R", 95, 50);

        this.nodes[this.bits + 2] = new Node(-20, 40, false, false, this.color);
        this.nodes[this.bits + 2].createPin(0, 40, -20, 40, this.component, "CLK", 5, 45);

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const ringCounter = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, this.bits * 20 + 20, 60);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.setupNodes();
        this.component.add(ringCounter);
        this.layer.add(this.component);

    }


    draw() {
        let i;

        let running = true;

        if (this.nodes[this.bits].value)
		    running = false;
	
	    for (i = 0; i != this.bits; i++)
		    if (this.nodes[i].value)
		        break;
	    
	    if (this.nodes[this.bits + 2].value && !this.lastClock && running) {
            if (i < this.bits)
                this.nodes[i++].value = false;
            i %= this.bits;
            this.nodes[i].value = true;
	    }

        if (this.nodes[this.bits + 1].value) {
            for (i = 1; i != this.bits; i++)
                this.nodes[i].value = false;
            this.nodes[0].value = true;
        }

        this.lastClock = this.nodes[this.bits + 2].value;
    }

}
