import { ReactElement, createElement } from "react";
import { KeyPressActionContainerProps } from "../typings/KeyPressActionProps";
import ContentWatcher from "./components/ContentWatcher";
import DocumentWatcher from "./components/DocumentWatcher";

import "./ui/KeyPressAction.css";

const KeyPressAction = (props: KeyPressActionContainerProps): ReactElement => {
    if (props.watchMode === "DOCUMENT") {
        return <DocumentWatcher {...props} />;
    } else {
        return <ContentWatcher {...props} />;
    }
};

export default KeyPressAction;
