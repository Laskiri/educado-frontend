// Icon from: https://materialdesignicons.com/

import useSWR from 'swr'

import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';

interface Inputs {
    textContent: string,
    myIndex: number,
    maxIndex: number,
    callBack: Function
}



// ToolTip component
export const ToolTip = ({textContent,myIndex,maxIndex, callBack}:Inputs) => {
    return (
        <div className="group relative ">
                <div className={`flex-col w-70 group-hover:visible absolute  text-white p-2 rounded-md duration-300 text-left bg-primaryDarkBlue`} >
                    <div className='flex-col-2'>
                        <div className={'flex flex-row-reverse w-70'}>
                            <label className='std-button underline shadow-none hover:bg-transparent hover:text-white-400 bg-transparent text-right' onClick={()=>{callBack(maxIndex+1);}}> 
                                <Icon
                                    path={mdiWindowClose}
                                    size={1}
                                    className="text-white " // Add cursor-pointer for hover effect
                                />  
                            </label>
                        
                    
                            <p>{textContent}</p>
                        </div>
                    </div>

            
                {myIndex === maxIndex-1 && myIndex === 0 ? 
                    <div className='flex-col w-1/2 space-x-48'>
                        
                            <div>{myIndex+1}/{maxIndex}</div> 
                            <label className='std-button btn shadow-none hover:text-white-400 underline' onClick={()=>{callBack(myIndex+1)}} >Feshar</label>  
                    </div>
            :
            // If it is the last page, show the "Voltar/Back" "Feshar/Finish" button
            myIndex === maxIndex-1 ? 
                    <div className='flex w-1/3 space-x-40'>

                            <label className='std-button underline shadow-none hover:bg-transparent hover:text-white-400 bg-transparent' onClick={()=>{callBack(myIndex-1);}}>Voltar </label> 
                            <div>{myIndex+1}/{maxIndex}</div> 
                            <label className='std-button underline shadow-none hover:bg-transparent hover:text-white-400  bg-transparent' onClick={()=>{callBack(myIndex+1)}}>Feshar</label>  
                    </div>            :
            // If it is the first page, show the "Próximo/Next" button
            myIndex === 0 ?
                    <div className='flex w-1/2 space-x-40'>
                        <p>{myIndex+1}/{maxIndex}</p> 
                        <label className='std-button shadow-none hover:bg-transparent hover:text-white-400  underline'onClick={()=>{callBack(myIndex+1)}}>Próximo</label>
                    </div>
            :
            // If it is any other page, show the "Voltar/Back" "Próximo/Next" button
                    <div className='flex w-1/2 space-x-10'>
                        
                        <div className='flex w-1/3 space-x-48'>
                            <label className='std-button shadow-none hover:bg-transparent hover:text-white-400 underline hover:bg-transparent' onClick={()=>{callBack(myIndex-1)}}>Voltar </label> 
                            <div>{myIndex+1}/{maxIndex}</div> 
                            <label className='std-button shadow-none hover:bg-transparent hover:text-white-400 underline hover:bg-transparent' onClick={()=>{callBack(myIndex+1)}}>Próximo</label> 
                        </div>
                    </div>
            }
            </div>            
        </div> 
    
    );}