export const script = function (p5) {    
    let noiseStart, noiseStart2, noiseStart3;
    let wave;
    let increment;

    // NOTE: Set up is here   
    p5.setup = _ => {      
        p5.createCanvas(p5.divWidth, p5.divHeight);      
        p5.noFill();
        p5.stroke(243,229,156);  
        p5.strokeWeight(2);
        p5.randomSeed(p5.seed);
        noiseStart = p5.random();
        noiseStart2 = p5.random();
        noiseStart3 = p5.random();

        wave = {
            y: p5.height / 2,
            length: p5.random() * 0.02 + -0.09,
            amplitude: p5.height / 4,
            frequency: 0.1
        };
        increment = wave.frequency;
    }   

    // NOTE: Draw is here
    p5.draw = _ => {   
        p5.clear();   
        //p5.background(0);
        renderWave();   
    }  
    p5.windowResized = _ => {
        p5.resizeCanvas(p5.divWidth, p5.divHeight);
        if (wave) {
            wave.y = p5.height/2;
            wave.amplitude = p5.height/4;
        }
    }

    function renderWave() {
        for (let i = 0; i < p5.width; i++) {
            p5.line(i, getY(i, increment),
                i+1, getY(i+1, increment)
            );
        }

        if (p5.playing)
            increment += wave.frequency;
    }

    function getY(i, increment) {
        return wave.y +
        Math.sin(i * wave.length + increment + p5.noise(i*0.01 + noiseStart)*5) * wave.amplitude * Math.sin(noiseStart*100 + i * 0.01 + increment/2 + p5.noise(i*0.02 + noiseStart2)) * (p5.noise(i*0.01 + noiseStart3) * 0.7 + 0.3);
    }
}  