import classNames from "classnames";
import { ReactElement, createElement, useEffect, useState } from "react";

import { KeyPressActionContainerProps, WatchListType } from "../typings/KeyPressActionProps";

import "./ui/KeyPressAction.css";

interface IEventMetaData {
    hasCombination: boolean;
    hasShift: boolean;
    hasAlt: boolean;
    hasCtrl: boolean;
    hasMeta: boolean;
}

function handleKeyPress(
    event: KeyboardEvent,
    watchList: WatchListType[],
    debug: boolean,
    eventMetaData: IEventMetaData
): void {
    // eslint-disable-next-line no-unused-expressions
    debug && console.info("event", event);
    const keyPressed = event.key;
    // eslint-disable-next-line no-unused-expressions
    debug && console.info("key press detected: " + keyPressed);

    let keyEvent: WatchListType | undefined;
    if (eventMetaData.hasCombination) {
        if (eventMetaData.hasShift && event.shiftKey) {
            // eslint-disable-next-line no-unused-expressions
            debug && console.info("searching for shift key event");
            keyEvent = watchList.find(
                key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "SHIFT"
            );
        } else if (eventMetaData.hasAlt && event.altKey) {
            // eslint-disable-next-line no-unused-expressions
            debug && console.info("searching for alt key event");
            keyEvent = watchList.find(
                key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "ALT"
            );
        } else if (eventMetaData.hasCtrl && event.ctrlKey) {
            // eslint-disable-next-line no-unused-expressions
            debug && console.info("searching for ctrl key event");
            keyEvent = watchList.find(
                key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "CTRL"
            );
        } else if (eventMetaData.hasMeta && event.metaKey) {
            // eslint-disable-next-line no-unused-expressions
            debug && console.info("searching for meta key event");
            keyEvent = watchList.find(
                key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "META"
            );
        }
    }

    if (keyEvent === undefined) {
        keyEvent = watchList.find(key => key.keyName === keyPressed && !key.keyCombination);
    }

    if (keyEvent && keyEvent.keyAction && keyEvent.keyAction.canExecute) {
        // eslint-disable-next-line no-unused-expressions
        debug && console.info("keyEvent found: ", keyEvent);
        keyEvent.keyAction.execute();
    }
}

const KeyPressAction = ({
    class: className,
    content,
    name,
    watchList,
    style,
    watchMode,
    debug,
    keyMode
}: KeyPressActionContainerProps): ReactElement => {
    const [eventMetaData, setEventMetaData] = useState<IEventMetaData>({
        hasCombination: false,
        hasAlt: false,
        hasCtrl: false,
        hasMeta: false,
        hasShift: false
    });
    const [keyEventList, setKeyEventList] = useState<WatchListType[]>([]);

    useEffect(() => {
        if (watchList.every(keyEvent => keyEvent.keyAction?.canExecute)) {
            setEventMetaData({
                hasCombination: watchList.findIndex(keyEvent => keyEvent.keyCombination) !== -1,
                hasAlt:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "ALT") !== -1,
                hasCtrl:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "CTRL") !== -1,
                hasMeta:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "META") !== -1,
                hasShift:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "SHIFT") !== -1
            });
            setKeyEventList(watchList);
        }
    }, [watchList]);

    if (watchMode === "DOCUMENT") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (keyEventList.length > 0) {
                // eslint-disable-next-line no-unused-expressions
                debug && console.info("keyPressAction useEffect", keyEventList);
                if (keyMode === "DOWN") {
                    document.addEventListener("keydown", event =>
                        handleKeyPress(event, keyEventList, debug, eventMetaData)
                    );
                } else {
                    document.addEventListener("keyup", event =>
                        handleKeyPress(event, keyEventList, debug, eventMetaData)
                    );
                }
            }
            return () => {
                if (keyMode === "DOWN") {
                    document.removeEventListener("keydown", event =>
                        handleKeyPress(event, keyEventList, debug, eventMetaData)
                    );
                } else {
                    document.removeEventListener("keyup", event =>
                        handleKeyPress(event, keyEventList, debug, eventMetaData)
                    );
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [keyEventList]);

        return <div id={name} className={classNames("key-press-action", className)} style={style}></div>;
    } else {
        return (
            <div
                id={name}
                className={classNames("key-press-action", className)}
                style={style}
                onKeyDown={
                    keyEventList.length > 0 && keyMode === "DOWN"
                        ? event => handleKeyPress(event as unknown as KeyboardEvent, keyEventList, debug, eventMetaData)
                        : undefined
                }
                onKeyUp={
                    keyEventList.length > 0 && keyMode === "UP"
                        ? event => handleKeyPress(event as unknown as KeyboardEvent, keyEventList, debug, eventMetaData)
                        : undefined
                }
            >
                {content}
            </div>
        );
    }
};

export default KeyPressAction;
