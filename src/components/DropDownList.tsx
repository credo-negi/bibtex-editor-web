import React, { useState, createContext, useContext, useEffect, useCallback, useRef, forwardRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { ReactElement } from "react";
import { List } from "./List";

interface DropDownList__ItemProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    onClick?: () => void;
    selected?: boolean;
    icon?: React.ReactNode;
    styleXStyles?: stylex.StyleXStyles;
    disabled?: boolean;
}

interface DropDownList__LabelProps {
    renderItem?: (props: { onClick: () => void, children?: React.ReactNode }) => ReactElement;
}

interface DropDownList__RootProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: (props: { onClick: () => void }) => ReactElement;
    children: React.ReactNode;
    styleXStyles?: stylex.StyleXStyles;
    closeWhenPointerLeave?: boolean;
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right";
}

interface DropDownListContextProps {
    selected: number | null;
    setSelected: (index: number) => void;
    open: boolean;
    setOpen: (value: boolean) => void;
}

interface DropDownListProviderProps {
    children: React.ReactNode;
}

const DropDownListContext = createContext<DropDownListContextProps | null>(null);

const DropDownListProvider = ({ children }: DropDownListProviderProps) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    return (
        <DropDownListContext.Provider value={{ selected, setSelected, open, setOpen }}>
            {children}
        </DropDownListContext.Provider>
    )
}

const useDropDownList = () => {
    const context = useContext(DropDownListContext);
    if (!context) {
        throw new Error("useDropDownList must be used within a DropDownListProvider");
    }
    return context;
}

const transitionDuration_open = 150;
const transitionDuration_close = 250;

const keyframes_opening = stylex.keyframes({
    from: {
        gridTemplateRows: "0fr",
        opacity: 0,
        scale: "0 1",
    },
    to: {
        gridTemplateRows: "1fr",
        opacity: 1,
        scale: "1 1",
    }
});
const keyframes_closing = stylex.keyframes({
    from: {
        opacity: 1,
    },
    to: {
        opacity: 0,
    }
});

const style = stylex.create({
    Root: {
        position: "relative",
        zIndex: 1,
    },
    ItemWrapper: {
        display: "grid",
        overflow: "hidden",
        transition: `grid-template-rows ${transitionDuration_open}ms, opacity ${transitionDuration_open}ms, scale ${transitionDuration_open}ms`,
        opacity: 0,
        position: "fixed",
        top: "100%",
        left: "0",
        zIndex: 10,
        scale: "0 1",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(var(--md-sys-color-shadow), 0.12)",
    },
    ItemWrapper__top: {
        top: "unset",
        bottom: "100%",
        transformOrigin: "bottom",
    },
    ItemWrapper__bottom: {
        top: "100%",
        bottom: "unset",
        transformOrigin: "top",
    },
    ItemWrapper__left: {
        right: 0,
        left: "unset",
        transformOrigin: "right",
    },
    ItemWrapper__right: {
        left: 0,
        right: "unset",
        transformOrigin: "left",
    },
    ItemWrapper__open: {
        gridTemplateRows: "1fr",
        opacity: 1,
        animation: `${keyframes_opening} ${transitionDuration_open}ms forwards`,
        scale: "1 1",
    },
    ItemWrapper__closing: {
        gridTemplateRows: "1fr",
        opacity: 0,
        scale: "1 1",
        animation: `${keyframes_closing} ${transitionDuration_close}ms forwards`,
    },
    ItemWrapper__closed: {
        display: "none",
    },
    Item: {
    },
});

const Label = (
    { renderItem }: DropDownList__LabelProps
) => {
    const { open, setOpen } = useDropDownList();
    const handleClick = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    return renderItem ? renderItem({ onClick: handleClick })
        : <button onClick={handleClick}></button> ;
}

const Root = ({ 
    label, 
    children, 
    styleXStyles, 
    closeWhenPointerLeave, 
    vertical,
    horizontal, 
    ...rest }: DropDownList__RootProps) => {
    return (
        <DropDownListProvider>
            <Wrapper
                label={label}
                styleXStyles={styleXStyles}
                closeWhenPointerLeave={closeWhenPointerLeave}
                vertical={vertical}
                horizontal={horizontal}
                {...rest}
            >
                {children}
            </Wrapper>
        </DropDownListProvider>
    )
}

