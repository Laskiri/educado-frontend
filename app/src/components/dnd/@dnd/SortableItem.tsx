import { Link, useLocation} from 'react-router-dom';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// icons
import { ChevronUpDownIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

import { BACKEND_URL } from "../../../helpers/environment";

export function SortableItem(props: any) {
  const location = useLocation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.item.sectionNumber });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="flex justify-between items-center border rounded p-1">
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
        <div className='btn btn-ghost'>
          <ChevronUpDownIcon width={24} />
        </div>
      </div>

      <div className='flex justify-between items-center w-full space-x-2'>
        <p className='font-semibold'>{props.item.title}</p>
        <a href={`/sections/${props.item._id}`} className='btn btn-ghost'>
          <PencilSquareIcon width={20} className="text-blue-500 hover:text-blue-700" />
          </a>
      </div>
    </div>
  );
}