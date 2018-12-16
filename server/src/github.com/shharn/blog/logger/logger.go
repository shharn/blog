package logger

import (
	"fmt"
	"os"

	log "github.com/sirupsen/logrus"
)

// AppLogger is helper object for convenience
type AppLogger struct {
	logger *log.Logger
}

func (appLogger *AppLogger) Error(err error) {
	appLogger.logger.WithFields(log.Fields{
		"stacktrace": fmt.Sprintf("%+v", err),
	}).Error(err.Error())
}

func (appLogger *AppLogger) ErrorWithMessage(message string, err error) {
	appLogger.logger.WithFields(log.Fields{
		"stacktrace": fmt.Sprintf("%+v", err),
	}).Error(message)
}

func (appLogger *AppLogger) Info(message string) {
	appLogger.logger.Info(message)
}

func (appLogger *AppLogger) Infof(format string, args ...interface{}) {
	appLogger.logger.Infof(format, args...)
}

func (appLogger *AppLogger) WithFields(fields log.Fields) *log.Entry {
	return appLogger.logger.WithFields(fields)
}

// NewLogger creates & initialize logrus.Logger instance
func NewLogger() *AppLogger{
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

	appLogger := &AppLogger{logger: logger}
	return appLogger
}

// Logger is self-explantory
var Logger *AppLogger = NewLogger()

