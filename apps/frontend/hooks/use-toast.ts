"use client";

import * as React from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000;

type ToastVariant = "default" | "destructive";

export type ToastProps = {
  description?: string;
  id: string;
  open: boolean;
  title: string;
  variant?: ToastVariant;
};

type Toast = Omit<ToastProps, "id" | "open"> & {
  id?: string;
};

type State = {
  toasts: ToastProps[];
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      toast: ToastProps;
      type: typeof actionTypes.ADD_TOAST;
    }
  | {
      toastId?: ToastProps["id"];
      type: typeof actionTypes.DISMISS_TOAST;
    }
  | {
      toastId?: ToastProps["id"];
      type: typeof actionTypes.REMOVE_TOAST;
    };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      toastId,
      type: actionTypes.REMOVE_TOAST,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        for (const toast of state.toasts) {
          addToRemoveQueue(toast.id);
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? {
                ...toast,
                open: false,
              }
            : toast,
        ),
      };
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  for (const listener of listeners) {
    listener(memoryState);
  }
}

type ToastCall = Omit<Toast, "id">;

function toast({ ...props }: ToastCall) {
  const id = genId();

  const update = (nextProps: Toast) =>
    dispatch({
      toast: { ...nextProps, id, open: true, title: nextProps.title ?? props.title },
      type: actionTypes.ADD_TOAST,
    });
  const dismiss = () => dispatch({ toastId: id, type: actionTypes.DISMISS_TOAST });

  dispatch({
    toast: {
      ...props,
      id,
      open: true,
      variant: props.variant ?? "default",
    },
    type: actionTypes.ADD_TOAST,
  });

  return {
    dismiss,
    id,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    dismiss: (toastId?: string) =>
      dispatch({ toastId, type: actionTypes.DISMISS_TOAST }),
    toast,
  };
}

export { toast, useToast };
