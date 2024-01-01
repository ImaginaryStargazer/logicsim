export class Timer {
    constructor(width, height, x, y, time, timestep) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.time = time;
        this.timestep = timestep;

        this.elementTimer = new Konva.Group({
            x: x,
            y: y,
            width: width,
            height: height,
            listening: false,
            
        })

        this.clock = new Konva.Text({
            text: `t = ${this.time} ms`,
            x: 10,
            y: 10,
            fontSize: 15,
            fontFamily: 'Arial',
            fill: 'white',
        })
    }


    renderTimer(layer) {

        const rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.elementTimer.width(),
            height: this.elementTimer.height(),
            fill: "black",
            stroke: "#0a0101",
            id: "back"
        });

        const timestepText = new Konva.Text({
            text: `ts = ${this.timestep} s`,
            x: 10,
            y: 40,
            fontSize: 15,
            fontFamily: 'Arial',
            fill: 'white',
        })

        this.elementTimer.add(rect, this.clock, timestepText);


        layer.add(this.elementTimer)
    }


    setStaticPosition(editorScale, xAxis, yAxis) {

        
        this.elementTimer.scale({x: 1 / editorScale, y: 1 / editorScale});

        this.elementTimer.position({
            x: xAxis + this.x / editorScale,
            y: yAxis + this.y / editorScale
        });
    }



    resetTimer() {

        this.time = 0;
        this.clock.text(`t = ${this.time} ms`);

    }



}