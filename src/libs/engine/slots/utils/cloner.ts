export class Cloner {

    static CloneGrid( target :number[][] ) :number[][] {
        let grid :number[][] = JSON.parse( JSON.stringify( target) ) ;
        return grid;
    }
    
    static CloneObject( target :any ) : any {
        return JSON.parse( JSON.stringify( target) ) ;
    }

}