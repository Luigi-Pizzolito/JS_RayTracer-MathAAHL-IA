import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { createCanvas, loadImage } = require('canvas')
const ProgressBar = require('progress')
const fs = require('fs')



export class ImgDrawer {
    constructor(height, width) {
        this.canvas = createCanvas(width, height)
        this.ctx = this.canvas.getContext('2d')
        this.ctx.clearRect(0, 0, width, height)
        this.img = this.ctx.getImageData(0, 0, width, height);

        //start progress tracking
        this.bar = new ProgressBar(
            'ETA::etas :bar :percent took :elapseds',
            { total: height, width: 80 },
        )
    }

    // function for setting pixels
    setPixel(x, y, colour) {
        var index = 4 * (x + y * this.img.width);
        this.img.data[index + 0] = colour.x;
        this.img.data[index + 1] = colour.y;
        this.img.data[index + 2] = colour.z;
        this.img.data[index + 3] = 255; //alpha channel
    }

    //function for writing to file
    writefile(file) {
        this.ctx.putImageData(this.img, 0, 0);
        let buffer = this.canvas.toBuffer('image/png')
        fs.writeFileSync(file, buffer)
        console.log("Complete! Saved to "+file)
    }
}