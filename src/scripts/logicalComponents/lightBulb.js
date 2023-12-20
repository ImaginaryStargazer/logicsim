import { Component } from "./component.js";
import { Node } from "./node.js";

export class LightBulb extends Component {

    constructor(x, y, color, rotation) {
        super(x, y, color, rotation)


        this.id = "BLB";
        this.editType = "colorEdit";
        this.ledColor = "orange";

    }

    setupNodes() {

        this.nodes[0] = new Node(-80, 0, false, false, this.color);
        this.component.add(this.nodes[0].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const body = new Konva.Circle({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            stroke: this.color,
            strokeWidth: 2,
        })

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


        const output = new Konva.Line({
            points: [-20, 0, -80, 0],
            stroke: this.color,
            strokeWidth: 2,
            name: "wire"

        })


        this.component.add(body, output);
        this.setupNodes();

        this.layer.add(this.component);
    }

    draw() {
        if(this.nodes[0].getValue()) {
            this.component.findOne("Circle").fill(this.ledColor)
        } else {
            this.component.findOne("Circle").fill("")
        }
    }


}