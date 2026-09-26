import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ComponentLabEditorProof } from "../../apps/station/web/app/component-lab-editor-proof";

afterEach(() => cleanup());

describe("Component Editor component surface", () => {
  it("keeps selection, draft, preview and discard synchronized", () => {
    render(<ComponentLabEditorProof />);

    expect(screen.getByRole("region", { name: "Component Editor" })).toBeTruthy();
    expect(screen.getByText("dirty:no")).toBeTruthy();
    expect(screen.getByText("validation:valid")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Toggle button-1 span" }));
    expect(screen.getByText("dirty:yes")).toBeTruthy();
    expect(screen.getByText("validation:valid")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Discard / reset" }));
    expect(screen.getByText("dirty:no")).toBeTruthy();
  });

  it("rejects an invalid mutation without corrupting the valid draft", () => {
    render(<ComponentLabEditorProof />);

    fireEvent.click(screen.getByRole("button", { name: "Prove invalid rejection" }));

    expect(screen.getByText(/Rejected safely:/)).toBeTruthy();
    expect(screen.getByText("validation:valid")).toBeTruthy();
    expect(screen.getByText("dirty:no")).toBeTruthy();
    expect(screen.getByText("preview:3")).toBeTruthy();
  });

  it("supports semantic layer selection and updates the inspector", () => {
    render(<ComponentLabEditorProof />);

    fireEvent.click(screen.getByRole("treeitem", { name: "Button 1" }));

    expect(screen.getByText("selection:layer:button-1")).toBeTruthy();
    expect(screen.getByText("button-1", { selector: "dd" })).toBeTruthy();
  });
});
