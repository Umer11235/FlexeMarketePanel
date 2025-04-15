
interface Ipopup{
    isOpen:boolean;
    setIsOpen:(isopen:boolean)=>void;
    title:string;
    onCancel?:()=>void;
    onConfirm?:()=>void;
    cancelText:string;
    confirmText:string;

}


const Popup:React.FC<Ipopup>=(
    {
        isOpen,
        setIsOpen,
        title,
        onCancel,
        onConfirm,
        cancelText,
        confirmText
    }
)=>{

    if(!isOpen) return null;
    return(<>
    {/* <div className="flex p-3 absolute  w-[100%] top-0 left-0  z-10 items-center justify-between rounded-sm  bg-red-800 bg-opacity-80"> */}
    <div className="flex p-3 fixed w-full top-0 left-0 z-50 items-center justify-between rounded-sm bg-red-800 bg-opacity-80">
    <p className="text-gray-100 font-semibold">{title}</p>
        <div className="flex items-center justify-between gap-3">

        <button className="bg-green-600 p-2 rounded-sm text-gray-50" onClick={()=>{onCancel&& onCancel(); setIsOpen(false); } } >{cancelText}</button>
        <button className="bg-red-600 p-2 rounded-sm text-gray-50" onClick={()=>{onConfirm&& onConfirm(); setIsOpen(false)}}>{confirmText}</button>
        </div>
    </div>
    </>)

}

export default Popup;