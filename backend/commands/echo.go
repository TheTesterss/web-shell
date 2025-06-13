package commands

import (
	"strings"
)

func Echo(args string) (string, error) {
	if strings.TrimSpace(args) == "" {
		return "", nil 
	}
	return strings.TrimSpace(args), nil
}