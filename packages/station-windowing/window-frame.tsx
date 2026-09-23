"use client";

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { IconButton } from "@system-builder/ui-core";
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
      className="overflow-hidden rounded-xl border bg-[var(--sb-window)] text-card-foreground shadow-xl"
      role="dialog"
      style={style}
      onPointerDown={() =>
        dispatch({ type: "FOCUS", windowRef: instance.windowRef })
      }
    >
      <header
        data-slot="window-titlebar"
        className="flex h-10 shrink-0 select-none items-center gap-2 border-b bg-[var(--sb-window-titlebar)] px-2"
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
        <StationIcon token={definition.icon} aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {definition.title}
        </span>

        <div
          className="flex items-center gap-1"
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
        <button
          aria-label="Resize window"
          data-slot="window-resize-handle"
          className="absolute bottom-0 right-0 size-4 cursor-se-resize touch-none bg-transparent"
          type="button"
          onPointerDown={(event) =>
            beginSession(
              event,
              beginResize("SE", point(event), geometry),
            )
          }
          onPointerMove={updateSession}
          onPointerUp={finishSession}
          onPointerCancel={() => {
            sessionRef.current = null;
            setPreview(null);
          }}
        />
      ) : null}
    </section>
  );
}
