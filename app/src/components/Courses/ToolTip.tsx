// Icon from: https://materialdesignicons.com/

import useSWR from 'swr'

interface Inputs {
    textContent: string,
    myIndex: number,
    maxIndex: number,
    callBack: Function
}



// ToolTip component
export const ToolTip = ({textContent,myIndex,maxIndex, callBack}:Inputs) => {

    return (
        <div className="group relative">
            
            
            <div className={`flex-col  w-70 group-hover:visible flex absolute  text-white p-2 rounded-md duration-300 text-left bg-primaryDarkBlue`} >
                
            
            
            <p>{textContent}</p>
           
                
            
            {myIndex === maxIndex-1 && myIndex === 0 ? 
                    <div className='flex w-1/2 space-x-48'>
                        
                            <div>{myIndex+1}/{maxIndex}</div> 
                            <label className='std-button btn underline' onClick={()=>{callBack(myIndex+1)}} >Feshar</label>  
                    </div>
            :
            // If it is the last page, show the "Voltar/Back" "Feshar/Finish" button
            myIndex === maxIndex-1 ? 
                    <div className='flex w-1/2 space-x-48'>
                        
                            <label className='std-button underline bg-transparent' onClick={()=>{callBack(myIndex-1);}}>Voltar </label> 
                            <div>{myIndex+1}/{maxIndex}</div> 
                            <label className='std-button underline bg-transparent' onClick={()=>{callBack(myIndex+1)}}>Feshar</label>  
                    </div>
            :
            // If it is the first page, show the "Próximo/Next" button
            myIndex === 0 ?
                    <div className='flex w-1/2 space-x-48'>
                        <p>{myIndex+1}/{maxIndex}</p> 
                        <label className='std-button underline'onClick={()=>{callBack(myIndex+1)}}>Próximo</label>
                    </div>
            :
            // If it is any other page, show the "Voltar/Back" "Próximo/Next" button
                    <div className='flex w-1/2 space-x-48'>
                        
                        <div className='flex w-1/3 space-x-24'>
                            <label className='std-button underline' onClick={()=>{callBack(myIndex-1)}}>Voltar </label> 
                            <div>{myIndex+1}/{maxIndex}</div> 
                            <label className='std-button underline' onClick={()=>{callBack(myIndex+1)}}>Próximo</label> 
                        </div>
                    </div>
            }
            </div>
        </div> 
            
            
       
    );

}