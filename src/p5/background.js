export const script = function (p5) {    
    var speed = 2;    
    var posX = 0;
    
    // NOTE: Set up is here   
    p5.setup = _ => {      
        p5.createCanvas(p5.divWidth, p5.divHeight);      
        p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);    
    }     
    // NOTE: Draw is here
    p5.draw = _ => {      
        p5.clear();
    }  
    p5.windowResized = _ => {
        p5.resizeCanvas(p5.divWidth, p5.divHeight);
    }
}  