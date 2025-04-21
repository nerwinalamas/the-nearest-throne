"use client";

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

const ACCESSIBILITY_FEATURES = [
  "Wheelchair Accessible",
  "Hand Dryer",
  "Paper Towels",
  "Soap Available",
  "Tabo",
  "Bidet",
];
const PAYMENT_TYPES = ["Free", "Paid"];
const TOILET_TYPES = [
  "All",
  "Public Restrooms Only",
  "Private/Business Restrooms Only",
];
const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Gender-Neutral",
  "All-Gender",
  "Unisex",
];

const Filters = () => {
  return (
    <aside className="p-4 rounded-lg space-y-4">
      <Accordion type="multiple" className="w-full">
        {/* Cleanliness Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Cleanliness Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4 px-2">
              <Slider max={5} min={1} step={1} className="w-full" />
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
                <Checkbox id={`acc-${feature}`} />
                <Label htmlFor={`acc-${feature}`}>{feature}</Label>
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
                <Checkbox id={`pay-${type}`} />
                <Label htmlFor={`pay-${type}`}>{type}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Toilet Type */}
        <AccordionItem value="toiletType">
          <AccordionTrigger>Toilet Type</AccordionTrigger>
          <AccordionContent>
            <RadioGroup>
              {TOILET_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={type.toLowerCase().replace(" ", "-")}
                    id={`type-${type}`}
                  />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
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
                <Checkbox id={`gender-${gender}`} />
                <Label htmlFor={`gender-${gender}`}>{gender}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-2">
        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </div>
    </aside>
  );
};

export default Filters;
