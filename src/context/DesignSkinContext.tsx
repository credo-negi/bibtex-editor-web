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

const DesignSkinContext = createContext<DesignSkinContextProps | null>(null);

export const DesignSkinProvider = ({ children }: DesignSkinProviderProps) => {
    const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");
    const [contrast, setContrastState] = useState<Contrast>("default");
    const [screen, setScreen] = useState<ScreenSize>("desktop");
    const [forceSystemDesignSkin, setForceSystemDesignSkin] = useState<ForceSystemDesignSkin>({ forceColorScheme: false, forceContrast: false });

    const setColorScheme = (newScheme: ColorScheme) => {
        setColorSchemeState((prev) => {
            document.documentElement.classList.remove(`color-scheme-${prev}`);
            document.documentElement.classList.add(`color-scheme-${newScheme}`);
            return newScheme;
        })
    }

    const setContrast = (newContrast: Contrast) => {
        setContrastState((prev) => {
            document.documentElement.classList.remove(`contrast-${prev}`);
            document.documentElement.classList.add(`contrast-${newContrast}`);
            return newContrast;
        })
    }

    // ブラウザの設定に応じてカラースキームとコントラスト，スクリーンサイズを設定
    useEffect(() => {
        const matchDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const matchHighContrast = window.matchMedia("(prefers-contrast: more)");
        const matchScreenSize: {
            [key in Exclude<ScreenSize, 'tablet'>]: MediaQueryList
        } = {
            phone: window.matchMedia("(max-width: 768px)"),
            desktop: window.matchMedia("(min-width: 1024px)"),
        }
        const updateColorScheme = () => {
            if (forceSystemDesignSkin.forceColorScheme) return;
            setColorScheme(matchDarkScheme.matches ? "dark" : "light");
        }
        const updateContrast = () => {
            if (forceSystemDesignSkin.forceContrast) return;
            setContrast(matchHighContrast.matches ? "high" : "default");
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
    }, [forceSystemDesignSkin]);
    
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