
interface CancelButtonProps {
    isSubmitting: boolean;
}


export const CreateButtonCompont = ({isSubmitting}:CancelButtonProps) => {



    return (
        <div className='modal-action'>
            <div className="flex items-center justify-between gap-4 w-full mt-8">
                <label htmlFor='lecture-create' className=" bg-primary hover:bg-primaryHover border border-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                    {isSubmitting === false ? 
                    
                    <button type="submit" className='py-2 px-4 h-full w-full'>
                        Criar
                    </button>
                    :
                    <button disabled className='py-2 px-4 h-full w-full'>
                        Criar
                    </button>}
                </label>
                <label htmlFor='lecture-create' className="py-2 px-4 bg-white hover:bg-gray-100 border border-primary  hover:border-primaryHover hover:text-primaryHover  text-primary w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                    Cancelar
                </label>
            </div>
        </div>

    )
}
