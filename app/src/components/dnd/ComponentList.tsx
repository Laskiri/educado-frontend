import { useState, useEffect } from 'react';

// DND-KIT
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

// Components
import { SortableComponentItem } from './@dnd/SortableComponentItem';
import { Item } from './@dnd/Item';

// Intefaces
import ComponentService from '../../services/component.service';

interface Props {
  sid: string
  componentIds: Array<string>
  componentTypesMap:  Map<string, string>
  idMap: Map<string, string>
  addOnSubmitSubscriber: Function
}

export const ComponentList = ({sid, componentIds, componentTypesMap, idMap, addOnSubmitSubscriber }: Props) => {
  // States
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState(componentIds);

  // Setup of pointer and keyboard sensor
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // handle start of dragging
  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  }

  // handle end of dragging
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }


  useEffect(() => {
    addOnSubmitSubscriber(()=>onSubmit());
  }, [])

  function onSubmit(){
    const componentArray:any[] = [];
    setItems((items) => {
      for (let i = 0; i < items.length; i++) {
        componentArray.push({_id: idMap.get(items[i]), compId: items[i], compType: componentTypesMap.get(items[i])})
      }
      console.log(componentArray);
      console.log(items);
      return(items)
  });
   ComponentService.setComponents(sid, componentArray);
  }

  return (
    <div className='w-full'>
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      
      >
        <SortableContext items={items.map(item => item)} strategy={verticalListSortingStrategy}>
          {items.map((item, key: React.Key) => <SortableComponentItem key={key} cid={item} map={componentTypesMap} />)}
        </SortableContext>

       
        <DragOverlay className='w-full' >
          {activeId ? <Item id={activeId} /> : null}
        </DragOverlay>
        
      </DndContext>
    </div>
  );
}

