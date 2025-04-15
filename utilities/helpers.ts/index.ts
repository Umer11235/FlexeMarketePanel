

export const getTypeLabel=(type:number, customMapping:Record<number,string>):string=>{

return customMapping[type]||"unknown"

}