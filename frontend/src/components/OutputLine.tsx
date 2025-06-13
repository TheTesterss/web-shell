import React from "react";

interface OutputLineProps {
    line: string;
}

const OutputLine: React.FC<OutputLineProps> = ({ line }) => {
    if (line.trim() === "") {
        return <div style={{ minHeight: "1em" }}>&nbsp;</div>;
    }
    if (line.startsWith("user1 ")) {
        const [user, ...rest] = line.split(" ");
        const path = rest.join(" ");
        return (
            <div className="font-mono text-sm whitespace-pre-wrap">
                <span className="text-green-600">{user}</span>
                <span className="text-white">&nbsp;</span>
                <span className="text-yellow-400">{path}</span>
            </div>
        );
    }
    if (line.startsWith("Error:")) {
        return <div className="font-mono text-sm whitespace-pre-wrap text-red-500">{line}</div>;
    }
    return <div className="font-mono text-sm whitespace-pre-wrap text-white">{line}</div>;
};

export default OutputLine;
