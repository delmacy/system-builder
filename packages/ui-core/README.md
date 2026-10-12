# Station shared visual foundation

Source-owned public React API; imports go through `@system-builder/ui-core`. ADR-0017 uses shadcn open-code visual/design grammar (semantic themes, data-slot anatomy, restrained surfaces and keyboard/focus states). New native primitives are original SB implementations, not copied upstream files. No new headless provider dependency. React/Next/Tailwind versions remain pinned by the existing package lock.

Import `foundation.css` once at the Station host. Themes and comfortable/compact density inherit through the existing presentation boundary. Composition and WindowGeometry remain separate.

Construction B exports Label, Textarea, Checkbox, RadioGroup, Switch, Slider, NumberField, FieldDescription, FieldMessage, Alert, Progress, Skeleton and Card anatomy. Native input state uses normal checked/defaultChecked/value/defaultValue/onChange. Give every input an accessible name via Label/htmlFor, wrapping Label or aria-label; invalid controls also need a described message. These are presentation controls, never business validation/authority.

RadioGroup requires nonempty unique option values and a known selected/default value. Each unnamed group gets an independent native name; explicit names deliberately share a radio relationship and must be chosen by the caller. It supports controlled value/onValueChange and uncontrolled defaultValue. Native browser radio keyboard behavior is retained. NumberField emits finite numbers or undefined for empty/invalid numeric input; HTML min/max/step validity remains native. Slider is native range, not a custom multi-thumb contract.

Progress accepts optional value (absent = indeterminate); nonfinite, negative, overflow or nonpositive max rejects explicitly. Skeleton is decorative; the owning loading region supplies aria-busy/live meaning. Alert role defaults to alert for error, status otherwise; owner chooses timing and content. Card anatomy is source-owned and composable without introducing a second registry.

Status: implemented source/Lab controls; general editor insertion/Inspector properties/preview/codec/save-readback require Construction F qualification. Native Select is not Combobox. Avatar deferred pending actual use. Overlay/menu behavior and broad accessibility certification are separate gates. No full upstream parity claim.
