export class ResponseModel {
    
    public name :string;
    public version :string;
    public error :string;
    
    constructor(version:string, name:string, error:string){
        this.name = name;
        this.version = version; 
        this.error = error;
    }
}