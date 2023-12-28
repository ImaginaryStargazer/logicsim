import { Component } from "./component.js";
import { Node } from "./node.js";

export class ClockGen extends Component{
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        
        this.value = false;

        this.id = "CLK";
        this.editType = "clockGenEdit";

        // perioda a duty cycle 
        this.T = 500;
        this.lastTick = new Date().getTime();
    }

    setEditInfo() {

        let inputValue = document.getElementById("clockGenEdit").value;

        if(!Number(inputValue)) return;

        this.T = Number(inputValue);
    }

    setupNodes() {

        this.nodes[0] = new Node(100, 20, true, this.value, this.color);
        this.nodes[0].createPin(40, 20, 100, 20, this.component);

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const body = new Konva.Rect({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            stroke: this.color,
            strokeWidth: 2
        })
        
        
        const symbol = new Konva.Line({
            points: [5, 25, 15, 25, 15, 10, 25, 10, 25, 25, 35, 25],
            stroke: this.color,
            strokeWidth: 2,
        })

        
        this.setupNodes();
        this.component.add(body, symbol);


        this.layer.add(this.component)
    }

    draw() {
        const currTick = new Date().getTime();

        const period = (this.value) ? this.T * 50 / 100 : this.T * (100 - 50) / 100;
        
        if (currTick - this.lastTick > period) {
            this.toggle();
            this.lastTick = currTick;
        }


        this.nodes[0].setValue(this.value);
    }

}



/*

        // perioda a duty cycle 
        this.f = 500;
        this.truePeriod = this.f * 50 / 100;
        this.falsePeriod = this.f * (100 - 50) / 100;
        this.lastTick = new Date().getTime();


        const currTick = new Date().getTime();

        const period = (this.value) ? this.truePeriod : this.falsePeriod;
        if (currTick - this.lastTick > period) {
            this.toggle();
            this.lastTick = currTick;
        }

        this.nodes[0].setValue(this.value);



*/