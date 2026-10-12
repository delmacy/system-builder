"use client";

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";
import { Dialog as ProviderDialog } from "@base-ui/react/dialog";
import { AlertDialog as ProviderAlertDialog } from "@base-ui/react/alert-dialog";
import { Popover as ProviderPopover } from "@base-ui/react/popover";
import { Tooltip as ProviderTooltip } from "@base-ui/react/tooltip";
import { Menu as ProviderMenu } from "@base-ui/react/menu";
import { ContextMenu as ProviderContextMenu } from "@base-ui/react/context-menu";
import { Menubar as ProviderMenubar } from "@base-ui/react/menubar";
import { Tabs as ProviderTabs } from "@base-ui/react/tabs";
import { Accordion as ProviderAccordion } from "@base-ui/react/accordion";
import { Collapsible as ProviderCollapsible } from "@base-ui/react/collapsible";

const PortalContainer = createContext<HTMLElement | null>(null);
/** Supply a theme/density-scoped host; provider retains body fallback outside Station. */
export function OverlayPortalProvider({ container, children }: { container: HTMLElement | null; children: ReactNode }) { return <PortalContainer.Provider value={container}>{children}</PortalContainer.Provider>; }

const control = "inline-flex items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";
const popup = "z-50 max-h-[80dvh] max-w-[calc(100vw-2rem)] overflow-auto rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg outline-none";
const item = "flex w-full items-center rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50";

