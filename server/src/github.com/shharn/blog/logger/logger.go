package logger

import (
	"os"

	log "github.com/sirupsen/logrus"
)

// NewLogger creates & initialize logrus.Logger instance
func NewLogger() *log.Logger{
	var logger *log.Logger = log.New()
	logger.SetFormatter(&log.JSONFormatter{})
	logLevel := os.Getenv("LOG_LEVEL")
	if len(logLevel) < 1 {
		logLevel = "info"
	}

	if logLevelNumber, err := log.ParseLevel(logLevel); err == nil {
		logger.SetLevel(logLevelNumber)
	} else {
		logger.SetLevel(log.InfoLevel)
	}
	return logger
}

// Logger is self-explantory
var Logger = NewLogger()

