import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterComponentProps {
  title?: string;
  options: FilterOption[];
  onApplyFilters: (selectedIds: string[]) => void;
}

export function FilterComponent({ title = "Filtros", options, onApplyFilters }: FilterComponentProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleFilterChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters([...selectedFilters, id]);
    } else {
      setSelectedFilters(selectedFilters.filter((filterId) => filterId !== id));
    }
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    toast.info("Filtros aplicados!");
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedFilters([]);
    onApplyFilters([]);
    toast.info("Filtros limpos!");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          {title}
          {selectedFilters.length > 0 && (
            <span className="ml-1 rounded-full bg-primary w-4 h-4 text-[10px] text-primary-foreground flex items-center justify-center">
              {selectedFilters.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filtrar por Status</h4>
            <p className="text-sm text-muted-foreground">
              Selecione os status para filtrar.
            </p>
          </div>
          <div className="grid gap-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox 
                  id={option.id} 
                  checked={selectedFilters.includes(option.id)}
                  onCheckedChange={(checked) => handleFilterChange(option.id, checked as boolean)}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Limpar
            </Button>
            <Button size="sm" onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