export const Dialog = ProviderDialog.Root;
export function DialogTrigger(props: ComponentProps<typeof ProviderDialog.Trigger>) { return <ProviderDialog.Trigger data-slot="dialog-trigger" className={control} {...props} />; }
export function DialogClose(props: ComponentProps<typeof ProviderDialog.Close>) { return <ProviderDialog.Close data-slot="dialog-close" className={control} {...props} />; }
export function DialogTitle(props: ComponentProps<typeof ProviderDialog.Title>) { return <ProviderDialog.Title data-slot="dialog-title" className="text-lg font-semibold" {...props} />; }
export function DialogDescription(props: ComponentProps<typeof ProviderDialog.Description>) { return <ProviderDialog.Description data-slot="dialog-description" className="text-sm text-muted-foreground" {...props} />; }
export function DialogContent(props: ComponentProps<typeof ProviderDialog.Popup>) {
  return <ProviderDialog.Portal container={useContext(PortalContainer)}><ProviderDialog.Backdrop data-slot="dialog-backdrop" className="fixed inset-0 z-50 bg-black/40" /><ProviderDialog.Popup data-slot="dialog-content" className={`${popup} fixed left-1/2 top-1/2 w-[28rem] -translate-x-1/2 -translate-y-1/2 space-y-4`} {...props} /></ProviderDialog.Portal>;
}
export const AlertDialog = ProviderAlertDialog.Root;
export function AlertDialogTrigger(props: ComponentProps<typeof ProviderAlertDialog.Trigger>) { return <ProviderAlertDialog.Trigger data-slot="alert-dialog-trigger" className={control} {...props} />; }
export function AlertDialogClose(props: ComponentProps<typeof ProviderAlertDialog.Close>) { return <ProviderAlertDialog.Close data-slot="alert-dialog-close" className={control} {...props} />; }
export function AlertDialogTitle(props: ComponentProps<typeof ProviderAlertDialog.Title>) { return <ProviderAlertDialog.Title data-slot="alert-dialog-title" className="text-lg font-semibold" {...props} />; }
export function AlertDialogDescription(props: ComponentProps<typeof ProviderAlertDialog.Description>) { return <ProviderAlertDialog.Description data-slot="alert-dialog-description" className="text-sm text-muted-foreground" {...props} />; }
export function AlertDialogContent(props: ComponentProps<typeof ProviderAlertDialog.Popup>) {
  return <ProviderAlertDialog.Portal container={useContext(PortalContainer)}><ProviderAlertDialog.Backdrop data-slot="alert-dialog-backdrop" className="fixed inset-0 z-50 bg-black/40" /><ProviderAlertDialog.Popup data-slot="alert-dialog-content" className={`${popup} fixed left-1/2 top-1/2 w-[28rem] -translate-x-1/2 -translate-y-1/2 space-y-4`} {...props} /></ProviderAlertDialog.Portal>;
}
export const Popover = ProviderPopover.Root;
export function PopoverTrigger(props: ComponentProps<typeof ProviderPopover.Trigger>) { return <ProviderPopover.Trigger data-slot="popover-trigger" className={control} {...props} />; }
export function PopoverClose(props: ComponentProps<typeof ProviderPopover.Close>) { return <ProviderPopover.Close data-slot="popover-close" className={control} {...props} />; }
export function PopoverContent({ sideOffset = 6, ...props }: ComponentProps<typeof ProviderPopover.Popup> & { sideOffset?: number }) {
  return <ProviderPopover.Portal container={useContext(PortalContainer)}><ProviderPopover.Positioner sideOffset={sideOffset} className="z-50"><ProviderPopover.Popup data-slot="popover-content" className={popup} {...props} /></ProviderPopover.Positioner></ProviderPopover.Portal>;
}
export const AccessibleTooltipProvider = ProviderTooltip.Provider;
const TooltipDescription = createContext<string | undefined>(undefined);
export function AccessibleTooltip(props: ComponentProps<typeof ProviderTooltip.Root>) {
  const id = useId();
  return <TooltipDescription.Provider value={`sb-tooltip-${id}`}><ProviderTooltip.Root {...props} /></TooltipDescription.Provider>;
}
export function AccessibleTooltipTrigger(props: ComponentProps<typeof ProviderTooltip.Trigger>) {
  const id = useContext(TooltipDescription);
  const describedBy = [props["aria-describedby"], id].filter(Boolean).join(" ") || undefined;
  return <ProviderTooltip.Trigger data-slot="accessible-tooltip-trigger" className={control} {...props} aria-describedby={describedBy} />;
}
export function AccessibleTooltipContent(props: Omit<ComponentProps<typeof ProviderTooltip.Popup>, "id" | "role">) {
  const id = useContext(TooltipDescription);
  return <ProviderTooltip.Portal container={useContext(PortalContainer)}><ProviderTooltip.Positioner sideOffset={6} className="z-50"><ProviderTooltip.Popup data-slot="accessible-tooltip-content" className={popup} {...props} id={id} role="tooltip" /></ProviderTooltip.Positioner></ProviderTooltip.Portal>;
}
export const DropdownMenu = ProviderMenu.Root;
export function DropdownMenuTrigger(props: ComponentProps<typeof ProviderMenu.Trigger>) { return <ProviderMenu.Trigger data-slot="dropdown-menu-trigger" className={control} {...props} />; }
export function DropdownMenuContent(props: ComponentProps<typeof ProviderMenu.Popup>) {
  return <ProviderMenu.Portal container={useContext(PortalContainer)}><ProviderMenu.Positioner sideOffset={6} className="z-50"><ProviderMenu.Popup data-slot="dropdown-menu-content" className={`${popup} min-w-44 p-1`} {...props} /></ProviderMenu.Positioner></ProviderMenu.Portal>;
}
export function DropdownMenuItem(props: ComponentProps<typeof ProviderMenu.Item>) { return <ProviderMenu.Item data-slot="dropdown-menu-item" className={item} {...props} />; }
export const DropdownMenuSubmenu = ProviderMenu.SubmenuRoot;
export function DropdownMenuSubmenuTrigger(props: ComponentProps<typeof ProviderMenu.SubmenuTrigger>) { return <ProviderMenu.SubmenuTrigger data-slot="dropdown-menu-submenu-trigger" className={item} {...props} />; }
export function DropdownMenuSeparator(props: ComponentProps<typeof ProviderMenu.Separator>) { return <ProviderMenu.Separator data-slot="dropdown-menu-separator" className="my-1 h-px bg-border" {...props} />; }
export const ContextMenu = ProviderContextMenu.Root;
export function ContextMenuTrigger(props: ComponentProps<typeof ProviderContextMenu.Trigger>) { return <ProviderContextMenu.Trigger data-slot="context-menu-trigger" {...props} />; }
export function Menubar(props: ComponentProps<typeof ProviderMenubar>) { return <ProviderMenubar data-slot="menubar" className="flex flex-wrap gap-1 rounded-md border p-1" {...props} />; }
export const Tabs = ProviderTabs.Root;
export function TabsList(props: ComponentProps<typeof ProviderTabs.List>) { return <ProviderTabs.List data-slot="tabs-list" className="flex flex-wrap gap-1 rounded-md bg-muted p-1" {...props} />; }
export function TabsTrigger(props: ComponentProps<typeof ProviderTabs.Tab>) { return <ProviderTabs.Tab data-slot="tabs-trigger" className={`${control} border-transparent bg-transparent data-[active]:bg-background data-[active]:shadow-sm`} {...props} />; }
export function TabsContent(props: ComponentProps<typeof ProviderTabs.Panel>) { return <ProviderTabs.Panel data-slot="tabs-content" className="p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" {...props} />; }
export const Accordion = ProviderAccordion.Root;
export function AccordionItem(props: ComponentProps<typeof ProviderAccordion.Item>) { return <ProviderAccordion.Item data-slot="accordion-item" className="border-b" {...props} />; }
export function AccordionTrigger(props: ComponentProps<typeof ProviderAccordion.Trigger>) { return <ProviderAccordion.Header><ProviderAccordion.Trigger data-slot="accordion-trigger" className={`${control} w-full justify-between border-0`} {...props} /></ProviderAccordion.Header>; }
export function AccordionContent(props: ComponentProps<typeof ProviderAccordion.Panel>) { return <ProviderAccordion.Panel data-slot="accordion-content" className="px-3 pb-3 text-sm" {...props} />; }
export const Collapsible = ProviderCollapsible.Root;
export function CollapsibleTrigger(props: ComponentProps<typeof ProviderCollapsible.Trigger>) { return <ProviderCollapsible.Trigger data-slot="collapsible-trigger" className={control} {...props} />; }
export function CollapsibleContent(props: ComponentProps<typeof ProviderCollapsible.Panel>) { return <ProviderCollapsible.Panel data-slot="collapsible-content" className="p-3 text-sm" {...props} />; }
export function Breadcrumb({ children, ...props }: ComponentProps<"nav">) { return <nav aria-label="Breadcrumb" data-slot="breadcrumb" {...props}><ol className="flex flex-wrap items-center gap-2 text-sm">{children}</ol></nav>; }
export function BreadcrumbItem({ children }: { children: ReactNode }) { return <li data-slot="breadcrumb-item" className="inline-flex items-center gap-2">{children}</li>; }
export function BreadcrumbLink(props: ComponentProps<"a">) { return <a data-slot="breadcrumb-link" className="rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring" {...props} />; }
export function BreadcrumbPage(props: ComponentProps<"span">) { return <span data-slot="breadcrumb-page" aria-current="page" {...props} />; }
export function BreadcrumbSeparator() { return <li data-slot="breadcrumb-separator" aria-hidden="true">/</li>; }
