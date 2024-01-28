import { Component } from "./component.js";
import { Node } from "./node.js";


export class D_FlipFlop extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation)


        this.id = "DFF";
        this.editType = "noEdit";
        this.lastClock = undefined;

    }

    setupNodes() {

        
        this.nodes[0] = new Node(-20, 20, false, false, this.color);
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "D", 5, 25);

        this.nodes[1] = new Node(-20, 60, false, false, this.color); 
        this.nodes[1].createPin(0, 60, -20, 60, this.component, "CLK", 5, 65);

        this.nodes[2] = new Node(80, 20, true, false, this.color);
        this.nodes[2].createPin(60, 20, 80, 20, this.component, "Q", 45, 25);

        this.nodes[3] = new Node(80, 60, true, true, this.color);
        this.nodes[3].createPin(60, 60, 80, 60, this.component, "Q'", 45, 65);


        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const D_FlipFlop = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                
                context.beginPath();
                context.rect(0, 0, 60, 80);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,

        })

        this.setupNodes();
        this.component.add(D_FlipFlop);


        this.layer.add(this.component);

    }

    execute() {

        if(this.nodes[1].getValue() && !this.lastClock) {
            this.nodes[2].setValue(this.nodes[0].getValue())
        }


        this.nodes[3].setValue(!this.nodes[2].getValue());
	    this.lastClock = this.nodes[1].getValue();
    }


}