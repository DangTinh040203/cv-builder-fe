"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/components/accordion";
import { Button } from "@shared/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { Checkbox } from "@shared/ui/components/checkbox";
import { Label } from "@shared/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/select";
import { Slider } from "@shared/ui/components/slider";
import { Switch } from "@shared/ui/components/switch";
import { cn } from "@shared/ui/lib/utils";
import {
  ALargeSmall,
  AlignCenter,
  AlignLeft,
  Bold,
  Calendar,
  Columns2,
  Eye,
  EyeOff,
  Heading1,
  LayoutTemplate,
  LetterText,
  Maximize2,
  Moon,
  MoveVertical,
  Palette,
  RectangleHorizontal,
  RotateCcw,
  Sparkles,
  SquareStack,
  Sun,
  Type,
} from "lucide-react";

import {
  type BorderStyle,
  type ColumnLayout,
  defaultFormat,
  type FontWeight,
  type Format,
  type HeaderStyle,
  type SectionType,
  templateFormatSelector,
  type Theme,
  updateTemplateConfigFormat,
} from "@/stores/features/template.slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";

const COLOR_OPTIONS = [
  { value: "blue", label: "Blue", color: "#3b82f6" },
  { value: "purple", label: "Purple", color: "#8b5cf6" },
  { value: "green", label: "Green", color: "#22c55e" },
  { value: "red", label: "Red", color: "#ef4444" },
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "teal", label: "Teal", color: "#14b8a6" },
  { value: "slate", label: "Slate", color: "#64748b" },
  { value: "black", label: "Black", color: "#1f2937" },
];

const DATE_FORMAT_OPTIONS = [
  { value: "MM/YYYY", label: "MM/YYYY" },
  { value: "MMM YYYY", label: "Jan 2024" },
  { value: "MMMM YYYY", label: "January 2024" },
  { value: "YYYY", label: "2024" },
];

const FONT_WEIGHT_OPTIONS: { value: FontWeight; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
];

const COLUMN_LAYOUT_OPTIONS: {
  value: ColumnLayout;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "single",
    label: "Single",
    icon: <LayoutTemplate className="h-4 w-4" />,
  },
  {
    value: "double",
    label: "Two Column",
    icon: <Columns2 className="h-4 w-4" />,
  },
];

const HEADER_STYLE_OPTIONS: {
  value: HeaderStyle;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "left", label: "Left", icon: <AlignLeft className="h-4 w-4" /> },
  {
    value: "center",
    label: "Center",
    icon: <AlignCenter className="h-4 w-4" />,
  },
];

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] =
  [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "auto", label: "Auto", icon: <Sparkles className="h-4 w-4" /> },
  ];

const BORDER_STYLE_OPTIONS: { value: BorderStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "simple", label: "Simple" },
  { value: "double", label: "Double" },
  { value: "accent", label: "Accent" },
];

const SECTION_OPTIONS: { value: SectionType; label: string }[] = [
  { value: "personal", label: "Personal Info" },
  { value: "summary", label: "Summary" },
  { value: "skills", label: "Skills" },
  { value: "education", label: "Education" },
  { value: "experience", label: "Experience" },
  { value: "projects", label: "Projects" },
];

interface FormatSliderProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

const FormatSlider = ({
  icon,
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange,
}: FormatSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`
              flex h-7 w-7 items-center justify-center rounded-md
              bg-linear-to-br from-purple-500 to-indigo-600 text-white
            `}
          >
            {icon}
          </div>
          <Label className="text-sm font-medium">{label}</Label>
        </div>
        <span className="text-muted-foreground text-sm font-medium">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) =>
          values[0] !== undefined && onChange(values[0])
        }
        className="cursor-pointer"
      />
    </div>
  );
};

interface FormatSelectRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const FormatSelectRow = ({ icon, label, children }: FormatSelectRowProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={`
            flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br
            from-purple-500 to-indigo-600 text-white
          `}
        >
          {icon}
        </div>
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      {children}
    </div>
  );
};

interface ToggleButtonGroupProps<T extends string> {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}

