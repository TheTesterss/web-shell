package commands

import (
    "strings"
    "errors"
)

func This(args string) (string, error) {
	if strings.TrimSpace(args) == "" {
        return "", errors.New("[this] command requires an action to perform")
    }
    var actions []string = []string{"get", "clear", "update" /* Not available for now */, "history"}
    action := strings.ToLower(strings.Split(strings.TrimSpace(args), " ")[0])
    if !Contains(actions, action) {
        return "", errors.New("[this] command requires a valid action: get, clear, update or history")
    }
    switch(action) {
    case "clear":
        return "__LOCAL__CLEAR__", nil
    case "get":
        index := strings.ToLower(strings.Split(strings.TrimSpace(args), " ")[1])
        if isDigitIndex(index) {
            return "__LOCAL__GET__"+index, nil
        } else {
            return "", errors.New("[this] command requires a valid git index")
        }
    case "history":
        return "__LOCAL__HISTORY__", nil
    }
    return "", nil
}

func Contains(slice []string, item string) bool {
    for _, s := range slice {
        if s == item {
            return true
        }
    }
    return false
}

func isDigitIndex(index string) bool {
    for _, char := range index {
        if char < '0' || char > '9' {
            return false
        }
    }
    return true
}