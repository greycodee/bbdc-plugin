class Set{
    constructor(){
        this.items={}
    }

    has(val){
        // return val in this.items;  
        return this.items.hasOwnProperty(val)
    }
    
    add(val){
        if(!this.has(val)){
            this.items[val]=val;
        }
    }

    remove(val){
        if(this.has(val)){
            delete this.items[val];
        }
    }

    clear(){
        this.items = {};
    }

    size(){

        return Object.keys(this.items).length;
    }

    values(){
        let arr=[];
        Object.keys(this.items).forEach(item=>{
            arr.push(this.items[item]);
        })
        return arr;
    }
}
