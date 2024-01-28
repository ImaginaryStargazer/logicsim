import { Component } from "./component.js";
import { Node } from "./node.js";

export class LightBulb extends Component {

    constructor(x, y, color, rotation) {
        super(x, y, color, rotation)


        this.id = "BLB";
        this.editType = "colorEdit";
        this.ledColor = "orange";

        this.bulb = new Konva.Circle({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            stroke: this.color,
            strokeWidth: 2,
        })

    }

    setEditInfo() {

        const inputValue = document.getElementById("colorEditValue").value;

        this.ledColor = inputValue;

    }

    setupNodes() {

        this.nodes[0] = new Node(-80, 0, false, false, this.color);
        this.nodes[0].createPin(-20, 0, -80, 0, this.component);


        this.startNodeId = this.nodes[0].id;
    }


    render() {

        let shift = 0;

        for(let i = 0; i < 2; i++) {
            const symbol = new Konva.Line({
                points: [0, -20, 0, 20],
                stroke: this.color,
                strokeWidth: 2,
                rotation: shift += 45
            })

            shift += 45;

            this.component.add(symbol);
        }

        this.setupNodes();
        this.component.add(this.bulb);
        this.layer.add(this.component);
    }

    execute() {
        if(this.nodes[0].getValue()) {
            this.bulb.fill(this.ledColor)
        } else {
            this.bulb.fill("")
        }
    }


}