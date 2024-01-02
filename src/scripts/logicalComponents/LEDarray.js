import { Node } from "./node.js";
import { Component } from "./component.js";


export class LEDarray extends Component {
    constructor(x, y, color, rotation) {
        super(x, y, color, rotation);

        this.id = "LDA";
        this.editType = "ledArrEdit";
        this.LED = [];
        this.numOfRows = 4;
        this.numOfCols = 4;
        this.ledColor = "red";
    }

    setEditInfo() {

        let colorValue = document.getElementById("ledArrColor").value;
        let rowsValue = document.getElementById("rows").value;
        let colsValue = document.getElementById("cols").value;

        this.ledColor = colorValue;
        this.fillLED(this.ledColor);


        if (!this.validateInputFields(rowsValue, colsValue)  || rowsValue == ""  || colsValue == "") return;


        if(rowsValue !== this.numOfRows || colsValue !== this.numOfRows) {
            this.destroy();
            this.LED = [];
    
            this.numOfRows = Number(rowsValue);
            this.numOfCols = Number(colsValue);
            this.render();
        }

    }

    fillLED(color) {
        for(let i = 0; i < this.LED.length; i++) {
            this.LED[i].LED.setAttr("fill", color);
        }
    }


    setupNodes() {

        let shift = 20;


        for(let row = 0; row < this.numOfRows; row++) {
            
            this.nodes[row] = new Node(-20, shift, false, false, this.color, "ROW" + row);
            this.nodes[row].createPin(0, shift, -20, shift, this.component);

            shift +=20;
        }

        shift = 20;

        for(let col = 0; col < this.numOfCols; col++) {
            this.nodes[col + this.numOfRows] = new Node(shift, this.numOfRows * 20 + 40, false, false, this.color, "COL" + col);
            this.nodes[col + this.numOfRows].createPin(shift, this.numOfRows * 20 + 20, shift, this.numOfRows * 20 + 40, this.component);

            shift +=20;
        }


        this.startNodeId = this.nodes[0].id;

    }


    render() {

        const LEDarray = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {
                context.beginPath();

                context.rect(0, 0, this.numOfCols * 20 + 20 , this.numOfRows * 20 + 20);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth
        })

        let shiftX, shiftY = 0;


        for (let i = 0; i < this.numOfRows; i++) {

            shiftX = 0;
            shiftY += 20;

            for (let j = 0; j < this.numOfCols; j++) {

                shiftX += 20;

                const newLED = new LED(shiftX, shiftY);
                this.LED.push(newLED);

                this.component.add(newLED.render());

                
            }

        }

        this.fillLED(this.ledColor);

        this.setupNodes();
        this.component.add(LEDarray);

        this.layer.add(this.component)
        


    }

    // pls dont judge me for this

    draw() {
        
        for (let i = 0; i < this.numOfRows; i++) {
            
            if (this.nodes[i].value) {

                for (let row = 0; row < this.numOfCols; row++) {
                    this.LED[i * this.numOfCols + row].turnOn();
                }

            } else {
                for (let row = 0; row < this.numOfCols; row++) {
                    this.LED[i * this.numOfCols + row].turnOff(0.001);
                }
            }
        }

        for (let i = this.numOfRows; i < this.numOfRows + this.numOfCols; i++) {
            
            if (this.nodes[i].value) {
                for (let col = 0; col < this.numOfRows; col++) {
                    this.LED[col * this.numOfCols + (i - this.numOfRows)].turnOff(0.099);
                }
            }
        }

            
    }
    
}


class LED{
    constructor(x, y) {

        this.LED = new Konva.Circle({
            x: x,
            y: y,
            fill: "red",
            radius: 8,
            strokeEnabled: false,
            opacity: 0.1,
        })

        this.w = 0.1;
    }

    render() {

        return this.LED;
    }

    turnOn() {

        this.w = Math.min(1, this.w + 0.098);

        this.LED.setAttrs({
            opacity: this.w
        });

        
    }

    turnOff(timeout) {

        this.w = Math.max(0.1, this.w - timeout);

        this.LED.setAttrs({
            opacity: this.w
        });
        
    }


}
