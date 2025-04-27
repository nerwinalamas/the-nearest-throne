"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "@/hooks/useModalStore";
import { useRestroomStore } from "@/hooks/useRestroomStore";
import { restroomFormSchema, RestroomFormValues } from "@/lib/schema";
import {
  ACCESSIBILITY_FEATURES,
  GENDER_OPTIONS,
  PAYMENT_TYPES,
} from "@/lib/constants";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PHAddressSearch = dynamic(() => import("../ph-address-search"), {
  ssr: false,
});

const CreateRestroom = () => {
  const { addRestroom } = useRestroomStore();

  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "createRestroom";

  const form = useForm<RestroomFormValues>({
    resolver: zodResolver(restroomFormSchema),
    defaultValues: {
      name: "",
      latitude: 14.5995,
      longitude: 120.9842,
      cleanliness: 3,
      features: [],
      paymentType: "Free",
      type: "Public",
      gender: [],
    },
  });

  const onSubmit = (data: RestroomFormValues) => {
    try {
      const newRestroom = {
        name: data.name,
        position: [data.latitude, data.longitude] as [number, number],
        cleanliness: data.cleanliness,
        features: data.features,
        paymentType: data.paymentType,
        type: data.type,
        gender: data.gender,
      };

      addRestroom(newRestroom);
      handleDialogChange();
    } catch (error) {
      console.error("Error adding restroom:", error);
    }
  };

  const handleDialogChange = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Restroom</DialogTitle>
          <DialogDescription>
            Fill in the details of the new restroom location
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Restroom name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Search with Autocomplete */}
            <div className="space-y-2">
              <FormLabel>Address</FormLabel>
              <PHAddressSearch
                onSelect={(result) => {
                  form.setValue("latitude", result.y);
                  form.setValue("longitude", result.x);
                }}
              />
            </div>

            {/* Coordinates (read-only after search) */}
            <div className="hidden">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={field.value?.toFixed(6)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        value={field.value?.toFixed(6)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="relative grid gap-4 md:grid-cols-2">
              {/* Payment Type Select */}
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_TYPES.map((payment) => (
                          <SelectItem key={payment} value={payment}>
                            {payment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type Select */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select restroom type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cleanliness Slider */}
            <FormField
              control={form.control}
              name="cleanliness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cleanliness: {field.value} ★</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Features Checkboxes */}
            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {ACCESSIBILITY_FEATURES.map((feature) => (
                      <FormField
                        key={feature}
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(feature)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, feature])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== feature
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {feature}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender Checkboxes */}
            <FormField
              control={form.control}
              name="gender"
              render={() => (
                <FormItem>
                  <FormLabel>Gender Options</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDER_OPTIONS.map((gender) => (
                      <FormField
                        key={gender}
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(gender)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, gender])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== gender
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {gender}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogChange}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRestroom;
