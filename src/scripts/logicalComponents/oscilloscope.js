export let nodeValues = [];

export class Oscilloscope{
    constructor(width, height, x, y,) {

        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.oscilloscope = new Konva.Group({
            x: x,
            y: y,
            width: width,
            height: height,
            //listening: false,
            visible: true
            
        })

        this.maxLength = this.oscilloscope.width();

        //this.oscilloscope.on("mouseover", () => {this.oscilloscope.getChildren()[0].fill("#333333")});
        //this.oscilloscope.on("mouseout", () => {this.oscilloscope.getChildren()[0].fill("black")});
        this.oscilloscope.on("contextmenu", () => {this.onContextMenu()});

        this.running = false;
        this.channels = [];
        this.nodeValues = nodeValues; // Odtialto načítavame hodnoty zo svoriek

    }


    renderOscilloscope(layer) {

        // Vytvor signály

        let signalOne = new Konva.Line({
            x: 0,
            y: 20,
            points: [],
            stroke: "#FFFFE0",
            strokeWidth: 1,
        });


        let signalTwo = new Konva.Line({
            x: 0,
            y: 50,
            points: [],
            stroke: "#ADD8E6",
            strokeWidth: 1,
        });
        
        let signalThree = new Konva.Line({
            x: 0,
            y: 80,
            points: [],
            stroke: "#FCD299",
            strokeWidth: 1,
        });




        this.channels.push(signalOne, signalTwo, signalThree);


        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.oscilloscope.width(),
            height: this.oscilloscope.height(),
            fill: "black",
            stroke: "#0a0101",
        });

        const text = new Konva.Text({
            x: -45,
            y: 10,
            fontSize: 15,
            fontFamily: "calibri",
            fill: "white",
            text: "CH1\n\nCH2\n\nCH3",
        })


        // Vytvor grid v osciloskope

        let gridGroup = new Konva.Group();

        let gridSize = 25;
        let gridColor = "grey";
        let gridOpacity = 0.3;

        for (let x = 0; x <= this.oscilloscope.width(); x += gridSize) {
        let verticalLine = new Konva.Line({
            points: [x, 0, x, this.oscilloscope.height()],
            stroke: gridColor,
            strokeWidth: 1,
            opacity: gridOpacity,
        });

        gridGroup.add(verticalLine);

        }
        

        this.oscilloscope.add(background, text ,signalOne, signalTwo, signalThree);

        layer.add(this.oscilloscope);
    }
    

    draw() {
        

        for (let i = 0; i < this.channels.length; i++) {
            if (this.nodeValues[i] === undefined) continue;
        
            let isRisingEdge = this.nodeValues[i].value;
            let amplitude = this.nodeValues[i].amplitude;
        
            let y = isRisingEdge ? -amplitude : amplitude;
        
            let oldPoints = this.channels[i].points();
            let lastX = oldPoints.length > 1 ? oldPoints[oldPoints.length - 2] : 0;
            let newPoints = oldPoints.concat([lastX + 1, y]);
        
            this.channels[i].points(newPoints);
        
            if (this.channels[i].points().length > this.maxLength * 2) {
                    this.channels[i].points().length = 0;
            }
        }

    }


    resetOscilloscope() {
        
        for(let i = 0; i < this.channels.length; i++) {

            this.channels[i].points().length = 0;
        }
    }


    setStaticPosition(editorScale, xAxis, yAxis) {

        this.oscilloscope.scale({x: 1 / editorScale, y: 1 / editorScale});

        this.oscilloscope.position({
            x: xAxis + this.x / editorScale,
            y: yAxis + this.y / editorScale
        });
    }


    onContextMenu() {
        
        oscilloscopeEditBox.style.display  = "block";


        document.getElementById("applyScope").onclick = () => {

            if(this.nodeValues[chooseChannel.value] === undefined) return;

            if(removeSignal.checked) {
                delete this.nodeValues[chooseChannel.value];
                this.channels[chooseChannel.value].points().length = 0;
                return;
            }


            this.channels[chooseChannel.value].stroke(signalColor.value);
            this.nodeValues[chooseChannel.value].amplitude = Number(inputAmp.value);
            

        }

        document.getElementById("okScope").onclick = () => {

            oscilloscopeEditBox.style.display  = "none";
        }


    }
}