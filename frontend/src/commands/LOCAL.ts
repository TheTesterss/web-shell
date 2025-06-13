export function execute(args: string[], setters: { [key: string]: Function }): any {
    let history = JSON.parse(localStorage.getItem("terminalHistory") || "[]");
    switch (args[0]) {
        case "CLEAR":
            localStorage.removeItem("terminalHistory");
            setters.setHistory([]);
            setters.setCurrentInput("");
            setters.setUpArrowPressed(0);
            return "";
        case "HISTORY":
            if (history) {
                return history;
            } else {
                return "No terminal history found.";
            }
        case "GET":
            if (history) {
                const entries = history.filter((entry: string, index: number) => entry.startsWith("$ ") && (index > 0 && history[index-1].includes("~/home")));
                console.log(entries)
                const index = parseInt(args[1], 10);
                if (index >= 0 && index < entries.length) {
                    return entries[index].split("$ ")[1].trim();
                } else {
                    return `Index ${index} out of bounds.`;
                }
            } else {
                return "No terminal history found.";
            }
    }
}
