export const ModalType = `
declare const modal:{
    open:(id:string,data?:any)=>void; 
    close:(id:string)=>void; 
    getData:(id:string)=>any
}`;
