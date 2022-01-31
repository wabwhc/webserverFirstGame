import  monster  from "./monster.js";
import player from "./player.js";

class app{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.mons = [];
        this.moncount = 0;
        this.player = new player(this.width, this.height, this.ctx);
        this.mons[0] = new monster(this.width, this.height, this.ctx);
        this.turn = 0;
        this.score = 0;
        document.body.addEventListener('mousemove', (e) => {
            this.player.Hx = e.clientX;
            this.player.Hy = e.clientY;
        })
        
        document.body.addEventListener('touchmove', (e) => {
            this.player.Hx = e.changedTouches[0].clientX;
            this.player.Hy = e.changedTouches[0].clientY;
        });
        
        this.monDirX;
        this.monDirY;
        this.draw();
    }

    draw(){
        if(this.turn === 30){
            this.moncount += 1;
            this.mons[this.moncount] = new monster(this.width, this.height, this.ctx);
            this.player.mine();
            this.play();
            this.turn = 0;
        }else{
            this.play();
            this.turn += 1;
        }
        this.crash();
        if(this.player.Hlife > 0){
            requestAnimationFrame(this.draw.bind(this));
        }else{
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.monDirX = this.player.Hx;
            this.monDirY = this.player.Hy;
            this.player.draw();
            for(let i = 0; i <= this.moncount; i++){
                this.mons[i].draw(this.monDirX, this.monDirY);
            }
            //점수를 get을 이용해 rank로 보냄
            const score = document.getElementById('score');
            score.value = this.score;
            const form = document.getElementById('form').submit();
        }
    }

    play(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.monDirX = this.player.Hx;
        this.monDirY = this.player.Hy;
        this.player.draw();
        for(let i = 0; i <= this.moncount; i++){
            this.mons[i].draw(this.monDirX, this.monDirY);
        }
        this.ctx.font = '40px serif';
        this.ctx.fillText(this.score, this.width / 2, this.height - 40);
    }

    crash(){
        for(let i = 0; i <= this.moncount; i++){
            this.distance = Math.sqrt((this.mons[i].MPositionX - this.player.Hx) ** 2 + (this.mons[i].MPositionY - this.player.Hy) ** 2);
            if(this.distance <= 50 && this.mons[i].Mlive === true){
                this.player.damaged(this.mons[i].Mpower);
                this.mons[i].Mlive = false;
            }
        }
        for(let i = 0; i < this.player.mines.length; i++){
            for(let j = 0; j <= this.moncount; j++){
                this.distance = Math.sqrt((this.player.mines[i].Hx - this.mons[j].MPositionX) ** 2 + (this.player.mines[i].Hy - this.mons[j].MPositionY) ** 2)
                if(this.distance <= 30 && this.mons[j].Mlive === true && this.player.mines[i].MineLive === true){
                    this.mons[j].Mlive = false;
                    this.player.mines[i].MineLive = false;
                    this.score += 10;
                }
            }
        }
    }

}

window.onload = () => {
    new app();
}