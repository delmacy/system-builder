import {
  Badge,
  Button,
  Input,
  Panel,
  Select,
  Separator,
  Toggle,
} from "../../../../packages/ui-core/index";

export default function StationFoundationPage() {
  return (
    <main className="min-h-screen bg-[var(--sb-desktop)] p-8">
      <Panel
        aria-labelledby="station-foundation-title"
        className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-between p-8"
      >
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <Badge>System Builder Station</Badge>
            <Badge className="bg-muted text-muted-foreground">Core: Disconnected</Badge>
          </div>

          <h1 id="station-foundation-title" className="text-4xl font-semibold tracking-tight">
            Visual foundation host
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            The Station shell now uses the SB-owned shadcn visual grammar. Canonical system state
            remains outside this presentation host.
          </p>

          <Separator className="my-8" />

          <div aria-label="UI core smoke surface" className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <label className="text-sm font-medium" htmlFor="station-search">
                Command/search field
              </label>
              <Input id="station-search" placeholder="Search Station…" />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium" htmlFor="station-theme">
                Theme preference
              </label>
              <Select id="station-theme" defaultValue="system">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          <div className="flex items-center gap-2">
            <Button>Open Station</Button>
            <Button variant="outline">Component Lab</Button>
          </div>
          <Toggle aria-label="Compact density demo">Compact density</Toggle>
        </div>
      </Panel>
    </main>
  );
}
