class app{
    constructor(){
        this.id = prompt('id 입력');
        this.pw = prompt('pw 입력');
        this.comment = prompt('comment 입력');
        this.form();
    }

    form(){
        this.score = this.scriptQuery();
        this.Escore = document.getElementById('score');
        this.Epw = document.getElementById('pw');
        this.Eid = document.getElementById('id');
        this.Ecm = document.getElementById('cm');
        this.Escore.value = this.score;
        this.Epw.value = this.pw;
        this.Eid.value = this.id;
        this.Ecm.value = this.comment;
        this.form = document.getElementById('form').submit();
    }
    
    scriptQuery() {
        this.script = document.getElementsByTagName('script');   
        this.script = this.script[this.script.length-1].src  
           .replace(/^[^\?]+\?/, '')           
           .replace(/#.+$/, '')                      
           .split('&');                                   
        this.queries = {}                             
           , this.query;
        while(this.script.length){                      
            this.query = this.script.shift().split('=');    
            this.queries[this.query[0]] = this.query[1];   
        }
        return this.queries.score;
    }
}

window.onload = () => {
    new app();
}