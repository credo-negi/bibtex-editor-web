import { createContext, useContext, useEffect, useState } from "react";
import type { Contrast, ColorScheme, ScreenSize, ForceSystemDesignSkin } from "../types/designSkin";

export interface DesignSkinContextProps {
    colorScheme: ColorScheme;
    setColorScheme: (scheme: ColorScheme) => void;
    contrast: Contrast;
    setContrast: (contrast: Contrast) => void;
    screen: ScreenSize;
    setScreen: (screen: ScreenSize) => void;
    forceSystemDesignSkin: ForceSystemDesignSkin;
    setForceSystemDesignSkin: (force: ForceSystemDesignSkin) => void;
}

interface DesignSkinProviderProps {
    children: React.ReactNode;
}

const matchDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const matchHighContrast = window.matchMedia("(prefers-contrast: more)");
const matchScreenSize: {
    [key in Exclude<ScreenSize, 'tablet'>]: MediaQueryList
} = {
    phone: window.matchMedia("(max-width: 768px)"),
    desktop: window.matchMedia("(min-width: 1024px)"),
}

// localStorageに値が保存されている場合は，その値を初期値として設定
// 保存されていない場合は，ブラウザの設定を参照する
const initialColorScheme = () => {
    const value =
        (localStorage.getItem("colorScheme") === "dark" || localStorage.getItem("colorScheme") === "light")
            ? localStorage.getItem("colorScheme") as ColorScheme
            : (matchDarkScheme.matches ? "dark" : "light");
    document.documentElement.classList.add(`color-scheme-${value}`);
    return value;
}
const initialContrast = () => {
    const value =
        (localStorage.getItem("contrast") === "high" || localStorage.getItem("contrast") === "default" || localStorage.getItem("contrast") === "medium")
            ? localStorage.getItem("contrast") as Contrast
            : (matchHighContrast.matches ? "high" : "default");
    document.documentElement.classList.add(`contrast-${value}`);
    return value;
}
const initialScreenSize =
    matchScreenSize.phone.matches ? "phone" : "desktop";

const DesignSkinContext = createContext<DesignSkinContextProps | null>(null);

export const DesignSkinProvider = ({ children }: DesignSkinProviderProps) => {
    const [colorScheme, _setColorScheme] = useState<ColorScheme>(initialColorScheme);
    const [contrast, _setContrast] = useState<Contrast>(initialContrast);
    const [screen, setScreen] = useState<ScreenSize>(initialScreenSize);
    const [forceSystemDesignSkin, setForceSystemDesignSkin] = useState<ForceSystemDesignSkin>({ forceColorScheme: false, forceContrast: false });

    const setColorScheme = (newScheme: ColorScheme) => {
        localStorage.setItem("colorScheme", newScheme);
        _setColorScheme(newScheme);
    }

    const setContrast = (newContrast: Contrast) => {
        localStorage.setItem("contrast", newContrast);
        _setContrast(newContrast);
    }

    // ブラウザの設定に応じてカラースキーム，コントラスト，スクリーンサイズを設定
    useEffect(() => {
        const updateColorScheme = () => {
            document.documentElement.classList.remove("color-scheme-dark", "color-scheme-light");
            if (colorScheme === "default") {
                const newScheme = matchDarkScheme.matches ? "dark" : "light";
                document.documentElement.classList.add(`color-scheme-${newScheme}`);
            } else {
                document.documentElement.classList.add(`color-scheme-${colorScheme}`);
            }
        }
        const updateContrast = () => {
            document.documentElement.classList.remove("contrast-medium", "contrast-high");
            if (contrast === "default") {
                const newContrast = matchHighContrast.matches ? "high" : "default";
                document.documentElement.classList.add(`contrast-${newContrast}`);
            } else {
                document.documentElement.classList.add(`contrast-${contrast}`);
            }
        }
        const updateScreen = () => {
            if (matchScreenSize.phone.matches) {
                setScreen("phone");
            } else if (matchScreenSize.desktop.matches) {
                setScreen("desktop");
            } else {
                setScreen("tablet");
            }
        }
        updateColorScheme();
        updateContrast();
        updateScreen();
        matchDarkScheme.addEventListener("change", updateColorScheme);
        matchHighContrast.addEventListener("change", updateContrast);
        matchScreenSize.phone.addEventListener("change", updateScreen);
        matchScreenSize.desktop.addEventListener("change", updateScreen);
        return () => {
            matchDarkScheme.removeEventListener("change", updateColorScheme);
            matchHighContrast.removeEventListener("change", updateContrast);
            matchScreenSize.phone.removeEventListener("change", updateScreen);
            matchScreenSize.desktop.removeEventListener("change", updateScreen);
        }
    }, [colorScheme, contrast]);

    return (
        <DesignSkinContext.Provider value={
            {
                colorScheme, setColorScheme,
                contrast, setContrast,
                screen, setScreen,
                forceSystemDesignSkin, setForceSystemDesignSkin
            }
        }>
            {children}
        </DesignSkinContext.Provider>
    );
}

export const useDesignSkin = () => {
    const context = useContext(DesignSkinContext);
    if (!context) {
        throw new Error("useDesignSkin must be used within a DesignSkinProvider");
    }
    return context;
}

export default DesignSkinContext;