const Wrapper = ({ 
    label, 
    children, 
    styleXStyles, 
    closeWhenPointerLeave = true, 
    vertical,
    horizontal,
    ...rest 
}: DropDownList__RootProps) => {
    const { open, setOpen } = useDropDownList();
    const ref = useRef<HTMLDivElement>(null);
    const itemWrapperRef = useRef<HTMLDivElement>(null);

    // DropDownList__ItemWrapper の位置を定める        
    // DropDownList__ItemWrapperは position: fixed
    // スクロール量，ref.currentの位置を考慮して位置を定める
    useEffect(() => {
        if (itemWrapperRef.current && ref.current && open) {
            const { top, left, right, height } = ref.current.getBoundingClientRect();
            const { scrollX, scrollY, innerWidth } = window;
            if (vertical === "top") {
                itemWrapperRef.current.style.bottom = `${scrollY + top}px`;
            } else {
                itemWrapperRef.current.style.top = `${scrollY + top + height}px`;
            }
            if (horizontal === "left") {
                itemWrapperRef.current.style.right = `${innerWidth - right + scrollX}px`;
            } else {
                itemWrapperRef.current.style.left = `${scrollX + left}px`;
            }
        }
    }, [vertical, horizontal, ref, itemWrapperRef, open]);

    // DropDownListの外側をクリックしたら閉じる
    useEffect(() => {
        const handlePointerDownOutside = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("pointerdown", handlePointerDownOutside);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDownOutside);
        }
    }, [ref, setOpen]);

    const handlePointerLeaveFromWrapper = useCallback(() => {
        if (!closeWhenPointerLeave) return;
        setOpen(false);
    }, [closeWhenPointerLeave, setOpen]);
    return (
        <div 
            ref={ref}
            {...stylex.props(style.Root, styleXStyles)}
            {...rest}
            onPointerLeave={handlePointerLeaveFromWrapper}
        >
            <Label renderItem={label} />
            <DropDownList__ItemWrapper
                ref={itemWrapperRef}
                vertical={vertical}
                horizontal={horizontal}
            >
                {children}
            </DropDownList__ItemWrapper>
        </div>
    )
}

const Item = (
    { 
        label, 
        onClick, 
        icon, 
        styleXStyles,
        disabled = false,
        ...rest
    }: DropDownList__ItemProps
) => {
    const { setOpen } = useDropDownList();

    const handleClick = useCallback(() => {
        if (disabled) return;
        if (onClick) onClick();
        setOpen(false);
    }, [onClick, setOpen, disabled]);
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.key === "Enter") {
            if (onClick) onClick();
            setOpen(false);
        }
    }, [onClick, setOpen, disabled]);

    return (
        <List.Item 
            text={label}
            icon={icon}
            onClick={handleClick} 
            onKeyDown={handleKeyDown}
            disabled={disabled}
            styleXStyles={{...styleXStyles, ...style.Item}}
            {...rest}>
        </List.Item>
    )
}

const DropDownList__ItemWrapper = forwardRef(
    function DropDownList__ItemWrapper({ 
    children,
    vertical = "bottom",
    horizontal = "right",
}: { 
    children: React.ReactNode, 
    vertical?: "top" | "bottom",
    horizontal?: "left" | "right",
}, ref: React.Ref<HTMLDivElement>) {
    const [state, setState] = useState<"open" | "closing" | "closed">("closed");
    const { open } = useDropDownList();
    useEffect(() => {
        let timer: number;
        if (open) {
            setState("open");
        } else {
            setState("closing");
            timer = setTimeout(() => {
                setState("closed");
            }, transitionDuration_close);
        }
        return () => {
            clearTimeout(timer);
        }
    }, [open]);
    return (
        <div {...stylex.props(
            style.ItemWrapper,
            style[`ItemWrapper__${state}`],
            style[`ItemWrapper__${vertical}`],
            style[`ItemWrapper__${horizontal}`],
        )} ref={ref}>
            <List.Wrapper>{children}</List.Wrapper>
        </div>
    )

})

export const DropDownList = {
    Root,
    Item
}