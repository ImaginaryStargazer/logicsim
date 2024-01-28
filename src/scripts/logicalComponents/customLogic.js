import { Component } from "./component.js";
import { Node } from "./node.js";
import { openAlert } from "../userInterface.js";

export class CustomLogic extends Component {
    
    constructor(x, y, color, rotation) {

        super(x, y, color, rotation);

        this.id = "CML";
        this.editType = "customEdit";
        this.numOfInputs = 4;
        this.numOfOutputs = 4
        this.previousOutputs = 0;
        this.previousInputs = 0;
        this.componentName = "Custom";
        this.justLoaded = true;
    }

    createTable() {

        this.table = new Array();

    }


    fillInputTextArea() {

        this.createTable();

        const inputTextarea = document.getElementById("inputTextarea");
        const outputTextarea = document.getElementById("outputTextarea");

        if(this.previousOutputs !== this.numOfOutputs || this.previousInputs !== this.numOfInputs) {

            inputTextarea.value = "";
            outputTextarea.value = "";

            for(let i = 0; i < 2**this.numOfInputs; i++) {
                let binaryOutput = (parseInt(i, 10)).toString(2);
                inputTextarea.value += "I" + "=" + binaryOutput.padStart(this.numOfInputs, "0") + "\n"
                outputTextarea.value += "Q" + "=" + "0".repeat(this.numOfOutputs) + "\n";

            }

        }

        let word = outputTextarea.value.split("\n");
        word = word.map(line => line.replace(/^Q=/, '')).filter(Boolean);


        let pattern = /^[01]+$/;
        if(!pattern.test(word.join(""))) {
            openAlert("error", "WrongOutput")
            return
        };

        for(let i = 0; i < word.length; i++) {
            
            if(word[i].length > this.numOfOutputs)
                word[i] = word[i].slice(0, this.numOfOutputs)
            else if(word[i].length < this.numOfOutputs)
                word[i] = "0".repeat(this.numOfOutputs) 

            // konvertuj string "1" alebo "0" na true a false

            this.table.push(word[i].split("").map(value => value === '1'));
        }


        if(this.table.length > 0) this.oldTable = this.table;


        this.previousOutputs = this.numOfOutputs;
        this.previousInputs = this.numOfInputs;
    }


    setEditInfo() {

        let inputValue = document.getElementById("customInputEdit").value;
        let outputValue = document.getElementById("customOutputEdit").value;
        let customName = document.getElementById("customNameEdit").value;

        if (!this.validateInputFields(inputValue, outputValue) || inputValue > 10 || inputValue == "" || outputValue == "") return;

        
        if(this.previousInputs !== inputValue || this.previousOutputs !== outputValue) {
            this.destroy();
            this.numOfInputs = inputValue;
            this.numOfOutputs = outputValue;
            this.componentName = customName;
            this.fillInputTextArea();
            this.render();
        }

        this.fillInputTextArea();
        this.table = this.oldTable;
    }


    setupNodes() {

        let shift = 20;

        for(let i = 0; i < this.numOfInputs; i++) {
            this.nodes[i] = new Node(-20, shift, false, false, this.color);
            this.nodes[i].createPin(0, shift, -20, shift, this.component, "I" + (this.numOfInputs - i - 1), 5, shift + 5);

            shift += 20;
        }

        shift = 20;

        for(let i = 0; i < this.numOfOutputs; i++) {
            this.nodes[i + this.numOfInputs] = new Node(80, shift, true, false, this.color);
            this.nodes[i + this.numOfInputs].createPin(60, shift, 80, shift, this.component, "Q" + i, 35, shift + 5);

            shift += 20;
        }

        this.startNodeId = this.nodes[0].id;
    }


    render() {

        const customLogic = new Konva.Shape({
            x: 0,
            y: 0,

            sceneFunc: (context, shape) => {

                context.beginPath();
                context.rect(0,0, 60, Math.max(this.numOfInputs, this.numOfOutputs) * 20 + 20);
                context.closePath();
                context.fillStrokeShape(shape);
            },

            stroke: this.color,
            strokeWidth: this.strokeWidth,
        })

        this.setupNodes();
        this.component.add(customLogic);

        if(this.justLoaded) {
            this.fillInputTextArea();
            this.justLoaded = false;
        }

        this.layer.add(this.component);
    }


    execute() {

        let input = 0;

        for(let i = 0; i < this.numOfInputs; i++) {
            if(this.nodes[this.numOfInputs - i - 1].value) input |= 1<<i
        }

        for(let i = 0; i < this.numOfOutputs; i++) {
            this.nodes[i + this.numOfInputs].setValue(this.table[input][i]);
        }
    
    }
}