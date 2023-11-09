import { mainEditor } from "../circuitEditor.js";
import { INPUT_STATE } from "./states.js";

export let nodeList = [];
let currentId = 0;

export class Node {
    constructor(posX, posY, isOutput = false, value = false, color) {
        this.value = value;
        this.posX = posX;
        this.posY = posY;
        this.isOutput = isOutput;
        this.radius = 5;
        this.color = color;

        this.isAlive = true;
        this.inputState = INPUT_STATE.FREE;

        this.node = new Konva.Circle({
            x: posX,
            y: posY,
            radius: this.radius,
            stroke: "grey",
            fill: "#343a40",
            hitStrokeWidth: 10,
            name: "node",
        })

        this.mainEditor = mainEditor;

        this.node.on("mouseover", () => this.mouseOver());
        this.node.on("mouseout", () => this.mouseOut())
        this.node.setAttr('Node', this);

        this.id = currentId;
        currentId++;

        nodeList[this.id] = this;

    }

    getPosition() {
        return {
            posX: this.calculatePositionToScale(this.node.getAbsolutePosition().x).xAxis,
            posY: this.calculatePositionToScale(this.node.getAbsolutePosition().y).yAxis,
        }
    }



    draw() {

        return this.node;
    }

    mouseOver() {

        this.node.setAttrs({
            stroke: "grey",
            strokeWidth: 4,
            radius: 8,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 0 },
            shadowOpacity: 0.6,
        })

        return true;

    }

    mouseOut() {

        this.node.setAttrs({
            strokeWidth: 2,
            stroke: "grey",
            shadowOpacity: 0,
            radius: this.radius,
        })

    }

    setValue(value) {

        this.value = value;
    }


    setInputState(state) {

        this.inputState = state;
    } 


    getValue() {

        return this.value;
    }


    calculatePositionToScale(variable) {

        return {
            xAxis: variable / this.mainEditor.scaleX() - this.mainEditor.x() / this.mainEditor.scaleX(),
            yAxis: variable / this.mainEditor.scaleY() - this.mainEditor.y() / this.mainEditor.scaleY(),
        };
    }



}