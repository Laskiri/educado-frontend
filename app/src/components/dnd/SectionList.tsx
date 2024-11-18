import { useState } from "react";

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

import { getUserToken } from "../../helpers/userInfo";
import SectionServices from "../../services/section.services";
import { toast } from "react-toastify";
import { useNotifications } from "../notification/NotificationContext";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// Components
import { SortableItem } from "./@dnd/SortableItem";
import { Item } from "./@dnd/Item";

//store"
import { useSections, useCourse } from "@contexts/courseStore";

interface Props {
  sections: Array<string>;
  addOnSubmitSubscriber: Function;
}
 
export const SectionList = ({
  sections,
  addOnSubmitSubscriber,
}: Props) => {
  // States
  const [activeId, setActiveId] = useState<string | null>(null);
  const [savedSID, setSavedSID] = useState<string>("");

  const { deleteCachedSection } = useSections();
  const { updateCachedCourseSections } = useCourse();
  const { addNotification } = useNotifications();

  // Setup of pointer and keyboard sensor
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDeletion = (sId: string) => {
    const token = getUserToken();
    if (confirm("Tem certeza que deseja excluir?") == true) {
      SectionServices.deleteSection(sId, token)
        .then(() => {
          addNotification("Seção excluída");
          deleteCachedSection(sId);
        })
        .catch((err) => toast.error(err));
    }
  };

  // handle start of dragging
  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  // handle end of dragging
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {

      const getAdjustedSectionList = () => {
        const oldIndex = sections.findIndex((section) => section === active.id);
        const newIndex = sections.findIndex((section) => section === over.id);
        const result = arrayMove(sections, oldIndex, newIndex);
        return result;
      }
      updateCachedCourseSections(getAdjustedSectionList());
    }
    setActiveId(null);
  };

  

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
          items={sections}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section, index) => (
            <SortableItem
              key={section}
              sid={section}
              addOnSubmitSubscriber={addOnSubmitSubscriber}
              savedSID={savedSID}
              setSavedSID={setSavedSID}
              handleSectionDeletion={handleSectionDeletion}
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
