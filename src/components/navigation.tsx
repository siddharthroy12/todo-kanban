import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDownIcon,
  Squares2X2Icon,
  BellIcon,
  ChartBarSquareIcon,
  UserIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import { ForwardRefExoticComponent } from "react";
import { useLocation, Link } from "react-router-dom";
import { useGetTasks } from "@/hooks/useTasks";

type CountHintProps = {
  count: number;
  active?: boolean;
};

function CountHint({ count, active }: CountHintProps) {
  return (
    <Badge
      variant="outline"
      className={`h-5 w-5 place-content-center border-none rounded text-xs font-medium text-gray-500 transition-colors duration-200 lg:grid ${
        active ? "bg-primary text-primary-foreground" : "bg-accent"
      }`}
    >
      {count}
    </Badge>
  );
}

type NavigationButtonProps = {
  text: string;
  icon: ForwardRefExoticComponent<any>;
  count?: number;
  link: string;
};

function NavigationButton({ text, icon, count, link }: NavigationButtonProps) {
  const Icon = icon;
  const location = useLocation();

  // Check if user is on the page or not
  let active = false;
  if (link === "/") {
    active = location.pathname === link;
  } else {
    active = location.pathname.includes(link);
  }

  return (
    <Button
      variant="ghost"
      className={`w-full justify-between py-5 ${active ? "bg-accent" : ""}`}
      asChild
    >
      <Link to={link}>
        <div className="flex gap-2">
          <Icon className="w-[20px]" />
          {text}
        </div>
        {count !== undefined ? (
          <CountHint count={count} active={active} />
        ) : null}
      </Link>
    </Button>
  );
}

export function Navigation() {
  const { data: tasks } = useGetTasks(1);
  return (
    <div className="p-3 py-6 w-64 flex flex-col justify-between h-full">
      <div>
        {/* Company button */}
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex gap-2">
            <div className="w-[20px] h-[20px] bg-primary rounded-sm" />
            Company
          </div>
          <ChevronDownIcon className="w-[18px] text-muted-foreground" />
        </Button>
        {/* Tabs */}
        <div className="mt-5 gap-1 flex flex-col">
          <NavigationButton
            text="Tasks"
            icon={Squares2X2Icon}
            link="/"
            count={tasks?.length}
          />
          <NavigationButton
            text="Notifications"
            icon={BellIcon}
            link="/notifications"
            count={3}
          />
          <NavigationButton
            text="Analytics"
            icon={ChartBarSquareIcon}
            link="/analytics"
            count={3}
          />
          <NavigationButton
            text="Team"
            icon={UserIcon}
            link="/team"
            count={3}
          />
        </div>
      </div>
      <NavigationButton text="Settings" icon={Cog8ToothIcon} link="/settings" />
    </div>
  );
}
