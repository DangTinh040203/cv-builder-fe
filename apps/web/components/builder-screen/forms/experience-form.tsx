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
import { Textarea } from "@shared/ui/components/textarea";
import { cn } from "@shared/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import BuilderNavigation from "@/components/builder-screen/builder-navigation";
import { useSyncResume } from "@/hooks/use-sync-resume";
import { updateResume } from "@/stores/features/resume.slice";
import { useAppDispatch } from "@/stores/store";
import type { WorkExperience } from "@/types/resume.type";

interface ExperienceFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Sortable experience item component
function SortableExperienceItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: WorkExperience;
  onUpdate: (
    id: string,
    field: keyof WorkExperience,
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
        isDragging && "z-50 shadow-lg ring-orange-500",
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
            value={item.company}
            onChange={(e) => onUpdate(item.id, "company", e.target.value)}
            placeholder="Company Name"
            className={cn(
              "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm",
              "focus:bg-white focus:ring-2 focus:ring-orange-500/20",
              "dark:border-slate-700 dark:bg-slate-700",
            )}
          />
          <Input
            value={item.position}
            onChange={(e) => onUpdate(item.id, "position", e.target.value)}
            placeholder="Job Title / Position"
            className={cn(
              "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm",
              "focus:bg-white focus:ring-2 focus:ring-orange-500/20",
              "dark:border-slate-700 dark:bg-slate-700",
            )}
          />
        </div>
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
                "focus:bg-white focus:ring-2 focus:ring-orange-500/20",
                "dark:border-slate-700 dark:bg-slate-700",
              )}
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-slate-500">
              End Date (leave empty if current)
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
                "focus:bg-white focus:ring-2 focus:ring-orange-500/20",
                "dark:border-slate-700 dark:bg-slate-700",
              )}
            />
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block text-xs text-slate-500">
            Description & Achievements
          </Label>
          <Textarea
            value={item.description}
            onChange={(e) => onUpdate(item.id, "description", e.target.value)}
            placeholder="Describe your responsibilities and key achievements..."
            rows={3}
            className={cn(
              "rounded-lg border-slate-200 bg-slate-50 text-sm",
              "focus:bg-white focus:ring-2 focus:ring-orange-500/20",
              "dark:border-slate-700 dark:bg-slate-700",
            )}
          />
        </div>
      </div>
    </div>
  );
}

const ExperienceForm = ({ onNext, onBack }: ExperienceFormProps) => {
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

  const experienceItems = resume?.workExperiences || [];

  const updateExperienceItem = (
    id: string,
    field: keyof WorkExperience,
    value: string | Date | null,
  ) => {
    const newItems = experienceItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    dispatch(updateResume({ workExperiences: newItems }));
  };

  const addExperienceItem = () => {
    const newItem: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      description: "",
      startDate: new Date(),
      endDate: null,
      resumeId: resume?.id || "",
    };
    dispatch(updateResume({ workExperiences: [...experienceItems, newItem] }));
  };

  const removeExperienceItem = (id: string) => {
    const newItems = experienceItems.filter((item) => item.id !== id);
    dispatch(updateResume({ workExperiences: newItems }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experienceItems.findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = experienceItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(experienceItems, oldIndex, newIndex);
      dispatch(updateResume({ workExperiences: newItems }));
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
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`
                    text-lg font-bold text-slate-900
                    dark:text-white
                  `}
                >
                  Work Experience
                </span>
                <span
                  className={`
                    text-sm font-normal text-slate-500
                    dark:text-slate-400
                  `}
                >
                  Your professional journey
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
                  <div className="h-1 w-1 rounded-full bg-orange-500" />
                  <Label
                    className={`
                      text-xs font-semibold tracking-wider text-slate-500
                      uppercase
                    `}
                  >
                    Work History
                  </Label>
                  {experienceItems.length > 0 && (
                    <span
                      className={`
                        rounded-full bg-orange-100 px-2 py-0.5 text-xs
                        font-medium text-orange-600
                        dark:bg-orange-900/30 dark:text-orange-400
                      `}
                    >
                      {experienceItems.length}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addExperienceItem}
                  className={cn(
                    "h-8 gap-1.5 rounded-lg border-dashed",
                    "border-slate-300 text-slate-600",
                    `
                      hover:border-orange-500 hover:bg-orange-50
                      hover:text-orange-600
                    `,
                    "dark:border-slate-600 dark:text-slate-400",
                  )}
                  type="button"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Experience
                </Button>
              </div>

              <div
                className={cn(
                  "rounded-xl border border-slate-200 bg-slate-50/50 p-3",
                  "dark:border-slate-700 dark:bg-slate-800/30",
                )}
              >
                {experienceItems.length === 0 ? (
                  <div
                    className={`
                      flex flex-col items-center justify-center py-8 text-center
                    `}
                  >
                    <Briefcase className="mb-2 h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">
                      No work experience added yet
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Add your jobs, internships, and freelance work
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={experienceItems.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence mode="popLayout">
                        <div className="space-y-3">
                          {experienceItems.map((item) => (
                            <SortableExperienceItem
                              key={item.id}
                              item={item}
                              onUpdate={updateExperienceItem}
                              onRemove={removeExperienceItem}
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

export default ExperienceForm;
