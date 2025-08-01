import { Slide } from '@/types/slide';
import { detectSlideIcon, iconStyles } from '@/lib/slide-icons';
import { GripVertical, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSlideItemProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onSlideSelect: (slideId: string) => void;
  onSlideUpdate: (slide: Slide) => void;
  editingId: string | null;
  editTitle: string;
  onEditStart: (slide: Slide) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onEditTitleChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function SortableSlideItem({
  slide,
  index,
  isActive,
  onSlideSelect,
  onSlideUpdate,
  editingId,
  editTitle,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTitleChange,
  onKeyDown,
}: SortableSlideItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const iconMapping = detectSlideIcon(slide.title, slide.content);
  const IconComponent = iconMapping.icon;
  const iconStyle = iconStyles[iconMapping.key as keyof typeof iconStyles] || iconStyles.default;
  const isEditing = editingId === slide.id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 rounded-lg transition-smooth cursor-pointer
        ${isActive 
          ? 'bg-blue-50 border border-blue-200' 
          : 'hover:bg-gray-50 border border-transparent'
        }
        ${isDragging ? 'opacity-50' : ''}
      `}
      onClick={() => !isEditing && onSlideSelect(slide.id)}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="w-4 h-4 opacity-40 group-hover:opacity-70 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-full h-full" />
      </div>
      
      {/* Slide number */}
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
        {index + 1}
      </div>
      
      {/* Icon */}
      <div className={`w-5 h-5 p-1 rounded ${iconStyle} flex-shrink-0`}>
        <IconComponent className="w-full h-full" />
      </div>
      
      {/* Title */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            onBlur={onEditSave}
            onKeyDown={onKeyDown}
            className="h-6 px-1 text-sm bg-transparent border-none focus:bg-gray-100"
            autoFocus
          />
        ) : (
          <div className="text-sm font-medium truncate text-gray-700">{slide.title}</div>
        )}
      </div>
      
      {/* Edit button */}
      {!isEditing && (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 w-6 h-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onEditStart(slide);
          }}
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
} 