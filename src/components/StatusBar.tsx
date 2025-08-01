
import type { Doc, Id } from "@/lib/convex";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Notifications } from "./Notifications";
import clsx from "clsx";

import {
  ChevronDown,
  ChevronsRight,
  Menu,
  List,
  BarChart3,
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

type ConvexItem = Doc<"items"> & { uuid: Id<"items"> };
type ViewMode = "list" | "gantt";

interface StatusBarProps {
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (isOpen: boolean) => void;
  setIsMobileDrawerOpen: (isOpen: boolean) => void;
  lists: Array<{
    id: Id<"lists">;
    name: string;
    nodes: Array<ConvexItem>;
  }>;
  selectedListId: Id<"lists"> | null;
  listName: string;
  setListName: (name: string) => void;
  handleListNameChange: (name: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function StatusBar({
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
  setIsMobileDrawerOpen,
  lists,
  selectedListId,
  listName,
  setListName,
  handleListNameChange,
  viewMode,
  setViewMode,
}: StatusBarProps) {
  const { signOut } = useAuthActions();
  const selectedList = lists.find((list) => list.id === selectedListId);

  if (!selectedList) {
    return (
      <div className="w-full h-[10vh] p-3">
        <div className="rounded-b-2xl rounded-t-lg border-3">
          <div className="flex px-3 py-1 items-center">
            <p className="text-lg text-muted-foreground">No list selected.</p>
          </div>
        </div>
      </div>
    );
  }

  const nodes = selectedList.nodes;
  const total = nodes.length || 1;
  const redCount = nodes.filter((n) => n.state === "red").length;
  const yellowCount = nodes.filter((n) => n.state === "yellow").length;
  const greenCount = nodes.filter((n) => n.state === "green").length;
  const redPct = (redCount / total) * 100;
  const yellowPct = (yellowCount / total) * 100;
  const greenPct = (greenCount / total) * 100;

  return (
    <div className={clsx("w-full h-[10vh] p-3 transition-all duration-300")}>
      <div className="rounded-b-2xl rounded-t-lg border-3">
        <div className="flex px-3 py-1 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="mr-2 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {!isDesktopSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDesktopSidebarOpen(true)}
              className="mr-2 hidden md:block"
            >
              <ChevronsRight className="h-5 w-5" />
            </Button>
          )}
          <Input
            id="list-name-input"
            className="font-lora w-full text-xl px-0 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onBlur={(e) => handleListNameChange(e.target.value)}
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 500,
            }}
            autoComplete="off"
          />
          <div className="flex items-center">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "gantt" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("gantt")}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
          </div>
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="!ring-none !border-none !outline-none"
                size="icon"
                tabIndex={-1}
              >
                <ChevronDown className="w-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white p-3 rounded-lg">
              <DropdownMenuItem key="log-out" onClick={signOut}>
                log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex h-12 w-full">
          <div
            className="transition-all duration-100"
            style={{
              width: `${redPct}%`,
              backgroundColor: redCount > 0 ? "#ef4444" : "transparent",
              transition: "width 0.3s",
            }}
          />
          <div
            className="transition-all duration-100"
            style={{
              width: `${yellowPct}%`,
              backgroundColor: yellowCount > 0 ? "#fde047" : "transparent",
              transition: "width 0.3s",
            }}
          />
          <div
            className="transition-all duration-100"
            style={{
              width: `${greenPct}%`,
              backgroundColor: greenCount > 0 ? "#22c55e" : "transparent",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

