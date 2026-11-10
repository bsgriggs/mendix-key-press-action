import { useMemo } from "react";
import { ValueStatus } from "mendix";
import { WatchListType } from "../../typings/KeyPressActionProps";
import IEventMetaData from "../../typings/EventMetaData";
import { DebugLog } from "./Logger";

export default function useEventMetaData(watchList: WatchListType[], debug: boolean): IEventMetaData {
    return useMemo(() => {
        DebugLog(debug, "useEventMetaData processing", watchList);
        if (
            watchList.every(
                keyEvent =>
                    keyEvent.preventDefault?.status === ValueStatus.Available &&
                    watchList.every(keyEvent => keyEvent.keyAction?.canExecute)
            )
        ) {
            return {
                hasCombination: watchList.findIndex(keyEvent => keyEvent.keyCombination) !== -1,
                hasAlt:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "ALT") !== -1,
                hasCtrl:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "CTRL") !== -1,
                hasMeta:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "META") !== -1,
                hasShift:
                    watchList.findIndex(keyEvent => keyEvent.keyCombination && keyEvent.secondaryKey === "SHIFT") !== -1
            } as IEventMetaData;
        }

        return {
            hasCombination: false,
            hasAlt: false,
            hasCtrl: false,
            hasMeta: false,
            hasShift: false
        };
    }, [watchList, debug]);
}
