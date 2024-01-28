import { Component } from "./component.js";
import { Node } from "./node.js";

export class JK_FlipFlop extends Component {
    
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "JKFF";
        this.editType = "noEdit";

        this.lastClock = undefined;

    }


    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color);
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "J", 5, 25);

        this.nodes[1] = new Node(-20, 40, false, false, this.color); 
        this.nodes[1].createPin(0, 40, -20, 40, this.component, "CLK", 5, 45);

        this.nodes[2] = new Node(-20, 60, false, false, this.color);
        this.nodes[2].createPin(0, 60, -20, 60, this.component, "K", 5, 65);

        this.nodes[3] = new Node(80, 20, true, false, this.color);
        this.nodes[3].createPin(60, 20, 80, 20, this.component, "Q", 45, 25);

        this.nodes[4] = new Node(80, 60, true, true, this.color);
        this.nodes[4].createPin(60, 60, 80, 60, this.component, "Q'", 45, 65);


        this.startNodeId = this.nodes[0].id;
    }


    render() {
        
        const JK_FlipFlop = new Konva.Shape({
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
        this.component.add(JK_FlipFlop);
        this.layer.add(this.component);

    }


    execute() {

        let transition;

		transition = !this.nodes[1].getValue() && this.lastClock;

	    if (transition) {

		let q = this.nodes[3].getValue();

		if (this.nodes[0].getValue()) {

		    if (this.nodes[2].getValue())
			q = !q;
		    else
			q = true;

		} else if (this.nodes[2].getValue())
		    q = false;

            this.nodes[3].setValue(q)
	    }

	    this.lastClock = this.nodes[1].value;
	    
        this.nodes[4].setValue(!this.nodes[3].getValue())
    }

}