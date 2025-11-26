import classNames from "classnames";
import { ReactElement, createElement, useEffect } from "react";
import { KeyPressActionContainerProps, WatchListType } from "../../typings/KeyPressActionProps";
import { DebugLog } from "../utils/Logger";
import useEventMetaData from "../utils/useEventMetaData";

const DocumentWatcher = (props: KeyPressActionContainerProps): ReactElement => {
    const eventMetaData = useEventMetaData(props.watchList, props.debug);

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent): void {
            if (event.repeat && props.allowKeyHold.value === false) {
                DebugLog(props.debug, `already running, skipping`);
                return;
            }
            const keyPressed = event.key;
            DebugLog(props.debug, `key press detected: ${keyPressed}`, event);

            let keyEvent: WatchListType | undefined;
            if (eventMetaData.hasCombination) {
                if (eventMetaData.hasShift && event.shiftKey) {
                    DebugLog(props.debug, "searching for shift key event");
                    keyEvent = props.watchList.find(
                        key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "SHIFT"
                    );
                } else if (eventMetaData.hasAlt && event.altKey) {
                    DebugLog(props.debug, "searching for alt key event");
                    keyEvent = props.watchList.find(
                        key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "ALT"
                    );
                } else if (eventMetaData.hasCtrl && event.ctrlKey) {
                    DebugLog(props.debug, "searching for ctrl key event");
                    keyEvent = props.watchList.find(
                        key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "CTRL"
                    );
                } else if (eventMetaData.hasMeta && event.metaKey) {
                    DebugLog(props.debug, "searching for meta key event");
                    keyEvent = props.watchList.find(
                        key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "META"
                    );
                }
            }

            if (keyEvent === undefined) {
                // if no combination found, then try the key alone
                keyEvent = props.watchList.find(key => key.keyName === keyPressed && !key.keyCombination);
            }

            if (keyEvent && keyEvent.keyAction && keyEvent.keyAction.canExecute) {

                if (keyEvent.preventDefault && keyEvent.keyCombination) {
                    event.preventDefault();
                }

                DebugLog(props.debug, "keyEvent found: ", keyEvent);
                keyEvent.keyAction.execute();
            }
        }

        DebugLog(props.debug, `keyPressAction keyMode ${props.keyMode} useEffect`, props.watchList);
        if (props.keyMode === "DOWN") {
            document.addEventListener("keydown", handleKeyPress);
        } else {
            document.addEventListener("keyup", handleKeyPress);
        }
        return () => {
            DebugLog(props.debug, `keyPressAction keyMode ${props.keyMode} clear listeners`);
            if (props.keyMode === "DOWN") {
                document.removeEventListener("keydown", handleKeyPress);
            } else {
                document.removeEventListener("keyup", handleKeyPress);
            }
        };
    }, [props.watchList, props.debug, eventMetaData, props.keyMode, props.allowKeyHold]);

    return (
        <div
            id={props.name}
            className={classNames("key-press-action", props.class)}
            style={props.style}
            tabIndex={props.tabIndex}
        />
    );
};

export default DocumentWatcher;
