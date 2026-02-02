"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@shared/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { Input } from "@shared/ui/components/input";
import { Label } from "@shared/ui/components/label";
import { cn } from "@shared/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import BuilderNavigation from "@/components/builder-screen/builder-navigation";
import { useSyncResume } from "@/hooks/use-sync-resume";
import { updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch } from "@/stores/store";
import type { Education } from "@/types/resume.type";

interface EducationFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Sortable education item component
function SortableEducationItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: Education;
  onUpdate: (
    id: string,
    field: keyof Education,
    value: string | Date | null,
  ) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0] ?? "";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-xl bg-white p-4",
        "ring-1 ring-slate-200",
        "hover:ring-slate-300",
        "dark:bg-slate-800 dark:ring-slate-700",
        isDragging && "z-50 shadow-lg ring-violet-500",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        {/* Drag Handle */}
        <button
          type="button"
          className={cn(
            "cursor-grab touch-none rounded p-1",
            "text-slate-400 transition-colors",
            "hover:bg-slate-100 hover:text-slate-600",
            "dark:hover:bg-slate-700",
            isDragging && "cursor-grabbing",
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 shrink-0 rounded-md",
            "text-slate-400 opacity-0 transition-opacity",
            "group-hover:opacity-100",
            "hover:bg-rose-50 hover:text-rose-500",
            "dark:hover:bg-rose-500/10",
          )}
          onClick={() => onRemove(item.id)}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-3">
        <div
          className={`
            grid gap-3
            sm:grid-cols-2
          `}
        >
          <Input
            value={item.school}
            onChange={(e) => onUpdate(item.id, "school", e.target.value)}
            placeholder="School / University"
            className={cn(
              "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm",
              "focus:bg-white focus:ring-2 focus:ring-violet-500/20",
              "dark:border-slate-700 dark:bg-slate-700",
            )}
          />
          <Input
            value={item.degree}
            onChange={(e) => onUpdate(item.id, "degree", e.target.value)}
            placeholder="Degree (e.g. Bachelor's)"
            className={cn(
              "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm",
              "focus:bg-white focus:ring-2 focus:ring-violet-500/20",
              "dark:border-slate-700 dark:bg-slate-700",
            )}
          />
        </div>
        <Input
          value={item.major}
          onChange={(e) => onUpdate(item.id, "major", e.target.value)}
          placeholder="Major / Field of Study"
          className={cn(
            "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm",
            "focus:bg-white focus:ring-2 focus:ring-violet-500/20",
            "dark:border-slate-700 dark:bg-slate-700",
          )}
        />
        <div
          className={`
            grid gap-3
            sm:grid-cols-2
          `}
        >
          <div>
            <Label className="mb-1.5 block text-xs text-slate-500">
              Start Date
            </Label>
            <Input
              type="date"
              value={formatDateForInput(item.startDate)}
              onChange={(e) =>
                onUpdate(
                  item.id,
                  "startDate",
                  e.target.value ? new Date(e.target.value) : new Date(),
                )
              }
              className={cn(
                "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm",
                "focus:bg-white focus:ring-2 focus:ring-violet-500/20",
                "dark:border-slate-700 dark:bg-slate-700",
              )}
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-slate-500">
              End Date (or expected)
            </Label>
            <Input
              type="date"
              value={formatDateForInput(item.endDate)}
              onChange={(e) =>
                onUpdate(
                  item.id,
                  "endDate",
                  e.target.value ? new Date(e.target.value) : null,
                )
              }
              className={cn(
                "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm",
                "focus:bg-white focus:ring-2 focus:ring-violet-500/20",
                "dark:border-slate-700 dark:bg-slate-700",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const EducationForm = ({ onNext, onBack }: EducationFormProps) => {
  const dispatch = useAppDispatch();
  const { sync, isSyncing, resume } = useSyncResume();
  const [isVisible, setIsVisible] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async () => {
    const success = await sync();
    if (success) {
      onNext?.();
    }
  };

  const educationItems = resume?.educations || [];

  const updateEducationItem = (
    id: string,
    field: keyof Education,
    value: string | Date | null,
  ) => {
    const newItems = educationItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    dispatch(updateResume({ educations: newItems }));
  };

  const addEducationItem = () => {
    const newItem: Education = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      major: "",
      startDate: new Date(),
      endDate: null,
      resumeId: resume?.id || "",
    };
    dispatch(updateResume({ educations: [...educationItems, newItem] }));
  };

  const removeEducationItem = (id: string) => {
    const newItems = educationItems.filter((item) => item.id !== id);
    dispatch(updateResume({ educations: newItems }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = educationItems.findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = educationItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(educationItems, oldIndex, newIndex);
      dispatch(updateResume({ educations: newItems }));
    }
  };

  if (!resume) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className={cn("relative overflow-hidden border-0 shadow-xl")}>
          <CardHeader
            className={`
              border-b border-slate-100 pb-5
              dark:border-slate-800
            `}
          >
            <CardTitle className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  "bg-linear-to-br from-violet-500 to-purple-600",
                  "shadow-md shadow-violet-500/25",
                )}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`
                    text-lg font-bold text-slate-900
                    dark:text-white
                  `}
                >
                  Education
                </span>
                <span
                  className={`
                    text-sm font-normal text-slate-500
                    dark:text-slate-400
                  `}
                >
                  Your academic background
                </span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-violet-500" />
                  <Label
                    className={`
                      text-xs font-semibold tracking-wider text-slate-500
                      uppercase
                    `}
                  >
                    Education History
                  </Label>
                  {educationItems.length > 0 && (
                    <span
                      className={`
                        rounded-full bg-violet-100 px-2 py-0.5 text-xs
                        font-medium text-violet-600
                        dark:bg-violet-900/30 dark:text-violet-400
                      `}
                    >
                      {educationItems.length}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addEducationItem}
                  className={cn(
                    "h-8 gap-1.5 rounded-lg border-dashed",
                    "border-slate-300 text-slate-600",
                    `
                      hover:border-violet-500 hover:bg-violet-50
                      hover:text-violet-600
                    `,
                    "dark:border-slate-600 dark:text-slate-400",
                  )}
                  type="button"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Education
                </Button>
              </div>

              <div
                className={cn(
                  "rounded-xl border border-slate-200 bg-slate-50/50 p-3",
                  "dark:border-slate-700 dark:bg-slate-800/30",
                )}
              >
                {educationItems.length === 0 ? (
                  <div
                    className={`
                      flex flex-col items-center justify-center py-8 text-center
                    `}
                  >
                    <GraduationCap className="mb-2 h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">
                      No education added yet
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Add your degrees, certifications, and courses
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={educationItems.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence mode="popLayout">
                        <div className="space-y-3">
                          {educationItems.map((item) => (
                            <SortableEducationItem
                              key={item.id}
                              item={item}
                              onUpdate={updateEducationItem}
                              onRemove={removeEducationItem}
                            />
                          ))}
                        </div>
                      </AnimatePresence>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <BuilderNavigation
                onBack={onBack}
                onNext={onSubmit}
                disableBack={!onBack}
                loading={isSyncing}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EducationForm;
