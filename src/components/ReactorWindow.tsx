import { Material } from "../classes/Materials";
import "./ReactorWindow.css"

interface ReactorWindowProps {
    material: Material | null;
}

function ReactorWindow(props: ReactorWindowProps){
    return (
        <div className="reactor">
            Hello World!<br/>
            {props.material != null && props.material.displayName}
        </div>
    );
}

export default ReactorWindow;