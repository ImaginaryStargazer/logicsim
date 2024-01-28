import { Node } from "./node.js";
import { Component } from "./component.js";

export class ClockCounter extends Component{
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "CLC";
        this.editType = "clockCountEdit";

        this.lastClock = false;
        this.clockCount = 4;
        this.currentClockCount = 0;
        
    }

    setEditInfo() {

        let inputValue = document.getElementById("clockCountEdit").value;

        if (!this.validateInputFields(inputValue) || inputValue == "") return;

        this.clockCount = Number(inputValue);

    }


    setupNodes() {


        this.nodes[0] = new Node(-20, 20, false, false, this.color, "CLK");
        this.nodes[0].createPin(0, 20, -20, 20, this.component, "CLK", 5, 25);

        this.nodes[1] = new Node(-20, 40, false, false, this.color, "R");
        this.nodes[1].createPin(0, 40, -20, 40, this.component, "R", 5, 45);

        this.nodes[2] = new Node(-20, 60, false, false, this.color, "CE");
        this.nodes[2].createPin(0, 60, -20, 60, this.component, "CE", 5, 65);

        this.nodes[3] = new Node(80, 40, true, false, this.color, "Q");
        this.nodes[3].createPin(60, 40, 80, 40, this.component, "Q", 45, 45);


        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const clockCounter = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();
                context.rect(0, 0, 60, 80);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        this.setupNodes();
        this.component.add(clockCounter);
        this.layer.add(this.component);
    }


    execute() {

        let running = true;


        if(this.nodes[2].value) {
            running = false;
        }

        if(this.nodes[1].value) {
            this.currentClockCount = 0;
        }

        if(this.nodes[0].value && !this.lastClock && running) {

            this.currentClockCount++;

            if(this.currentClockCount == this.clockCount) {

                this.nodes[3].value = true;
                this.currentClockCount = 0;
                
            } else {
                this.nodes[3].value = false;
            }
        
        }


        this.lastClock = this.nodes[0].value

    }

}