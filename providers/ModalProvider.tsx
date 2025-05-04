"use client";

import ViewReviewsDrawer from "@/components/drawers/view-reviews-drawer";
import CreateRestroom from "@/components/modals/create-restroom-modal";

const ModalProvider = () => {
  return (
    <>
      <CreateRestroom />
      <ViewReviewsDrawer />
    </>
  );
};

export default ModalProvider;
