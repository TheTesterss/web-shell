import React, { useState, useEffect, useRef, useCallback } from "react";
import OutputLine from "./OutputLine";
import InputLine from "./InputLine";

const GO_BACKEND_URL = "http://localhost:8080/command";
const Terminal: React.FC = () => {
    const [history, setHistory] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState<string>("");
    const [showCursor, setShowCursor] = useState<boolean>(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_upArrowPressed, setUpArrowPressed] = useState<number>(0);
    const [path, setPath] = useState<string>("~/home");
    const terminalRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setters = {
        setHistory,
        setCurrentInput,
        setPath,
        setUpArrowPressed
    };

    useEffect(() => {
        try {
            const storedHistory = JSON.parse(localStorage.getItem("terminalHistory")!);

            if (storedHistory.length > 0 && history.length === 0) setHistory(storedHistory);
        } catch (e: unknown) {
            console.error(e)
            setHistory([]);
        }
    }, [history.length]);

    useEffect(() => {
        try {
            localStorage.setItem("terminalHistory", JSON.stringify(history));
        } catch (e: unknown) {
            console.error(e)
        }
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
                if (data.output.startsWith("__")) {
                    const value = data.output.split("__")[1];
                    const module = await import(`../commands/${value}.ts`);
                    const result = module.execute(data.output.split("__").slice(2), setters);
                    if (typeof result === "string") {
                        output = result;
                    }
                    if (Array.isArray(result)) {
                        output = "\n" + result.map((item: string) => `> ${item}`).join("\n");
                    }
                }
                if (data.error) {
                    error = data.error;
                } else if (!data.output.startsWith("__")) {
                    output = data.output;
                }
            } catch (e: unknown) {
                error = `Network or command execution error: ${(e as Error).message || "Unknown error"}`;
            }

            setHistory((prev) => {
                if (error) {
                    return [...prev, error, ""];
                }
                return prev.length === 0 && output === "" ? [] : [...prev, output, ""];
            });

            setCurrentInput("");
        },
        [path, setters]
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            e.preventDefault();

            if (e.key === "Enter") {
                setUpArrowPressed(0);
                processCommand(currentInput);
            } else if (e.key === "Backspace") {
                setUpArrowPressed(0);
                setCurrentInput((prev) => prev.slice(0, -1));
            } else if (e.key === "ArrowUp") {
                setUpArrowPressed((prev) => {
                    const newVal = prev + 1;
                    const elements = history.filter(
                        (line: string, index: number) =>
                            line.startsWith("$ ") && index > 0 && history[index - 1].includes("~/home")
                    );
                    const nextCommand = elements[elements.length - newVal];
                    if (nextCommand) {
                        setCurrentInput(nextCommand.split("$ ")[1] || "");
                    }
                    return newVal;
                });
            } else if (e.key === "ArrowDown") {
                setUpArrowPressed((prev) => {
                    const newVal = Math.max(prev - 1, 0);
                    const elements = history.filter(
                        (line: string, index: number) =>
                            line.startsWith("$ ") && index > 0 && history[index - 1].includes("~/home")
                    );
                    const nextCommand = elements[elements.length - newVal];
                    if (nextCommand) {
                        setCurrentInput(nextCommand.split("$ ")[1] || "");
                    } else if (newVal === 0) {
                        setCurrentInput("");
                    }
                    return newVal;
                });
            } else if (e.key.length === 1) {
                setUpArrowPressed(0);
                setCurrentInput((prev) => prev + e.key);
            }
        },
        [processCommand, currentInput, history]
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
