"use client";

import { useState } from "react";
import { useRestroomStore } from "@/hooks/useRestroomStore";
import {
  ACCESSIBILITY_FEATURES,
  GENDER_OPTIONS,
  PAYMENT_TYPES,
  TOILET_TYPES,
} from "@/lib/constants";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";

const Filters = () => {
  const { filters, setFilters, applyFilters, resetFilters } =
    useRestroomStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature];
    setFilters({ features: newFeatures });
  };

  const handlePaymentToggle = (type: "Free" | "Paid") => {
    const newPaymentTypes = filters.paymentTypes.includes(type)
      ? filters.paymentTypes.filter((t) => t !== type)
      : [...filters.paymentTypes, type];
    setFilters({ paymentTypes: newPaymentTypes });
  };

  const handleTypeChange = (type: string) => {
    if (type === "All") {
      setFilters({ types: [] });
    } else if (type === "Public Restrooms Only") {
      setFilters({ types: ["Public"] });
    } else {
      setFilters({ types: ["Private"] });
    }
  };

  const handleGenderToggle = (gender: string) => {
    const newGenders = filters.genders.includes(gender)
      ? filters.genders.filter((g) => g !== gender)
      : [...filters.genders, gender];
    setFilters({ genders: newGenders });
  };

  const handleApply = () => {
    applyFilters();
    setIsOpen(false);
  };

  const filtersContent = (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {/* Cleanliness Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Cleanliness Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4 px-2">
              <Slider
                max={5}
                min={1}
                step={1}
                className="w-full hover:cursor-pointer"
                value={filters.cleanliness}
                onValueChange={(value) =>
                  setFilters({ cleanliness: value as [number, number] })
                }
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 (Dirty)</span>
                <span>5 (Very Clean)</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Accessibility Features */}
        <AccordionItem value="accessibility">
          <AccordionTrigger>Accessibility Features</AccordionTrigger>
          <AccordionContent className="space-y-4">
            {ACCESSIBILITY_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`acc-${feature}`}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <Label
                  htmlFor={`acc-${feature}`}
                  className="hover:cursor-pointer"
                >
                  {feature}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Payment Type */}
        <AccordionItem value="payment">
          <AccordionTrigger>Payment Type</AccordionTrigger>
          <AccordionContent className="space-y-4">
            {PAYMENT_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`pay-${type}`}
                  checked={filters.paymentTypes.includes(
                    type as "Free" | "Paid"
                  )}
                  onCheckedChange={() =>
                    handlePaymentToggle(type as "Free" | "Paid")
                  }
                />
                <Label htmlFor={`pay-${type}`} className="hover:cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Toilet Type */}
        <AccordionItem value="toiletType">
          <AccordionTrigger>Toilet Type</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={
                filters.types.length === 0
                  ? "All"
                  : filters.types[0] === "Public"
                  ? "Public Restrooms Only"
                  : "Private/Business Restrooms Only"
              }
              onValueChange={handleTypeChange}
            >
              {TOILET_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={`type-${type}`} />
                  <Label
                    htmlFor={`type-${type}`}
                    className="hover:cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Gender */}
        <AccordionItem value="gender">
          <AccordionTrigger>Gender Options</AccordionTrigger>
          <AccordionContent className="space-y-4">
            {GENDER_OPTIONS.map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <Checkbox
                  id={`gender-${gender}`}
                  checked={filters.genders.includes(gender)}
                  onCheckedChange={() => handleGenderToggle(gender)}
                />
                <Label
                  htmlFor={`gender-${gender}`}
                  className="hover:cursor-pointer"
                >
                  {gender}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleApply}>
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View - Sidebar */}
      <aside className="p-4 space-y-4 hidden xl:block w-80">
        {filtersContent}
      </aside>

      {/* Mobile View - Drawer */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button size="lg" className="rounded-full p-4 h-14 w-14 shadow-lg">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80%] px-4 pb-4">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Customize your restroom search
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto h-full">
              <h2 className="text-xl font-bold pt-4 pb-2">Filters</h2>
              {filtersContent}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default Filters;
