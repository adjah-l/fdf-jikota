import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ACTIVITY_TYPES, type ActivityType } from "@/lib/activityTypes";

interface ActivityTypeSelectorProps {
  value: ActivityType;
  onValueChange: (value: ActivityType) => void;
  className?: string;
}

export function ActivityTypeSelector({ value, onValueChange, className }: ActivityTypeSelectorProps) {
  return (
    <div className={className}>
      <Label className="text-base font-medium">Which kind of group would you like to join?</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onValueChange as (value: string) => void}
        className="mt-3"
      >
        {ACTIVITY_TYPES.map((type) => (
          <div key={type.key} className="flex items-center space-x-2">
            <RadioGroupItem value={type.key} id={type.key} />
            <Label htmlFor={type.key} className="font-normal cursor-pointer">
              {type.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}