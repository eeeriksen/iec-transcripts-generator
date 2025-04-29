import { FileIcon } from "./FileIcon";
import "../styles/header.css";

export function Header() {
    return (
        <header>
            <div className="header-logo">
                <FileIcon />
                <p>IEC Transcript Generator</p>
            </div>
        </header>
    );
}