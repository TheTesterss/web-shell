import React, { useState, useEffect, useRef, useCallback } from "react";
import OutputLine from "./OutputLine";
import InputLine from "./InputLine";

const GO_BACKEND_URL = "http://localhost:8080/command";
const Terminal: React.FC = () => {
    const [history, setHistory] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState<string>("");
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const [path, _setPath] = useState<string>("~/home");
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const storedHistory = JSON.parse(localStorage.getItem("terminalHistory")!);

            if (storedHistory.length > 0 && history.length === 0) setHistory(storedHistory);
        } catch (error) {
            setHistory([]);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("terminalHistory", JSON.stringify(history));
        } catch (error) {}
        if (terminalRef.current) {
            setTimeout(() => {
                terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
            }, 0);
        }
    }, [history]);

    useEffect(() => {
        if (terminalRef.current) {
            setTimeout(() => {
                terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
            }, 0);
        }
    }, [currentInput]);

    const processCommand = useCallback(
        async (commandLine: string) => {
            const trimmedCommandLine = commandLine.trim();
            setHistory((prev) => [...prev, `${"user1"} ${path}`, `$ ${trimmedCommandLine}`]);
            let output = "";
            let error = "";

            // Parse command and args
            const [command, ...argsArr] = trimmedCommandLine.split(" ");
            const args = argsArr.join(" ");

            try {
                const response = await fetch(GO_BACKEND_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ command, args })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.output === "__CLEAR__") {
                    localStorage.removeItem("terminalHistory");
                    setHistory([]);
                    setCurrentInput("");
                    return;
                }
                if (data.error) {
                    error = data.error;
                } else {
                    output = data.output;
                }
            } catch (e: any) {
                error = `Network or command execution error: ${e.message || "Unknown error"}`;
            }

            setHistory((prev) => {
                if (error) {
                    return [...prev, error, ""];
                }
                return output ? [...prev, output, ""] : [...prev, ""];
            });

            setCurrentInput("");
        },
        [path, history]
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            e.preventDefault();

            if (e.key === "Enter") {
                processCommand(currentInput);
            } else if (e.key === "Backspace") {
                setCurrentInput((prev) => prev.slice(0, -1));
            } else if (e.key.length === 1) {
                setCurrentInput((prev) => prev + e.key);
            }
        },

        [currentInput, processCommand]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const focusTerminal = () => {
        if (terminalRef.current) {
            terminalRef.current.focus();
        }
    };

    return (
        <div
            ref={terminalRef}
            className="bg-black text-white p-4 h-screen w-screen font-mono text-sm focus:outline-none"
            tabIndex={0}
            onClick={focusTerminal}
            onFocus={() => setShowCursor(true)}
            onBlur={() => setShowCursor(false)}
        >
            {history.map((line, index) => (
                <OutputLine key={index} line={line} />
            ))}

            <InputLine path={path} currentInput={currentInput} showCursor={showCursor} />
        </div>
    );
};

export default Terminal;
