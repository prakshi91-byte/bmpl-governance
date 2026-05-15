import { Q as reactExports, H as jsxRuntimeExports, a as React$1 } from "./server-BGeP2W0b.mjs";
import { g as Route$7, y as useUIStore, R as ROLE_PERMS, s as repo, w as useRightPanel, a as Link, d as Plus, k as Search, L as Layers, n as cn, o as createLucideIcon, m as clsx } from "./router-Dwu8MerC.mjs";
import { P as PageHeader, C as ChevronRight } from "./PageHeader-D4xhBVAX.mjs";
import { a as StatusBadge, S as StandardizationBadge } from "./Badges-CxMpVJX7.mjs";
import { C as Check } from "./check-YAhLmVs-.mjs";
import { X } from "./x-DUAiniXO.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
var use = React$1[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot$1(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone$1(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable$1);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot$1("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone$1(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef$2(children);
      const props2 = mergeProps$1(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER$1 = /* @__PURE__ */ Symbol("radix.slottable");
function isSlottable$1(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER$1;
}
function mergeProps$1(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef$2(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}
var useLayoutEffect2 = globalThis?.document ? reactExports.useLayoutEffect : () => {
};
var useInsertionEffect = React$1[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  {
    const isControlledRef = reactExports.useRef(prop !== void 0);
    reactExports.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = reactExports.useCallback(
    (nextValue) => {
      if (isControlled) {
        const value2 = isFunction$1(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          onChangeRef.current?.(value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = reactExports.useState(defaultProp);
  const prevValueRef = reactExports.useRef(value);
  const onChangeRef = reactExports.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  reactExports.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction$1(value) {
  return typeof value === "function";
}
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
function useSize(element) {
  const [size, setSize] = reactExports.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : reactExports.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef$1(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? reactExports.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = reactExports.useState();
  const stylesRef = reactExports.useRef(null);
  const prevPresentRef = reactExports.useRef(present);
  const prevAnimationNameRef = reactExports.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  reactExports.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: reactExports.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef$1(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = /* @__PURE__ */ Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot2 = /* @__PURE__ */ createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot2 : node;
    if (typeof window !== "undefined") {
      window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control?.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
const TABS = ["Business Templates", "Direct Templates", "Complete Scope", "Coverage"];
function ProjectDetail() {
  const {
    project
  } = Route$7.useLoaderData();
  const role = useUIStore((state) => state.currentRole);
  const isAdmin = ROLE_PERMS[role].canAdmin;
  const [tab, setTab] = reactExports.useState("Business Templates");
  const [version, setVersion] = reactExports.useState(0);
  const scope = reactExports.useMemo(() => repo.scopeOfProject(project.id), [project.id, version]);
  const bts = scope.filter((s) => s.businessTemplateId).map((s) => repo.businessTemplate(s.businessTemplateId)).filter(Boolean);
  const tpls = scope.filter((s) => s.templateId).map((s) => repo.template(s.templateId)).filter(Boolean);
  const completeTemplates = reactExports.useMemo(() => getCompleteScopeTemplates(bts, tpls), [bts, tpls]);
  const intent = project.status === "Closed" ? "neutral" : project.status === "At Risk" ? "danger" : project.status === "Planning" ? "info" : "success";
  useRightPanel(/* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Project" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: project.id }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: project.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: project.status, intent }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-[12px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Business Tpls", value: bts.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Scope Tpls", value: completeTemplates.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Manager", value: project.manager }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Code", value: project.code })
    ] })
  ] }), [project.id, version]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-primary", children: project.code }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: project.name })
    ] }), breadcrumbs: [{
      label: "Rollout"
    }, {
      label: "Projects",
      to: "/projects"
    }, {
      label: project.code
    }], meta: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: project.status, intent }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Manager ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: project.manager })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num", children: [
        project.startDate,
        " → ",
        project.endDate
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t), className: "relative h-9 px-3 text-[12.5px] font-medium " + (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"), children: [
      t,
      tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" })
    ] }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thin-scrollbar flex-1 overflow-y-auto p-5", children: [
      tab === "Business Templates" && /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessTemplateScope, { assigned: bts, directTemplates: tpls, projectId: project.id, isAdmin, onSaved: () => setVersion((value) => value + 1) }),
      tab === "Direct Templates" && /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "grid gap-1 lg:grid-cols-2", children: [
        tpls.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/templates/$templateId", params: {
          templateId: String(t.id)
        }, className: "flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: t.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: t.standard, className: "ml-auto" })
        ] }) }, t.id)),
        tpls.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-[13px] text-muted-foreground", children: "No direct templates assigned." })
      ] }),
      tab === "Coverage" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface p-4 text-[13px] text-muted-foreground", children: [
        "Project covers ",
        completeTemplates.length,
        " scope items across ",
        repo.entities().length,
        " business entities. See the",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/coverage", className: "ml-1 text-primary hover:underline", children: "Coverage Map" }),
        " for a global view."
      ] }),
      tab === "Complete Scope" && /* @__PURE__ */ jsxRuntimeExports.jsx(CompleteScope, { projectCode: project.code, templates: completeTemplates })
    ] })
  ] });
}
function getCompleteScopeTemplates(businessTemplates, directTemplates) {
  const directIds = new Set(directTemplates.map((template) => template.id));
  const btTemplateIds = /* @__PURE__ */ new Set();
  for (const bt of businessTemplates) {
    for (const template of repo.templatesOfBT(bt.id)) btTemplateIds.add(template.id);
  }
  const directHasBusinessTemplateTemplate = Array.from(directIds).some((id) => btTemplateIds.has(id));
  const ids = directHasBusinessTemplateTemplate || businessTemplates.length === 0 ? directIds : /* @__PURE__ */ new Set([...btTemplateIds, ...directIds]);
  return Array.from(ids).map((id) => repo.template(id)).filter((template) => Boolean(template)).sort((a, b) => a.id - b.id);
}
function CompleteScope({
  projectCode,
  templates
}) {
  const tree = reactExports.useMemo(() => buildCompleteScopeTree(templates), [templates]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] font-semibold", children: "Complete scope" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] text-muted-foreground", children: [
          templates.length,
          " selected capability template",
          templates.length === 1 ? "" : "s",
          " shown in BPML hierarchy."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", disabled: templates.length === 0, onClick: () => downloadCompleteScope(projectCode, tree), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }),
        " Excel"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border bg-surface", children: tree.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-12 text-center text-[13px] text-muted-foreground", children: "No capability templates are in scope." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thin-scrollbar max-h-[calc(100vh-260px)] overflow-auto", children: tree.map((domain) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/70", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchyHeader, { depth: 0, code: domain.id, name: domain.name, count: domain.templateCount }),
      domain.areas.map((area) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchyHeader, { depth: 1, code: area.id, name: area.name, count: area.templateCount }),
        area.processes.map((process) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchyHeader, { depth: 2, code: process.id, name: process.name, count: process.templateCount }),
          process.capabilities.map((capability) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchyHeader, { depth: 3, code: capability.id, name: capability.name, count: capability.templates.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50", children: capability.templates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/templates/$templateId", params: {
              templateId: String(template.id)
            }, className: "grid grid-cols-[88px_1fr_auto] items-center gap-3 border-b border-border/40 py-2 pl-[112px] pr-3 text-[13px] hover:bg-surface-hover", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: template.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: template.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: template.standard })
            ] }, template.id)) })
          ] }, capability.id))
        ] }, process.id))
      ] }, area.id))
    ] }, domain.id)) }) })
  ] });
}
function HierarchyHeader({
  depth,
  code,
  name,
  count
}) {
  const padding = 12 + depth * 24;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border/40 bg-surface-2/70 py-2 pr-3 text-[13px]", style: {
    paddingLeft: padding
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5 text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num min-w-[88px] text-[11px] text-muted-foreground", children: code }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate font-medium", children: name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground", children: count })
  ] });
}
function buildCompleteScopeTree(templates) {
  const templateIds = new Set(templates.map((template) => template.id));
  const templateById = new Map(templates.map((template) => [template.id, template]));
  const capabilityTemplates = /* @__PURE__ */ new Map();
  for (const template of templates) {
    for (const capability of repo.capabilitiesOfTemplate(template.id)) {
      if (!templateIds.has(template.id)) continue;
      const rows = capabilityTemplates.get(capability.id) ?? [];
      rows.push(template);
      capabilityTemplates.set(capability.id, rows);
    }
  }
  for (const [capabilityId, rows] of capabilityTemplates) {
    const seen = /* @__PURE__ */ new Set();
    capabilityTemplates.set(capabilityId, rows.filter((template) => {
      if (seen.has(template.id)) return false;
      seen.add(template.id);
      return true;
    }).sort((a, b) => a.id - b.id));
  }
  const domains = [];
  for (const domain of repo.domains()) {
    const areas = [];
    for (const area of repo.areasOf(domain.id)) {
      const processes = [];
      for (const process of repo.processesOf(area.id)) {
        const capabilities = [];
        for (const capability of repo.capabilitiesOf(process.id)) {
          const scopedTemplates = capabilityTemplates.get(capability.id) ?? [];
          if (scopedTemplates.length === 0) continue;
          capabilities.push({
            ...capability,
            templates: scopedTemplates
          });
        }
        if (capabilities.length === 0) continue;
        processes.push({
          ...process,
          capabilities,
          templateCount: capabilities.reduce((sum, capability) => sum + capability.templates.length, 0)
        });
      }
      if (processes.length === 0) continue;
      areas.push({
        ...area,
        processes,
        templateCount: processes.reduce((sum, process) => sum + process.templateCount, 0)
      });
    }
    if (areas.length === 0) continue;
    domains.push({
      ...domain,
      areas,
      templateCount: areas.reduce((sum, area) => sum + area.templateCount, 0)
    });
  }
  const assignedCapabilityTemplateIds = /* @__PURE__ */ new Set();
  for (const rows of capabilityTemplates.values()) {
    for (const template of rows) assignedCapabilityTemplateIds.add(template.id);
  }
  const unassignedTemplates = Array.from(templateIds).filter((id) => !assignedCapabilityTemplateIds.has(id)).map((id) => templateById.get(id)).filter((template) => Boolean(template));
  if (unassignedTemplates.length > 0) {
    domains.push({
      id: "UNASSIGNED",
      name: "Templates without BPML capability links",
      itDomain: "",
      itService: "",
      templateCount: unassignedTemplates.length,
      areas: [{
        id: "UNASSIGNED",
        name: "Unassigned",
        processDomainId: "UNASSIGNED",
        templateCount: unassignedTemplates.length,
        processes: [{
          id: "UNASSIGNED",
          name: "Unassigned",
          processAreaId: "UNASSIGNED",
          processDomainId: "UNASSIGNED",
          owner: "",
          capabilityCount: 1,
          templateCount: unassignedTemplates.length,
          status: "",
          capabilities: [{
            id: "UNASSIGNED",
            name: "No mapped capability",
            processId: "UNASSIGNED",
            processAreaId: "UNASSIGNED",
            processDomainId: "UNASSIGNED",
            status: "",
            templateCount: unassignedTemplates.length,
            templates: unassignedTemplates
          }]
        }]
      }]
    });
  }
  return domains;
}
function downloadCompleteScope(projectCode, tree) {
  const rows = tree.flatMap((domain) => domain.areas.flatMap((area) => area.processes.flatMap((process) => process.capabilities.flatMap((capability) => capability.templates.map((template) => ({
    domainId: domain.id,
    domainName: domain.name,
    areaId: area.id,
    areaName: area.name,
    processId: process.id,
    processName: process.name,
    capabilityId: capability.id,
    capabilityName: capability.name,
    templateId: template.id,
    templateName: template.name,
    standard: template.standard,
    stepCount: template.stepCount
  }))))));
  const header = ["Domain ID", "Domain", "Area ID", "Area", "Process ID", "Process", "Capability ID", "Capability", "Template ID", "Capability Template", "Standardization", "Steps"];
  const worksheetRows = [header, ...rows.map((row) => [row.domainId, row.domainName, row.areaId, row.areaName, row.processId, row.processName, row.capabilityId, row.capabilityName, row.templateId, row.templateName, row.standard, row.stepCount])];
  const blob = createXlsxWorkbook(worksheetRows);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${projectCode}-complete-scope.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
function createXlsxWorkbook(rows) {
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${rows.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => {
    const cellRef = `${xlsxColumnName(columnIndex)}${rowIndex + 1}`;
    return `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
  }).join("")}</row>`).join("")}
  </sheetData>
</worksheet>`;
  const files = [{
    path: "[Content_Types].xml",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
  }, {
    path: "_rels/.rels",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  }, {
    path: "xl/workbook.xml",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Complete Scope" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
  }, {
    path: "xl/_rels/workbook.xml.rels",
    content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
  }, {
    path: "xl/worksheets/sheet1.xml",
    content: sheet
  }];
  return new Blob([zipFiles(files)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}
function xlsxColumnName(index) {
  let name = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}
function escapeXml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function zipFiles(files) {
  const encoder = new TextEncoder();
  const parts = [];
  const centralDirectory = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.path);
    const data = encoder.encode(file.content);
    const crc = crc32(data);
    const localHeader = createZipHeader(67324752, name, data, crc, offset);
    parts.push(localHeader, data);
    centralDirectory.push(createZipHeader(33639248, name, data, crc, offset));
    offset += localHeader.length + data.length;
  }
  const centralDirectoryOffset = offset;
  const centralDirectorySize = centralDirectory.reduce((sum, item) => sum + item.length, 0);
  parts.push(...centralDirectory, createEndOfCentralDirectory(files.length, centralDirectorySize, centralDirectoryOffset));
  return new Blob(parts);
}
function createZipHeader(signature, name, data, crc, offset) {
  const isCentral = signature === 33639248;
  const size = isCentral ? 46 + name.length : 30 + name.length;
  const header = new Uint8Array(size);
  const view = new DataView(header.buffer);
  view.setUint32(0, signature, true);
  if (isCentral) {
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(28, name.length, true);
    view.setUint32(42, offset, true);
    header.set(name, 46);
  } else {
    view.setUint16(4, 20, true);
    view.setUint16(26, name.length, true);
    header.set(name, 30);
  }
  const base = isCentral ? 8 : 6;
  view.setUint16(base, 0, true);
  view.setUint16(base + 2, 0, true);
  view.setUint16(base + 4, 0, true);
  view.setUint16(base + 6, 0, true);
  view.setUint32(base + 8, crc, true);
  view.setUint32(base + 12, data.length, true);
  view.setUint32(base + 16, data.length, true);
  return header;
}
function createEndOfCentralDirectory(fileCount, centralDirectorySize, centralDirectoryOffset) {
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint32(0, 101010256, true);
  view.setUint16(8, fileCount, true);
  view.setUint16(10, fileCount, true);
  view.setUint32(12, centralDirectorySize, true);
  view.setUint32(16, centralDirectoryOffset, true);
  return header;
}
function crc32(data) {
  let crc = 4294967295;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = crc >>> 1 ^ 3988292384 & -(crc & 1);
    }
  }
  return (crc ^ 4294967295) >>> 0;
}
function BusinessTemplateScope({
  assigned,
  directTemplates,
  projectId,
  isAdmin,
  onSaved
}) {
  const [editing, setEditing] = reactExports.useState(false);
  const [query, setQuery] = reactExports.useState("");
  const [level, setLevel] = reactExports.useState("__all");
  const [selected, setSelected] = reactExports.useState(() => new Set(assigned.map((bt) => bt.id)));
  const [selectedTemplates, setSelectedTemplates] = reactExports.useState(() => new Set(directTemplates.map((template) => template.id)));
  const [capabilityQuery, setCapabilityQuery] = reactExports.useState("");
  const [domainId, setDomainId] = reactExports.useState("__all");
  const [areaId, setAreaId] = reactExports.useState("__all");
  const [processId, setProcessId] = reactExports.useState("__all");
  const [lastAddedCapabilityId, setLastAddedCapabilityId] = reactExports.useState(null);
  const assignedIds = reactExports.useMemo(() => new Set(assigned.map((bt) => bt.id)), [assigned]);
  const levels = reactExports.useMemo(() => Array.from(new Set(repo.businessTemplates().map((bt) => bt.level))), []);
  const selectedBusinessTemplates = reactExports.useMemo(() => repo.businessTemplates().filter((bt) => selected.has(bt.id)), [selected]);
  const businessTemplateTemplateIds = reactExports.useMemo(() => {
    const ids = /* @__PURE__ */ new Set();
    for (const bt of selectedBusinessTemplates) {
      for (const template of repo.templatesOfBT(bt.id)) ids.add(template.id);
    }
    return ids;
  }, [selectedBusinessTemplates]);
  const scopedTemplates = reactExports.useMemo(() => Array.from(/* @__PURE__ */ new Set([...businessTemplateTemplateIds, ...selectedTemplates])).map((id) => repo.template(id)).filter((template) => Boolean(template)).sort((a, b) => a.id - b.id), [businessTemplateTemplateIds, selectedTemplates]);
  const areas = reactExports.useMemo(() => domainId === "__all" ? repo.areas() : repo.areasOf(domainId), [domainId]);
  const processes = reactExports.useMemo(() => areaId === "__all" ? repo.processes() : repo.processesOf(areaId), [areaId]);
  const capabilities = reactExports.useMemo(() => {
    const q = capabilityQuery.trim().toLowerCase();
    return repo.capabilities().filter((capability) => {
      if (domainId !== "__all" && capability.processDomainId !== domainId) return false;
      if (areaId !== "__all" && capability.processAreaId !== areaId) return false;
      if (processId !== "__all" && capability.processId !== processId) return false;
      if (!q) return true;
      return capability.id.toLowerCase().includes(q) || capability.name.toLowerCase().includes(q);
    }).slice(0, 60);
  }, [areaId, capabilityQuery, domainId, processId]);
  const visibleTemplates = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    return repo.businessTemplates().filter((bt) => {
      if (level !== "__all" && bt.level !== level) return false;
      if (!q) return true;
      return bt.id.toLowerCase().includes(q) || bt.name.toLowerCase().includes(q) || bt.productGroup.toLowerCase().includes(q) || bt.geoScope.toLowerCase().includes(q);
    });
  }, [level, query]);
  function startEditing() {
    setSelected(new Set(assignedIds));
    const initialTemplates = new Set(directTemplates.map((template) => template.id));
    for (const bt of assigned) {
      for (const template of repo.templatesOfBT(bt.id)) initialTemplates.add(template.id);
    }
    setSelectedTemplates(initialTemplates);
    setEditing(true);
  }
  function toggleBusinessTemplate(id) {
    setSelected((current) => {
      const next = new Set(current);
      const isRemoving = next.has(id);
      if (isRemoving) next.delete(id);
      else next.add(id);
      setSelectedTemplates((templates) => {
        const scoped = new Set(templates);
        const changedTemplateIds = repo.templatesOfBT(id).map((template) => template.id);
        if (!isRemoving) {
          for (const templateId of changedTemplateIds) scoped.add(templateId);
          return scoped;
        }
        const remainingBusinessTemplateIds = Array.from(next);
        for (const templateId of changedTemplateIds) {
          const stillIncluded = remainingBusinessTemplateIds.some((btId) => repo.templatesOfBT(btId).some((template) => template.id === templateId));
          if (!stillIncluded) scoped.delete(templateId);
        }
        return scoped;
      });
      return next;
    });
  }
  function toggleTemplate(templateId) {
    setSelectedTemplates((current) => {
      const next = new Set(current);
      if (next.has(templateId)) next.delete(templateId);
      else next.add(templateId);
      return next;
    });
  }
  function addCapabilityTemplates(capabilityId) {
    const templates = repo.templatesOf(capabilityId);
    setSelectedTemplates((current) => {
      const next = new Set(current);
      for (const template of templates) next.add(template.id);
      return next;
    });
    setLastAddedCapabilityId(capabilityId);
  }
  function saveScope() {
    repo.setProjectScope(projectId, Array.from(selected).sort(), Array.from(selectedTemplates).sort((a, b) => a - b));
    setEditing(false);
    onSaved();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] font-semibold", children: "Business template scope" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] text-muted-foreground", children: [
          assigned.length,
          " rollout package",
          assigned.length === 1 ? "" : "s",
          " assigned to this project."
        ] })
      ] }),
      !isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11.5px] text-muted-foreground", children: "Read-only — admin role required to scope templates." }) : editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setEditing(false), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }),
          " Cancel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", size: "sm", onClick: saveScope, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
          " Save scope"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", size: "sm", onClick: startEditing, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
        " Scope templates"
      ] })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[260px] flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search business templates...", className: "h-8 w-full rounded-md border border-input bg-background pl-7 pr-3 text-[12.5px] outline-none focus:ring-1 focus:ring-ring" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: level, onChange: (event) => setLevel(event.target.value), className: "h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "__all", children: "All levels" }),
            levels.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item }, item))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num ml-auto text-[12px] text-muted-foreground", children: [
            selected.size,
            " selected"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thin-scrollbar max-h-[360px] overflow-auto", children: [
          visibleTemplates.map((bt) => {
            const checked = selected.has(bt.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => toggleBusinessTemplate(bt.id), className: "grid w-full cursor-pointer grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-border/60 px-3 py-2 text-left text-[13px] hover:bg-surface-hover", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked, onCheckedChange: () => toggleBusinessTemplate(bt.id), onClick: (event) => event.stopPropagation() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: bt.id }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: bt.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-muted-foreground", children: bt.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: bt.productGroup, intent: "neutral" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11.5px] text-muted-foreground", children: bt.geoScope })
            ] }, bt.id);
          }),
          visibleTemplates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-10 text-center text-[13px] text-muted-foreground", children: "No business templates match this filter." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-border bg-surface-2 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12.5px] font-semibold", children: "Capability templates in scope" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11.5px] text-muted-foreground", children: "Business-template templates are selected by default." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num text-[12px] text-muted-foreground", children: [
              selectedTemplates.size,
              " selected"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thin-scrollbar max-h-[300px] overflow-auto", children: [
            scopedTemplates.map((template) => {
              const fromBusinessTemplate = businessTemplateTemplateIds.has(template.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => toggleTemplate(template.id), className: "grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border/60 px-3 py-2 text-[13px] hover:bg-surface-hover", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selectedTemplates.has(template.id), onCheckedChange: () => toggleTemplate(template.id), onClick: (event) => event.stopPropagation() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: template.id }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: template.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-0.5 flex items-center gap-2 text-[11.5px] text-muted-foreground", children: [
                    fromBusinessTemplate ? "From selected business template" : "Added from BPML tree",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      template.stepCount,
                      " steps"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: template.standard })
              ] }, template.id);
            }),
            scopedTemplates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-10 text-center text-[13px] text-muted-foreground", children: "Select business templates or add capabilities from the BPML tree." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12.5px] font-semibold", children: "Add from BPML tree" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11.5px] text-muted-foreground", children: "Pick a capability to add all its capability templates." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 border-b border-border/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 md:grid-cols-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: domainId, onChange: (event) => {
                setDomainId(event.target.value);
                setAreaId("__all");
                setProcessId("__all");
              }, className: "h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "__all", children: "All domains" }),
                repo.domains().map((domain) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: domain.id, children: domain.id }, domain.id))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: areaId, onChange: (event) => {
                setAreaId(event.target.value);
                setProcessId("__all");
              }, className: "h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "__all", children: "All areas" }),
                areas.map((area) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: area.id, children: area.name }, area.id))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: processId, onChange: (event) => setProcessId(event.target.value), className: "h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "__all", children: "All processes" }),
                processes.map((process) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: process.id, children: process.name }, process.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: capabilityQuery, onChange: (event) => setCapabilityQuery(event.target.value), placeholder: "Search capabilities...", className: "h-8 w-full rounded-md border border-input bg-background pl-7 pr-3 text-[12.5px] outline-none focus:ring-1 focus:ring-ring" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thin-scrollbar max-h-[260px] overflow-auto", children: [
            capabilities.map((capability) => {
              const templateCount = repo.templatesOf(capability.id).length;
              const allTemplatesAdded = templateCount > 0 && repo.templatesOf(capability.id).every((template) => selectedTemplates.has(template.id));
              const justAdded = lastAddedCapabilityId === capability.id && allTemplatesAdded;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/60 px-3 py-2 text-[13px] transition-colors " + (justAdded ? "bg-primary-soft" : ""), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: capability.id }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: capability.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[11.5px] text-muted-foreground", children: justAdded ? "Added to project scope" : `${templateCount} capability templates` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: allTemplatesAdded ? "secondary" : "outline", size: "sm", disabled: templateCount === 0 || allTemplatesAdded, onClick: () => addCapabilityTemplates(capability.id), className: justAdded ? "bg-std-global-bg text-std-global shadow-none" : "", children: [
                  allTemplatesAdded ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                  allTemplatesAdded ? "Added" : "Add"
                ] })
              ] }, capability.id);
            }),
            capabilities.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-10 text-center text-[13px] text-muted-foreground", children: "No capabilities match this filter." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "grid gap-1 lg:grid-cols-2", children: [
      assigned.map((bt) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/business-templates/$btId", params: {
        btId: bt.id
      }, className: "flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: bt.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: bt.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[11.5px] text-muted-foreground", children: bt.geoScope })
      ] }) }, bt.id)),
      assigned.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-[13px] text-muted-foreground", children: "No business templates assigned." })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface-2 px-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[14px] font-semibold truncate", children: value })
  ] });
}
export {
  ProjectDetail as component
};
