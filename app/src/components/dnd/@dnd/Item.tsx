import { forwardRef } from 'react';

// icons
import { mdiDeleteCircle, mdiDotsVerticalCircle  } from '@mdi/js';
import Icon from '@mdi/react';

export const Item = forwardRef(({ id, ...props }: { id: any }, ref:React.ForwardedRef<null>) => {
  return (
    <div {...props} ref={ref} className="bg-gray-300  pl-3.5 pt-2 w-14 flex justify-center items-center border rounded p-2">
      <div className='flex space-x-2'>        
      
        <Icon path={mdiDotsVerticalCircle} size={1.2}></Icon>

      </div>
    </div>
  )
});