"use client";

import { useCallback, useEffect, useMemo } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * The subset of `UseFormReturn` this hook actually needs. Any
 * `UseFormReturn<TFieldValues>` satisfies this, but callers can also pass a
 * narrower object (e.g. from a wrapper hook) as long as it has these three.
 */
export type DirtyStateForm<TFieldValues extends FieldValues> = Pick<
  UseFormReturn<TFieldValues>,
  "formState" | "getValues" | "reset"
>;

export interface UseDirtyStateOptions {
  /**
   * Whether to warn the user with a native "leave site?" prompt when closing
   * or reloading the tab while there are unsaved changes. Defaults to true.
   */
  confirmOnUnload?: boolean;
}

export interface UseDirtyStateResult {
  /** Whether the form currently differs from its last-saved (default) values. */
  isDirty: boolean;
  /** Number of individual fields that are currently dirty. */
  dirtyCount: number;
  /** Resets the form back to its last-saved values, clearing the dirty state. */
  discard: () => void;
}

/**
 * Generic "unsaved changes" tracking for a react-hook-form instance. Backs
 * the floating save-bar on /profile (and anywhere else with the same
 * pattern): it doesn't reimplement dirty-tracking, it just reads RHF's own
 * `formState.isDirty` / `formState.dirtyFields`, wires up a `beforeunload`
 * warning while dirty, and exposes a `discard()` shortcut.
 *
 * In-app navigation guards (e.g. confirming before switching the `?s=`
 * section query param) are the caller's responsibility — read `isDirty` /
 * `dirtyCount` before navigating and show your own confirm UI.
 */
export function useDirtyState<TFieldValues extends FieldValues>(
  form: DirtyStateForm<TFieldValues>,
  options?: UseDirtyStateOptions,
): UseDirtyStateResult {
  const confirmOnUnload = options?.confirmOnUnload ?? true;
  const { formState, reset } = form;
  const { isDirty, dirtyFields } = formState;

  const dirtyCount = useMemo(() => countDirtyFields(dirtyFields), [dirtyFields]);

  useEffect(() => {
    if (!confirmOnUnload || !isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      // Chrome requires `returnValue` to be set for the native prompt to show.
      event.returnValue = "";
      return "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [confirmOnUnload, isDirty]);

  const discard = useCallback(() => {
    // Resetting with no arguments returns the form to the defaultValues that
    // were last passed to `reset()` (i.e. the last-saved server state).
    reset();
  }, [reset]);

  return { isDirty, dirtyCount, discard };
}

/** Recursively counts the `true` leaves in RHF's `dirtyFields` tree. */
function countDirtyFields(dirtyFields: object): number {
  let count = 0;

  function walk(node: unknown): void {
    if (node === true) {
      count += 1;
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object") {
      Object.values(node).forEach(walk);
    }
  }

  walk(dirtyFields);
  return count;
}
