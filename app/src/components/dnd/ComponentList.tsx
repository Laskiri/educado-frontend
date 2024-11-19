import { useState, useEffect } from "react";

// DND-KIT
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSections } from "@contexts/courseStore";

// Components
import { SortableComponentItem } from "./@dnd/SortableComponentItem";
import { Item } from "./@dnd/Item";
// Service
import LectureService from "@services/lecture.services";
import ExerciseServices from "@services/exercise.services";

// Intefaces
import ComponentService from "@services/component.service";
import { Component } from "@interfaces/Course";

// Hooks
import { getUserToken } from "@helpers/userInfo";

interface Props {
  sid: string;
  components: Component[];
  addOnSubmitSubscriber: Function;
}

export const ComponentList = ({
  sid,
  components,
  addOnSubmitSubscriber,
}: Props) => {
  // States
  const [activeId, setActiveId] = useState(null);
  const { updateCachedSectionComponents} = useSections();
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
  };

  // handle end of dragging
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const adjustComponents = () => {
        const oldIndex = components.findIndex(
          (component) => component.compId === active.id
        );
        const newIndex = components.findIndex(
          (component) => component.compId === over.id
          
        );
        return arrayMove(components, oldIndex, newIndex);
      }
      const newComponents = adjustComponents();
      updateCachedSectionComponents(sid, newComponents);
    }
  };

  useEffect(() => {
    addOnSubmitSubscriber(() => onSubmit());
  }, []);

  return (
    <div className="w-full">
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={components.map((comp) => comp._id)}
          strategy={verticalListSortingStrategy}
        >
          {components.map((comp, key: React.Key) => (
            <SortableComponentItem
              key={comp._id}
              component={comp}
              sid={sid}
            />
          ))}
        </SortableContext>

        <DragOverlay className="w-full">
          {activeId ? <Item id={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
