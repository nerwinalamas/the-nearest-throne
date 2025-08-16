import AppLogo from "@/components/app-logo";
import Filters from "@/components/filters";
import UserDropdownMenu from "@/components/user-dropdown-menu";

const Sidebar = () => {
  return (
    <div className="p-4 min-w-80 xl:flex xl:flex-col xl:h-full">
      <div className="xl:space-y-4">
        <AppLogo />
        <Filters />
      </div>

      <div className="hidden xl:block xl:mt-auto">
        <UserDropdownMenu />
      </div>
    </div>
  );
};

export default Sidebar;
