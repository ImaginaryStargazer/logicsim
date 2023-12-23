import { Node } from "./node.js";
import { Component } from "./component.js";

export class SIPOregister extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation); 

        this.id = "SIPO";
        this.editType = "bitEdit";
        this.bits = 8;

        this.DATA_PIN_INDEX = 2;
        this.lastClock = false;
    }


    setEditInfo(value) {

        this.bits = value;

    }

    setupNodes() {

        let shift = 20;

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "D");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 40, false, false, this.color, "CLK");
        this.component.add(this.nodes[1].draw());

        for(let i = 0; i != 8; i++) {

            this.nodes[this.DATA_PIN_INDEX + i] = new Node(shift, -20, true, false, this.color, "Q" + i);
            this.component.add(this.nodes[this.DATA_PIN_INDEX + i].draw());

            shift += 20;
        }
        
        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const sipoRegister = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, 180, 60);
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0

                for(let i = 20; i <= 40; i+=20) {
                    context.moveTo(0, i);
                    context.lineTo(-20, i);

                    context.fillText(this.nodes[ii].label, 3, i + 5);

                    ii++;
                }

                for(let i = 20; i < 180; i+=20) {
                    context.moveTo(i, 0);
                    context.lineTo(i, -20);

                    context.fillText(this.nodes[ii].label, i - 10, 15);

                    ii++;
                }


                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(sipoRegister);
        this.setupNodes();
        this.layer.add(this.component);
    }


    draw() {

        if (this.nodes[1].value != this.lastClock) {
			this.lastClock = this.nodes[1].value;
			if (this.lastClock && 8 > 0) {

				for (let i = 8 - 2; i >= 0; i--) {
					this.nodes[this.DATA_PIN_INDEX + i + 1].value = this.nodes[this.DATA_PIN_INDEX + i].value;
                }

				
				this.nodes[2].value = this.nodes[0].value;
			}
		}
    }


}