
var dots = [],waves = [],grd,ctx,canvas, no = 10;
var floatingDots = [], splashedDots = [], storyDots = [],description = ['school','achievements','projects'];

window.onload = function(){
    setMargin()
    var font = new FontFace('has','url(\'robotoMed.ttf\')');
    makeAnim();
    clickOnColor();
    // document.getElementById('stop').addEventListener('click',function(){
    //     clearInterval(interval);
    // })

    // document.getElementById('start').addEventListener('click',function(){
    //     interval = setInterval(function(){
    //         alltogether();
    //     },1000/30);
    // })

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    canvas.onclick = function(event){
        var mouse_x = event.pageX, mouse_y = event.pageY;
        checkSplash(mouse_x,mouse_y);
        checkOpen(mouse_x,mouse_y);
    }

    ///// ARRAY FUNCTIONS ///
    dots.generate = function(amount){
        for ( var x = 0; x < amount; x++ ){
            var dot_x = Math.floor(Math.random()*canvas.width);
            var dot_y = Math.floor(Math.random()*300);
            var dot_r = Math.floor(Math.random()*5);
            this.push(new dot(dot_x,dot_y,dot_r));
        }
    }

    floatingDots.generate = function (amount){
        for ( var x = 0; x < amount; x++){
            var float_y = Math.floor(Math.random()*canvas.height*0.75-100);
            var dot_x = Math.floor(Math.random()*canvas.width);
            this.push(new floatingDot(dot_x,float_y,10));
        }
    }

    floatingDots.chechNumbers = function(amount){
        if ( this.length < amount ){
            for ( var x = 0; x < amount-this.length; x++){
                var dot_x = Math.floor(Math.random()*canvas.width);
                this.push(new floatingDot(dot_x,-10,10));
            }
        }
    }

    splashedDots.coords = function(){
        for ( var x = 0; x < this.length; x++ ){
            if ( this[x].y < 0 - this[x].r ){
                this.splice(x,1);
            }
        }
    }

    // floatingDots.checkColision = function(){
    //     for ( var x = 0; x < this.length-1; x++ ){
    //         for ( var y = 0; y < this.length; y++ ){
    //             if ( this[x].distance(this[y]) < 5 ) {
    //                 // console.log('izy');
    //             }
    //         }
    //     }
    // }

    ////////////////////////////////////////////////////////////////////////////////
    // var x = y = 300, speed = 3;
    // var angle = 0;

    // setInterval(function(){
    //     angle += Math.PI/180
    //     ctx.beginPath();
    //     ctx.arc(x,y,10,0,Math.PI*2);
    //     ctx.fill();
    //     x -= Math.cos(angle)*speed;
    //     y -= Math.sin(angle)*speed;
    // },1000/60)

    /////TEST FOR CALCULTING ANGLE AND DRAW ///

    init();

    var interval = setInterval(function(){   ///need to make animationFrame request instead of interval :)
        alltogether();
    },1000/30);


    function alltogether(){
        clear();
        drawBackground();
        for ( var x = 0; x < waves.length; x++){
            waves[x].draw();
        }
        drawDot();  
        // textInMiddle('Miroslav Baláž', '1997')

    }

    function init(){
        makeGradient();
        dots.generate(50);
        floatingDots.generate(10);
        genWaves(0,300,400);
        // generateStoryDots();        
    }

    function generateStoryDots(){
        var width_one = canvas.width*0.75;
        var width = width_one/4 + width_one/9;
        var distance = canvas.height/5;
        var top_pos = true;
        for ( var x = 0; x < description.length; x++ ){     
            if ( top_pos ){
                storyDots.push( new storyDot(x,width, canvas.height*0.9-distance, 30,description[x],true))
            } else {
                storyDots.push( new storyDot(x,width, canvas.height*0.9-distance/2, 30,description[x],false))                
            }
            width += width_one/5;
            top_pos = !top_pos;
        }
    }

    // function textInMiddle(text,year){
    //     ctx.fillStyle = grd;
    //     var height = canvas.height/1.75;
    //     ctx.font = canvas.width/30 + 'px Pacifico';
    //     ctx.globalCompositeOperation = 'source-over';
    //     ctx.fillText(text,canvas.width/2-(ctx.measureText(text).width/2),height);
    //     ctx.font = canvas.width/80 + 'px Pacifico';           
    //     ctx.fillText('since 1997',canvas.width/2-(ctx.measureText(text).width/3),height + 30);
    // }

    function storyDot(id,x,y,r,description,up){
        this.up = up;
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = id;
        this.opened = false;
        this.color = '#AAEAE2';
        this.description = description;
        
        this.draw = function(){
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
            ctx.fill();
        }
        
        this.show = function(){
            if ( this.up ){
                makeLine(this.x,this.y+30,this.x,this.y+50);
                this.opened = true;
            } else { 
                makeLine(this.x,this.y-30,this.x,this.y-50);
                this.opened = true;
            }
        }
        
        this.checkOpen = function(mouse_x,mouse_y){
            var first = Math.pow(mouse_x - this.x,2);
            var sec = Math.pow(mouse_y - this.y,2);
            var distance =  Math.sqrt(first+sec);
            return distance < this.r;
        }
    }

    function checkOpen(mouse_x,mouse_y){
        for ( var x = 0; x < storyDots.length; x++){
            if ( storyDots[x].checkOpen(mouse_x,mouse_y) && !storyDots[x].opened){
                storyDots[x].show();
            } else if (storyDots[x].checkOpen(mouse_x,mouse_y) && storyDots[x].opened ){
                storyDots[x].opened = false;
            }

        }
    }

    function makeLine(x1,y1,x2,y2){
        ctx.globalCompositeOperation = 'source-over';  
        ctx.lineWidth = '1px';
        ctx.strokeStyle = 'rgba(33,55,11,.3)'; 
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
    }


    function dot(x,y,r,join){
        this.timer = Math.random()*500+400;
        this.timer_count = Math.random()*2+1;
        this.x = x;
        this.y = y;
        this.r = r;
        this.Xspeed = Math.random()*0.5;
        this.Yspeed = Math.random()*0.5;
        this.angle = 120;
        this.join = 0;
        this.draw = function(){
            this.timer -= this.timer_count;
            ctx.globalCompositeOperation='source-atop';      
            ctx.fillStye = 'rgba(255,255,255,.7)';
            if ( this.timer < 0 ){
                    this.x = Math.random()*canvas.width;
                    this.y = Math.random()*canvas.height;
                    this.timer = Math.random()*300+400;                
            }                      
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,Math.PI*2);       
            ctx.fill();
        }

        this.movement = function(){
            if ( this.x > canvas.width || this.x < 0 ){
                this.Xspeed *= -1;
            }
            if ( this.y > canvas.height || this.y < 0 ){
                this.Yspeed *= -1;
            }
            this.x += this.Xspeed;
            this.y += this.Yspeed;
        }

        this.connection = function(){
            if ( this.join < 3 ){
                for ( var a = 0; a < dots.length; a++ ){
                    if ( distanceToConnect(this.x,this.y,dots[a].x,dots[a].y) && dots[a].join < 3){
                        this.join++;
                        dots[a].join ++;
                        ctx.globalCompositeOperation='source-atop';                                        
                        ctx.strokeStyle = 'rgba(255,255,255,.1)';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(this.x,this.y);
                        ctx.lineTo(dots[a].x,dots[a].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function distanceToConnect(x1,y1,x2,y2){
        var x_sq = Math.pow(x2-x1,2);
        var y_sq = Math.sqrt(y2-y1,2);
        var distance = Math.sqrt(x_sq+y_sq);
        return distance < 100;
    }

    function drawDot(){
        for ( var x = 0; x < dots.length; x++){
            ctx.fillStyle = '#FFFFFF';
            dots[x].movement();
            dots[x].connection();
            dots[x].draw();
    
        }

        for ( x = 0; x < floatingDots.length; x++ ){
            floatingDots[x].draw();            
        }

        for ( x = 0; x < splashedDots.length; x++ ){
            splashedDots[x].draw();
        }

        // for ( x = 0; x < storyDots.length; x++){
        //     storyDots[x].draw();
        //     if ( storyDots[x].opened ){
        //         storyDots[x].show();
        //     }
        // }
        splashedDots.coords();
        floatingDots.chechNumbers(no);
    }


    function wave(x1,y1,x2,y2,up,id){
        this.id = id;
        this.x_begin = x1;
        this.y_begin = y1;
        this.x_end = x2;
        this.y_end = y2;
        this.y_top = 50;     
        // this.speed = Math.floor(Math.random()*4+1);
        this.x_curve = (this.x_begin+this.x_end)/2;
        this.y_curve = 30; 
        this.up = up;
        if (this.up){
            this.speed = -1;
        } else { 
            this.speed = -1;
        }
        this.displayStyle = 'source-over' // default        
        this.over = !this.up;

        this.move = function(){
            var border = this.y_top*2;
            var border2 = border;
            border2 *= -1;
            if ( this.y_curve == 0 ){
                this.over = !this.over;
            }
            if ( this.y_curve == border || this.y_curve == border2){
                this.speed *= -1;
            }
            this.y_curve += this.speed;
        }

        this.draw = function(){
            this.move();
            if ( this.over ) {
                ctx.globalCompositeOperation='destination-out';   
            } else { 
                ctx.globalCompositeOperation='source-over';                       
            }  
            ctx.beginPath();
            ctx.moveTo(this.x_begin,this.y_begin);
            if ( this.up ){
                ctx.quadraticCurveTo(this.x_curve,this.y_begin + this.y_curve,this.x_end,this.y_end);            
            } else {
                ctx.quadraticCurveTo(this.x_curve,this.y_begin - this.y_curve,this.x_end,this.y_end);                
            }
            ctx.fill();
        }
    }

    function floatingDot(x,y,r){
        this.slower = false;
        this.temp_speed = 0;
        this.temp_x = 0;
        this.temp_y = 0;
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = Math.random()*0.3+0.3;
        this.velocity = this.speed * this.r/4;
        this.speed += this.velocity;
        this.grow_speed = Math.random()*0.03+0.01;

        this.calc_angle = function(dot){
            var x,y = 0, angle = 0;
            if ( this.x > dot.x ){
                x = this.x - dot.x;
            } else { 
                x = dot.x - this.x;
            }

            if ( this.y > dot.y ){
                y = this.y - dot.y;
            } else { 
                y = dot.y - this.y;
            }

            angle = Math.atan(x/y);
            
        }
        
        this.move = function(){
            // var collison = false;
            // var speedo = this.speed;
            // var angle = Math.PI/360;
            // var collison_dot;

            // for ( var x = 0; x < floatingDots.length; x++){
            //     if ( this.distance(floatingDots[x]) <= this.r + floatingDots[x].r && floatingDots.indexOf(this) != x ){
            //         collison = true;
                    
            //         if ( this.speed < floatingDots[x].speed ) {
            //             this.slower = true;
            //             this.temp_speed = this.speed;
            //         } else { 
            //             this.slower = false;
            //             this.temp_speed = floatingDots[x].speed;
            //         }

            //         collison_dot = floatingDots[x];                    
            //         break;
            //     }
            // }

            if ( this.y < 0-this.r ){

                ///////Little bubbles generate in the story dots/////
                // var no = Math.floor(Math.random()*storyDots.length)
                // var radius = storyDots[no].r * (-1);
                // this.y = storyDots[no].y;
                // this.x = storyDots[no].x;
                // this.x += Math.random()*radius + storyDots[no].r;
                // this.r = 1;

                this.y = canvas.height;
                this.x = Math.random()*canvas.width;
                this.r = 1;
            }

            // if ( collison ) {
            //     if ( this.slower) {
            //         this.speed = collison_dot.speed;
            //     } else { 
            //         this.speed = speedo;
            //     }
            // }

            this.y -= this.speed;
            this.r += this.grow_speed;


            // for ( var x = 0; x < floatingDots.length; x++){
            //     if ( this.checkColision(floatingDots[x]) < 10 ){

            //     }
            // }
            // if ( !collison ){
            //     this.slower = false;
            //     this.y -= this.speed;
            //     this.r += this.grow_speed;
            //     // if ( this.slower ) {
            //     //     this.y -= this.speed;
            //     //     // this.r += this.grow_speed;
            //     // } else { 
            //     //     this.y -= this.speed;                    
            //     //     this.r += this.grow_speed;
            //     // }
            // } else {
            //     if ( !this.slower ) {
            //         if ( position == 'left' ){
            //             this.x -= Math.cos(angle)*this.temp_speed + 1;
            //             this.y -= Math.sin(angle)*this.temp_speed + 1;
            //         } else if ( position == 'right' ){
            //             this.x += Math.cos(angle)*this.temp_speed + 1;
            //             this.y -= Math.sin(angle)*this.temp_speed + 1;
            //         } else if ( position == 'middle' ){
            //             this.y -= this.temp_speed;
            //         }
            //     } else { 
            //         this.y -= this.speed;
            //     }
            // }
        
        }

        this.draw = function(){
            this.move();
            ctx.globalCompositeOperation = 'xor';
            // ctx.fillStyle = '#000000';
            ctx.fillStyle = grd                
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
            ctx.fill();
        }

        this.splash = function(){
            var new_r = this.r/2;
            splashedDots.push(new floatingDot(this.x-new_r/2,this.y-new_r,Math.random()*new_r+2))
            splashedDots.push(new floatingDot(this.x+new_r/2,this.y-new_r,Math.random()*new_r+1))
            splashedDots.push(new floatingDot(this.x+new_r/2,this.y+new_r,Math.random()*new_r+1))
            splashedDots.push(new floatingDot(this.x-new_r/2,this.y+new_r,Math.random()*new_r+1))            
        }

        this.distance = function(dot){
            var first = Math.pow(dot.x - this.x,2);
            var sec = Math.pow(dot.y - this.y,2);
            return Math.sqrt(first+sec);
        }
    }

        
    function genWaves(x_entry,y_entry,wave_length){
        var x_end;
        for ( var x = 0; x < canvas.width/wave_length; x ++){
            // if ( x_entry + wave_length > canvas.width ) {
                // x_end += canvas.width - x_entry;
            // } else {
                // x_end = x_entry + wave_length;
            // }
            x_end = x_entry + wave_length;
            
            if ( x % 2 == 0){
                waves.push(new wave(x_entry,y_entry,x_end,y_entry,false,x));
            } else {
                waves.push(new wave(x_entry,y_entry,x_end,y_entry,true,x));  
            }
            
            x_entry += wave_length;
        }
    }

    function makeGradient(){
            grd = ctx.createLinearGradient(30.000, 0.000, 270.000, 300.000);
            grd.addColorStop(0.190, 'rgba(148, 86, 145, 1.000)');
            grd.addColorStop(1.000, 'rgba(67, 158, 146, 1.000)');
    }

    function drawBackground(){
        ctx.globalCompositeOperation='source-over';             
        ctx.beginPath();
        ctx.moveTo(0,300);
        ctx.lineTo(0,0);
        ctx.lineTo(canvas.width,0);
        ctx.lineTo(canvas.width,300);         
        ctx.fillStyle= grd;
        ctx.fill(); 
    };

    function clear(){
        // floatingDots.checkColision();
        ctx.globalCompositeOperation='source-over';                                
        ctx.beginPath();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fill();
        for ( var x = 0; x < dots.length; x++){
            dots[x].join = 0;
        }
    }

    function checkSplash(coords_x,coords_y){
        for( var x = 0; x < floatingDots.length; x++){
            var dot = floatingDots[x];
            if ( dot.x + dot.r >= coords_x && dot.x - dot.r <= coords_x ){
                if (dot.y + dot.r >= coords_y && dot.y - dot.r <= coords_y  ){
                    if ( dot.r > 5 ){
                        floatingDots.splice(x,1);
                        dot.splash();
                    }
                }
            }
        }
    }

}