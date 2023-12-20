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

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "J");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 40, false, false, this.color, "CLK"); 
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(-20, 60, false, false, this.color, "K");
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(80, 20, true, false, this.color, "Q");
        this.component.add(this.nodes[3].draw());
        this.nodes[4] = new Node(80, 60, true, true, this.color, "Q'");
        this.component.add(this.nodes[4].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {
        
        const JK_FlipFlop = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0, 0, 60, 80);
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let shift = 0;
                for(let i = 0; i < 3; i++) {

                    context.moveTo(0, 20 + shift);
                    context.lineTo(-20, 20 + shift);
                    context.fillText(this.nodes[i].label, 3, 5 +  20 + shift)

                    shift += 20;
                }

                shift = 0;

                for(let i = 0; i < 2; i++) {

                    context.moveTo(60, 20 + shift);
                    context.lineTo(80, 20 + shift);
                    context.fillText(this.nodes[i + 3].label, 45, 5 +  20 + shift);

                    shift += 40;
                }

                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(JK_FlipFlop);
        this.setupNodes();
        this.layer.add(this.component);

    }


    draw() {

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