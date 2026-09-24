"use client";

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { IconButton, cn } from "@system-builder/ui-core";
import { StationIcon } from "@system-builder/ui-icons";

import {
  beginMove,
  beginResize,
  projectPointerGeometry,
  type WindowPointerSession,
} from "./pointer-adapter.js";
import type {
  WindowAction,
  WindowBounds,
  WindowDefinition,
  WindowGeometry,
  WindowInstance,
} from "./types.js";

export type WindowFrameProps = Readonly<{
  definition: WindowDefinition;
  instance: WindowInstance;
  bounds: WindowBounds;
  dispatch: (action: WindowAction) => void;
  children?: ReactNode;
}>;

function point(event: ReactPointerEvent<HTMLElement>) {
  return Object.freeze({ x: event.clientX, y: event.clientY });
}

export function WindowFrame({
  definition,
  instance,
  bounds,
  dispatch,
  children,
}: WindowFrameProps) {
  const [preview, setPreview] = useState<WindowGeometry | null>(null);
  const sessionRef = useRef<WindowPointerSession | null>(null);
  const geometry = preview ?? instance.geometry;

  const style = useMemo<CSSProperties>(
    () => ({
      position: "absolute",
      left: geometry.x,
      top: geometry.y,
      width: geometry.width,
      height: geometry.height,
      zIndex: instance.zOrder,
      display: instance.lifecycle === "OPEN" ? "flex" : "none",
      flexDirection: "column",
    }),
    [geometry, instance.lifecycle, instance.zOrder],
  );

  const beginSession = (
    event: ReactPointerEvent<HTMLElement>,
    session: WindowPointerSession,
  ) => {
    if (instance.lifecycle !== "OPEN" || instance.mode !== "NORMAL") return;

    event.currentTarget.setPointerCapture(event.pointerId);
    sessionRef.current = session;
    dispatch({ type: "FOCUS", windowRef: instance.windowRef });
  };

  const updateSession = (event: ReactPointerEvent<HTMLElement>) => {
    const session = sessionRef.current;
    if (session === null) return;

    setPreview(
      projectPointerGeometry(session, point(event), bounds, definition),
    );
  };

  const finishSession = (event: ReactPointerEvent<HTMLElement>) => {
    const session = sessionRef.current;
    if (session === null) return;

    const next = projectPointerGeometry(
      session,
      point(event),
      bounds,
      definition,
    );

    sessionRef.current = null;
    setPreview(null);

    dispatch({
      type: "SET_GEOMETRY",
      windowRef: instance.windowRef,
      geometry: next,
    });
  };

  if (instance.lifecycle !== "OPEN") return null;

  return (
    <section
      aria-label={definition.title}
      data-slot="window-frame"
      data-window-ref={instance.windowRef}
      data-window-mode={instance.mode}
      data-window-focused={instance.focused ? "true" : "false"}
      className={cn(
        "overflow-hidden bg-[var(--sb-window)] text-card-foreground",
        instance.mode === "MAXIMIZED"
          ? "rounded-none border-0 shadow-none"
          : instance.focused
            ? "rounded-xl border border-ring/55 shadow-2xl ring-1 ring-ring/30"
            : "rounded-xl border border-border/70 shadow-md",
      )}
      role="dialog"
      style={style}
      onPointerDown={() =>
        dispatch({ type: "FOCUS", windowRef: instance.windowRef })
      }
    >
      <header
        data-slot="window-titlebar"
        className={cn(
          "flex h-11 min-h-11 shrink-0 touch-none select-none items-center gap-2 border-b px-3",
          instance.focused
            ? "bg-[var(--sb-window-titlebar)] text-card-foreground"
            : "bg-muted/70 text-muted-foreground",
        )}
        onPointerDown={(event) =>
          beginSession(
            event,
            beginMove(point(event), geometry),
          )
        }
        onPointerMove={updateSession}
        onPointerUp={finishSession}
        onPointerCancel={() => {
          sessionRef.current = null;
          setPreview(null);
        }}
      >
        <StationIcon className="shrink-0" token={definition.icon} aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm font-medium leading-none">
          {definition.title}
        </span>

        <div
          className="flex shrink-0 items-center gap-1"
          data-slot="window-controls"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <IconButton
            label="Minimize window"
            variant="ghost"
            onClick={() =>
              dispatch({ type: "MINIMIZE", windowRef: instance.windowRef })
            }
          >
            <StationIcon token="window.minimize" />
          </IconButton>

          <IconButton
            label={instance.mode === "NORMAL" ? "Maximize window" : "Restore window"}
            variant="ghost"
            onClick={() =>
              dispatch({
                type: instance.mode === "NORMAL" ? "MAXIMIZE" : "RESTORE",
                windowRef: instance.windowRef,
              })
            }
          >
            <StationIcon token="window.maximize" />
          </IconButton>

          <IconButton
            label="Close window"
            variant="ghost"
            onClick={() =>
              dispatch({ type: "CLOSE", windowRef: instance.windowRef })
            }
          >
            <StationIcon token="window.close" />
          </IconButton>
        </div>
      </header>

      <div
        data-slot="window-content"
        className="min-h-0 min-w-0 flex-1 overflow-auto bg-card"
      >
        {children}
      </div>

      {definition.resizable && instance.mode === "NORMAL" ? (
        <>
          {[
            ["N", "absolute left-3 right-3 top-0 h-2 cursor-n-resize"],
            ["S", "absolute bottom-0 left-3 right-3 h-2 cursor-s-resize"],
            ["E", "absolute bottom-3 right-0 top-3 w-2 cursor-e-resize"],
            ["W", "absolute bottom-3 left-0 top-3 w-2 cursor-w-resize"],
            ["NE", "absolute right-0 top-0 size-3 cursor-ne-resize"],
            ["NW", "absolute left-0 top-0 size-3 cursor-nw-resize"],
            ["SE", "absolute bottom-0 right-0 size-3 cursor-se-resize"],
            ["SW", "absolute bottom-0 left-0 size-3 cursor-sw-resize"],
          ].map(([edge, className]) => (
            <div
              key={edge}
              aria-hidden="true"
              data-slot="window-resize-handle"
              data-resize-edge={edge}
              className={`${className} z-20 touch-none bg-transparent`}
              onPointerDown={(event) =>
                beginSession(
                  event,
                  beginResize(edge as import("./pointer-adapter.js").ResizeEdge, point(event), geometry),
                )
              }
              onPointerMove={updateSession}
              onPointerUp={finishSession}
              onPointerCancel={() => {
                sessionRef.current = null;
                setPreview(null);
              }}
            />
          ))}
        </>
      ) : null}
    </section>
  );
}
