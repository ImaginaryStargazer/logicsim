import { Node } from "./node.js";
import { Component } from "./component.js";

export class SequenceGenerator extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "SQG";

        this.sequence = "01010000";
        this.lastClock = false;
        this.bitPosition = 0; 
        this.justLoaded = true;
    }


    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color, "CLK");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(-20, 40, false, false, this.color, "R");
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(80, 40, true, false, this.color, "Q");
        this.component.add(this.nodes[2].draw());
        
        this.startNodeId = this.nodes[0].id;
    }

    

    render() {

        const sequenceGenerator = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();

                context.rect(0, 0, 60, 60);
                
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for(let i = 20; i <= 40; i+=20) {
                    context.moveTo(0, i);
                    context.lineTo(-20, i);

                    context.fillText(this.nodes[ii].label, 5, 5 + i)

                    ii++;
                }

                context.moveTo(60, 40);
                context.lineTo(80, 40);
                context.fillText(this.nodes[ii].label, 45, 45)

                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(sequenceGenerator);
        this.setupNodes();
        this.layer.add(this.component);
    }

    checkSequence() {

        let pattern = /^[01]+$/;

        if(!pattern.test(this.sequence)) {
            this.sequence = "";
        }

    }

    nextBit() {

        if(this.justLoaded) {
            this.checkSequence();
            this.justLoaded = false;
        }


        if (this.sequence.length > 0) {

            if (this.bitPosition >= this.sequence.length) {

				this.bitPosition = 0;

			}
            let value = Number(this.sequence[this.bitPosition])
			this.nodes[2].setValue(value);
			this.bitPosition++;

		} else {
			this.nodes[2].value = false;
		}
    }

    draw() {

        if(this.nodes[1].value) {
            this.bitPosition = 0;
            this.nodes[2].value = Number(this.sequence[this.bitPosition]);

            } else if(this.nodes[0].value && !this.lastClock) {

            this.lastClock = this.nodes[0].value

            if(this.lastClock) {
                this.nextBit();
            }
        }
        
        this.lastClock = this.nodes[0].value
    }

}