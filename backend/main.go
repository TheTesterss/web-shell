package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"backend/commands"
)

type CommandRequest struct {
	Command string `json:"command"`
	Args    string `json:"args"`
}

type CommandResponse struct {
	Output string `json:"output"`
	Error  string `json:"error,omitempty"`
}

func handleCommand(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed for echo command", http.StatusMethodNotAllowed)
		return
	}

	var req CommandRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var response CommandResponse
	switch req.Command {
    case "echo":
        output, err := commands.Echo(req.Args)
        if err != nil {
            response.Output = ""
            response.Error = err.Error()
        } else {
            response.Output = output
        }
    case "this":
        output, err := commands.This(req.Args)
        if err != nil {
            response.Output = ""
            response.Error = err.Error()
        } else {
            response.Output = output
        }
    default:
        response.Output = ""
        response.Error = fmt.Sprintf("Error: '%s' is not recognized as a valid command.", req.Command)
    }

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/command", handleCommand)

	port := ":8080"
	fmt.Printf("online, port: %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}