/**
 * This file was generated from KeyPressAction.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue } from "mendix";

export type WatchModeEnum = "DOCUMENT" | "CONTENT";

export type KeyModeEnum = "DOWN" | "UP";

export type SecondaryKeyEnum = "SHIFT" | "CTRL" | "ALT" | "META";

export interface WatchListType {
    keyName: string;
    keyCombination: boolean;
    secondaryKey: SecondaryKeyEnum;
    preventDefault: boolean;
    keyAction?: ActionValue;
}

export interface WatchListPreviewType {
    keyName: string;
    keyCombination: boolean;
    secondaryKey: SecondaryKeyEnum;
    preventDefault: boolean;
    keyAction: {} | null;
}

export interface KeyPressActionContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    watchMode: WatchModeEnum;
    debug: boolean;
    content: ReactNode;
    keyMode: KeyModeEnum;
    allowKeyHold: DynamicValue<boolean>;
    watchList: WatchListType[];
}

export interface KeyPressActionPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    watchMode: WatchModeEnum;
    debug: boolean;
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    keyMode: KeyModeEnum;
    allowKeyHold: string;
    watchList: WatchListPreviewType[];
}
