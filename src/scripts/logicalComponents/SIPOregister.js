import { Node } from "./node.js";
import { Component } from "./component.js";

export class SIPOregister extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation); 

        this.id = "SIPO";
        this.editType = "chipEdit";
        this.bits = 8;

        this.DATA_PIN_INDEX = 2;
        this.lastClock = false;
    }


    setEditInfo() {

        let inputValue = document.getElementById("bitEdit").value;


        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        this.destroy();
        this.bits = Number(inputValue);
        this.render();
    }

    setupNodes() {

        let shift = 20;

        this.nodes[0] = new Node(-20, 20, false, false, this.color);
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "D", 5, 25, 12);

        this.nodes[1] = new Node(-20, 40, false, false, this.color);
        this.nodes[1].createPin(0, 40, -20, 40, this.component, "CLK", 5, 45, 12);

        for(let i = 0; i != this.bits; i++) {

            this.nodes[this.DATA_PIN_INDEX + i] = new Node(shift, -20, true, false, this.color);
            this.nodes[this.DATA_PIN_INDEX + i].createPin(shift, 0, shift, -20, this.component, "Q" + i, shift - 10, 15, 9);

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
                context.rect(0, 0, this.bits * 20 + 20, 60);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.setupNodes();
        this.component.add(sipoRegister);
        this.layer.add(this.component);
    }


    execute() {

        if (this.nodes[1].value != this.lastClock) {
			this.lastClock = this.nodes[1].value;

			if (this.lastClock && this.bits > 0) {

				for (let i = this.bits - 2; i >= 0; i--)
					this.nodes[this.DATA_PIN_INDEX + i + 1].value = this.nodes[this.DATA_PIN_INDEX + i].value;
                
				this.nodes[2].value = this.nodes[0].value;
			}
		}
    }


}