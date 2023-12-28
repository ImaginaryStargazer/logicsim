import { Node } from "./node.js";
import { Component } from "./component.js";

export class SequenceGenerator extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "SQG";
        this.editType = "sequenceEdit";

        this.sequence = "01010000";
        this.lastClock = false;
        this.bitPosition = 0; 
        this.justLoaded = true;
    }


    setEditInfo() {

        let inputValue = document.getElementById("sequenceEdit").value;

        this.sequence = inputValue;
    }

    setupNodes() {

        this.nodes[0] = new Node(-20, 20, false, false, this.color);
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "CLK", 5, 25);

        this.nodes[1] = new Node(-20, 40, false, false, this.color);
        this.nodes[1].createPin(0, 40, -20, 40, this.component, "R", 5, 45);

        this.nodes[2] = new Node(80, 40, true, false, this.color);
        this.nodes[2].createPin(60, 40, 80, 40, this.component, "Q", 45, 45);
        
        this.startNodeId = this.nodes[0].id;
    }

    

    render() {

        const sequenceGenerator = new Konva.Shape({
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
        this.component.add(sequenceGenerator);
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