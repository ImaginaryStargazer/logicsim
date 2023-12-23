import { Node } from "./node.js";
import { Component } from "./component.js";


export class RingCounter extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);


        this.id = "RCTR";
        this.editType = "bitEdit";
        this.bits = 7;

        this.lastClock = undefined;

    }

    setEditInfo(value) {

        this.bits = value;

    }


    setupNodes() {

        this.nodes[0] = new Node(20, -20, true, false, this.color, "Q0");
        this.component.add(this.nodes[0].draw());
        this.nodes[1] = new Node(40, -20, true, false, this.color, "Q1");
        this.component.add(this.nodes[1].draw());
        this.nodes[2] = new Node(60, -20, true, false, this.color, "Q2");
        this.component.add(this.nodes[2].draw());
        this.nodes[3] = new Node(80, -20, true, false, this.color, "Q3");
        this.component.add(this.nodes[3].draw());
        this.nodes[4] = new Node(100, -20, true, false, this.color, "Q4");
        this.component.add(this.nodes[4].draw());
        this.nodes[5] = new Node(120, -20, true, false, this.color, "Q5");
        this.component.add(this.nodes[5].draw());
        this.nodes[6] = new Node(140, -20, true, false, this.color, "Q6");
        this.component.add(this.nodes[6].draw());

        this.nodes[7] = new Node(60, 80, false, false, this.color, "CE'");
        this.component.add(this.nodes[7].draw());
        this.nodes[8] = new Node(140, 80, false, false, this.color, "R");
        this.component.add(this.nodes[8].draw());

        this.nodes[9] = new Node(-20, 40, false, false, this.color, "CLK");
        this.component.add(this.nodes[9].draw());

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const ringCounter = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, 160, 60);
                context.fillStyle = this.color;
                context.font = "bold 13px Arial";

                let ii = 0;
                for(let i = 20; i < 160; i+= 20) {
                    context.moveTo(i,0);
                    context.lineTo(i,-20);


                    context.fillText(this.nodes[ii].label, i - 10, 20);

                    ii++;
                }

                for(let i = 60; i <= 140; i+= 80) {
                    context.moveTo(i,60);
                    context.lineTo(i,80);
                    context.fillText(this.nodes[ii].label, i - 5, 50);

                    ii++;
                }

                context.fillText(this.nodes[ii].label, 5, 45);
                context.moveTo(0, 40);
                context.lineTo(-20, 40);

                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.component.add(ringCounter);
        this.setupNodes();
        this.layer.add(this.component);

    }


    draw() {
        // namiesto 7 budeme davat uzivatelom zvoleny pocet bitov
        let i;

        let running = true;
        if (this.nodes[7].value)
		    running = false;
	
	    for (i = 0; i != 7; i++)
		if (this.nodes[i].value)
		    break;
	    
	    if (this.nodes[9].value && !this.lastClock && running) {
		if (i < 7)
		    this.nodes[i++].value = false;
		i %= 7;
		this.nodes[i].value = true;
	    }

        if (this.nodes[8].value) {
            for (i = 1; i != 7; i++)
                this.nodes[i].value = false;
            this.nodes[0].value = true;
        }

        this.lastClock = this.nodes[9].value;
    }

}
