import classNames from "classnames";
import { ReactElement, createElement } from "react";
import { DebugLog } from "../utils/Logger";
import IEventMetaData from "../../typings/EventMetaData";
import { KeyPressActionContainerProps, WatchListType } from "../../typings/KeyPressActionProps";
import useEventMetaData from "../utils/useEventMetaData";

const ContentWatcher = (props: KeyPressActionContainerProps): ReactElement => {
    const eventMetaData = useEventMetaData(props.watchList, props.debug);

    function handleKeyPress(
        event: KeyboardEvent,
        watchList: WatchListType[],
        debug: boolean,
        eventMetaData: IEventMetaData
    ): void {
        if (event.repeat && props.allowKeyHold.value === false) {
            DebugLog(debug, `already running, skipping`);
            return;
        }
        const keyPressed = event.key;
        DebugLog(debug, `key press detected: ${keyPressed}`, event);

        let keyEvent: WatchListType | undefined;
        if (eventMetaData.hasCombination) {
            if (eventMetaData.hasShift && event.shiftKey) {
                DebugLog(debug, "searching for shift key event");
                keyEvent = watchList.find(
                    key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "SHIFT"
                );
            } else if (eventMetaData.hasAlt && event.altKey) {
                DebugLog(debug, "searching for alt key event");
                keyEvent = watchList.find(
                    key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "ALT"
                );
            } else if (eventMetaData.hasCtrl && event.ctrlKey) {
                DebugLog(debug, "searching for ctrl key event");
                keyEvent = watchList.find(
                    key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "CTRL"
                );
            } else if (eventMetaData.hasMeta && event.metaKey) {
                DebugLog(debug, "searching for meta key event");
                keyEvent = watchList.find(
                    key => key.keyName === keyPressed && key.keyCombination && key.secondaryKey === "META"
                );
            }
        }

        if (keyEvent === undefined) {
            // if no combination found, then try the key alone
            keyEvent = watchList.find(key => key.keyName === keyPressed && !key.keyCombination);
        }

        if (keyEvent && keyEvent.keyAction && keyEvent.keyAction.canExecute) {
            if (keyEvent.preventDefault && keyEvent.keyCombination) {
                event.preventDefault();
            }
            DebugLog(debug, "keyEvent found: ", keyEvent);
            keyEvent.keyAction.execute();
        }
    }

    return (
        <div
            id={props.name}
            className={classNames("key-press-action", props.class)}
            style={props.style}
            tabIndex={props.tabIndex}
            onKeyDown={
                props.keyMode === "DOWN"
                    ? event =>
                          handleKeyPress(event as unknown as KeyboardEvent, props.watchList, props.debug, eventMetaData)
                    : undefined
            }
            onKeyUp={
                props.keyMode === "UP"
                    ? event =>
                          handleKeyPress(event as unknown as KeyboardEvent, props.watchList, props.debug, eventMetaData)
                    : undefined
            }
        >
            {props.content}
        </div>
    );
};

export default ContentWatcher;
