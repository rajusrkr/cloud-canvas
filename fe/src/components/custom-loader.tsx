export default function CustomLoader({width, height}: {width: number, height: number}){
    return(
        <div className="flex space-x-2">
            <div className={`w-${width} h-${height} dark:bg-default bg-black rounded-full animate-bounce`} style={{animationDelay: "0s"}}></div>
            <div className={`w-${width} h-${height} dark:bg-default bg-black rounded-full animate-bounce`} style={{animationDelay: "0.4s"}}></div>
            <div className={`w-${width} h-${height} dark:bg-default bg-black rounded-full animate-bounce`} style={{animationDelay: ".2s"}}></div>
        </div>
    )
}