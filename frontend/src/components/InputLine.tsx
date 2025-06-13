import React, { useRef, useEffect } from "react";

interface InputLineProps {
    user?: string;
    path: string;
    currentInput: string;
    showCursor: boolean;
}

const InputLine: React.FC<InputLineProps> = ({ user = "user1", path, currentInput, showCursor }) => {
    const inputRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    }, [currentInput]);

    const prompt = "$ ";
    const promptWidth = "1.5ch";

    return (
        <div className="font-mono text-sm">
            <div>
                <span className="text-green-600">{user}</span>
                <span className="text-white">&nbsp;</span>
                <span className="text-yellow-400">{path}</span>
            </div>
            <div className="relative">
                <span
                    className="text-white absolute left-0 top-0 select-none pointer-events-none"
                    style={{ width: promptWidth }}
                >
                    {prompt}
                </span>
                <span
                    ref={inputRef as any}
                    className="text-white break-all whitespace-pre-wrap block"
                    style={{
                        paddingLeft: promptWidth,
                        wordBreak: "break-all",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {currentInput}
                    {showCursor && <span className="inline-block w-2 h-4 bg-white animate-blink align-middle" />}
                </span>
            </div>
        </div>
    );
};

export default InputLine;
