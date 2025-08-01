import { useState } from 'react';
import { Slide } from '@/types/slide';
import { detectSlideIcon, iconStyles } from '@/lib/slide-icons';
import { Plus, GripVertical, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableSlideItem } from './sortable-slide-item';

interface SlideListProps {
  slides: Slide[];
  activeSlideId: string;
  onSlideSelect: (slideId: string) => void;
  onSlideAdd: () => void;
  onSlideReorder: (slides: Slide[]) => void;
  onSlideUpdate: (slide: Slide) => void;
}

export function SlideList({ 
  slides, 
  activeSlideId, 
  onSlideSelect, 
  onSlideAdd, 
  onSlideReorder,
  onSlideUpdate 
}: SlideListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { updateSlide, loading } = useApi();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEditStart = (slide: Slide) => {
    setEditingId(slide.id);
    setEditTitle(slide.title);
  };

  const handleEditSave = async () => {
    if (editingId) {
      const slide = slides.find(s => s.id === editingId);
      if (slide) {
        const updatedSlide = { ...slide, title: editTitle };
        onSlideUpdate(updatedSlide);
        
        // Update slide via API
        try {
          await updateSlide(parseInt(slide.id), { title: editTitle });
          toast({
            title: "Slide Updated",
            description: "Slide title has been updated successfully.",
          });
        } catch (err) {
          toast({
            title: "Update Failed",
            description: "Failed to update slide. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex(slide => slide.id === active.id);
      const newIndex = slides.findIndex(slide => slide.id === over?.id);
      
      const reorderedSlides = arrayMove(slides, oldIndex, newIndex);
      onSlideReorder(reorderedSlides);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-section text-gray-900">Slides</h2>
        <span className="text-footer text-gray-500">{slides.length}</span>
      </div>

      {/* Slide list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={slides.map(slide => slide.id)} strategy={verticalListSortingStrategy}>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {slides.map((slide, index) => (
              <SortableSlideItem
                key={slide.id}
                slide={slide}
                index={index}
                isActive={slide.id === activeSlideId}
                onSlideSelect={onSlideSelect}
                onSlideUpdate={onSlideUpdate}
                editingId={editingId}
                editTitle={editTitle}
                onEditStart={handleEditStart}
                onEditSave={handleEditSave}
                onEditCancel={handleEditCancel}
                onEditTitleChange={setEditTitle}
                onKeyDown={handleKeyDown}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add slide button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          onClick={onSlideAdd}
          className="w-full interactive-hover bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </div>
    </div>
  );
}