const ToggleButtonGroup = <T extends string>({
  options,
  value,
  onChange,
}: ToggleButtonGroupProps<T>) => {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            `
              flex flex-1 items-center justify-center gap-1.5 rounded-lg
              border-2 px-3 py-2 text-sm font-medium transition-all
            `,
            value === option.value
              ? "border-primary bg-primary/10 text-primary"
              : `
                  border-muted text-muted-foreground
                  hover:border-primary/50 hover:bg-muted/50
                `,
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

const TemplateFormat = () => {
  const dispatch = useAppDispatch();
  const format = useAppSelector(templateFormatSelector);

  const updateFormat = (updates: Partial<Format>) => {
    dispatch(updateTemplateConfigFormat(updates));
  };

  const handleReset = () => {
    dispatch(updateTemplateConfigFormat(defaultFormat));
  };

  const toggleSectionVisibility = (section: SectionType) => {
    const isHidden = format.hiddenSections.includes(section);
    const newHiddenSections = isHidden
      ? format.hiddenSections.filter((s) => s !== section)
      : [...format.hiddenSections, section];
    updateFormat({ hiddenSections: newHiddenSections });
  };

  return (
    <Card
      className={`
        sticky top-4 gap-0 bg-white/80 shadow-xl backdrop-blur-sm
        dark:bg-gray-900/80
      `}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div
              className={`
                flex h-9 w-9 items-center justify-center rounded-lg
                bg-linear-to-br from-purple-500 to-indigo-600
              `}
            >
              <Type className="h-5 w-5 text-white" />
            </div>
            Format Settings
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className={`
              text-muted-foreground gap-1.5
              hover:text-foreground
            `}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <Accordion
          type="multiple"
          defaultValue={["typography"]}
          className="w-full"
        >
          {/* Typography Section */}
          <AccordionItem value="typography" className="border-b-0">
            <AccordionTrigger
              className={`
                text-muted-foreground py-3 text-xs font-semibold tracking-wider
                uppercase
                hover:no-underline
              `}
            >
              Typography
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              <FormatSlider
                icon={<ALargeSmall className="h-4 w-4" />}
                label="Font Size"
                value={format.fontSize}
                min={8}
                max={16}
                step={1}
                unit="px"
                onChange={(value) => updateFormat({ fontSize: value })}
              />

              <FormatSlider
                icon={<Heading1 className="h-4 w-4" />}
                label="Title Size"
                value={format.titleSize}
                min={24}
                max={48}
                step={1}
                unit="px"
                onChange={(value) => updateFormat({ titleSize: value })}
              />

              <FormatSlider
                icon={<MoveVertical className="h-4 w-4" />}
                label="Line Height"
                value={format.lineHeight}
                min={1}
                max={2.5}
                step={0.1}
                onChange={(value) => updateFormat({ lineHeight: value })}
              />

              <FormatSlider
                icon={<LetterText className="h-4 w-4" />}
                label="Letter Spacing"
                value={format.letterSpacing}
                min={-1}
                max={3}
                step={0.1}
                unit="px"
                onChange={(value) => updateFormat({ letterSpacing: value })}
              />

              <FormatSelectRow
                icon={<Bold className="h-4 w-4" />}
                label="Font Weight"
              >
                <Select
                  value={format.fontWeight}
                  onValueChange={(value: FontWeight) =>
                    updateFormat({ fontWeight: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormatSelectRow>
            </AccordionContent>
          </AccordionItem>

          {/* Layout Section */}
          <AccordionItem value="layout" className="border-b-0">
            <AccordionTrigger
              className={`
                text-muted-foreground py-3 text-xs font-semibold tracking-wider
                uppercase
                hover:no-underline
              `}
            >
              Layout
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              <FormatSlider
                icon={<Maximize2 className="h-4 w-4" />}
                label="Section Spacing"
                value={format.sectionSpacing}
                min={4}
                max={24}
                step={2}
                unit="px"
                onChange={(value) => updateFormat({ sectionSpacing: value })}
              />

              <FormatSlider
                icon={<Maximize2 className="h-4 w-4" />}
                label="Page Margin"
                value={format.margin}
                min={10}
                max={40}
                step={2}
                unit="px"
                onChange={(value) => updateFormat({ margin: value })}
              />

              <FormatSelectRow
                icon={<Columns2 className="h-4 w-4" />}
                label="Column Layout"
              >
                <ToggleButtonGroup
                  options={COLUMN_LAYOUT_OPTIONS}
                  value={format.columnLayout}
                  onChange={(value) => updateFormat({ columnLayout: value })}
                />
              </FormatSelectRow>

              <FormatSelectRow
                icon={<AlignLeft className="h-4 w-4" />}
                label="Header Style"
              >
                <ToggleButtonGroup
                  options={HEADER_STYLE_OPTIONS}
                  value={format.headerStyle}
                  onChange={(value) => updateFormat({ headerStyle: value })}
                />
              </FormatSelectRow>
            </AccordionContent>
          </AccordionItem>

          {/* Appearance Section */}
          <AccordionItem value="appearance" className="border-b-0">
            <AccordionTrigger
              className={`
                text-muted-foreground py-3 text-xs font-semibold tracking-wider
                uppercase
                hover:no-underline
              `}
            >
              Appearance
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      flex h-7 w-7 items-center justify-center rounded-md
                      bg-linear-to-br from-purple-500 to-indigo-600 text-white
                    `}
                  >
                    <Palette className="h-4 w-4" />
                  </div>
                  <Label className="text-sm font-medium">Accent Color</Label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFormat({ color: option.value })}
                      className={cn(
                        `
                          group relative flex h-10 items-center justify-center
                          rounded-lg border-2 transition-all duration-200
                        `,
                        format.color === option.value
                          ? "border-primary ring-primary/20 scale-105 ring-2"
                          : "border-transparent hover:scale-105",
                      )}
                      title={option.label}
                    >
                      <div
                        className={`
                          h-6 w-6 rounded-full shadow-sm transition-transform
                          group-hover:scale-110
                        `}
                        style={{ backgroundColor: option.color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <FormatSelectRow icon={<Sun className="h-4 w-4" />} label="Theme">
                <ToggleButtonGroup
                  options={THEME_OPTIONS}
                  value={format.theme}
                  onChange={(value) => updateFormat({ theme: value })}
                />
              </FormatSelectRow>

              <FormatSelectRow
                icon={<RectangleHorizontal className="h-4 w-4" />}
                label="Border Style"
              >
                <Select
                  value={format.borderStyle}
                  onValueChange={(value: BorderStyle) =>
                    updateFormat({ borderStyle: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select border style" />
                  </SelectTrigger>
                  <SelectContent>
                    {BORDER_STYLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormatSelectRow>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`
                      flex h-7 w-7 items-center justify-center rounded-md
                      bg-linear-to-br from-purple-500 to-indigo-600 text-white
                    `}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <Label className="text-sm font-medium">
                    Show Section Icons
                  </Label>
                </div>
                <Switch
                  checked={format.showIcons}
                  onCheckedChange={(checked) =>
                    updateFormat({ showIcons: checked })
                  }
                />
              </div>

              <FormatSelectRow
                icon={<Calendar className="h-4 w-4" />}
                label="Date Format"
              >
                <Select
                  value={format.dateFormat}
                  onValueChange={(value) => updateFormat({ dateFormat: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMAT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormatSelectRow>
            </AccordionContent>
          </AccordionItem>

          {/* Section Visibility */}
          <AccordionItem value="visibility" className="border-b-0">
            <AccordionTrigger
              className={`
                text-muted-foreground py-3 text-xs font-semibold tracking-wider
                uppercase
                hover:no-underline
              `}
            >
              Section Visibility
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              {SECTION_OPTIONS.map((section) => {
                const isHidden = format.hiddenSections.includes(section.value);
                return (
                  <div
                    key={section.value}
                    className={`
                      flex items-center justify-between rounded-lg border p-3
                      transition-colors
                      ${isHidden ? "bg-muted/50 opacity-60" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {isHidden ? (
                        <EyeOff className="text-muted-foreground h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">
                        {section.label}
                      </span>
                    </div>
                    <Checkbox
                      checked={!isHidden}
                      onCheckedChange={() =>
                        toggleSectionVisibility(section.value)
                      }
                    />
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>

          {/* Section Order */}
          <AccordionItem value="order" className="border-b-0">
            <AccordionTrigger
              className={`
                text-muted-foreground py-3 text-xs font-semibold tracking-wider
                uppercase
                hover:no-underline
              `}
            >
              Section Order
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              <div className="flex items-center gap-2 pb-2">
                <div
                  className={`
                    flex h-7 w-7 items-center justify-center rounded-md
                    bg-linear-to-br from-purple-500 to-indigo-600 text-white
                  `}
                >
                  <SquareStack className="h-4 w-4" />
                </div>
                <p className="text-muted-foreground text-xs">
                  Drag to reorder (coming soon)
                </p>
              </div>

              <div className="space-y-2">
                {format.sectionOrder.map((sectionKey, index) => {
                  const section = SECTION_OPTIONS.find(
                    (s) => s.value === sectionKey,
                  );
                  if (!section) return null;

                  return (
                    <div
                      key={section.value}
                      className={`
                        flex items-center gap-3 rounded-lg border bg-white p-3
                        dark:bg-gray-800
                      `}
                    >
                      <span
                        className={`text-muted-foreground text-sm font-medium`}
                      >
                        {index + 1}.
                      </span>
                      <span className="text-sm font-medium">
                        {section.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TemplateFormat;
