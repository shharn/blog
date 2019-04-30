package logger

import (
	"fmt"
	"os"
	"sync"

	log "github.com/sirupsen/logrus"
)

var (
	instance *log.Logger
	loggerOnce sync.Once
)

type Tuples map[string]interface{}

func Logger() *log.Logger {
	loggerOnce.Do(func () {
		instance = log.New()
		instance.SetFormatter(&log.JSONFormatter{})
		instance.SetOutput(os.Stdout)
		logLevel := os.Getenv("LOG_LEVEL")
		if len(logLevel) < 1 {
			logLevel = "info"
		}

		if logLevelNumber, err := log.ParseLevel(logLevel); err == nil {
			instance.SetLevel(logLevelNumber)
		} else {
			instance.SetLevel(log.InfoLevel)
		}
	})
	return instance
}

func Fatal(err error) {
	Logger().WithFields(log.Fields{
		"stacktrace": fmt.Sprintf("%+v", err),
	}).Fatal(err.Error())
}

func Error(err error) {
	Logger().WithFields(log.Fields{
		"stacktrace": fmt.Sprintf("%+v", err),
	}).Error(err.Error())
}

func Trace(message string) {
	Logger().Trace(message)
}

func Tracef(format string, args ...interface{}) {
	Logger().Tracef(format, args...)
}

func Info(message string) {
	Logger().Info(message)
}

func Infof(format string, args ...interface{}) {
	Logger().Infof(format, args...)
}

func Warnf(format string, args ...interface{}) {
	Logger().Warnf(format, args...)
}

func WithFields(tuples Tuples) func(string, string) {
	fields := log.Fields{}
	for k, v := range tuples {
		fields[k] = v
	}
	return func(logLevel, message string) {
		wfs := Logger().WithFields(fields)
		switch(logLevel) {
		case "trace":
			wfs.Trace(message)
		case "info":
			wfs.Info(message)
		case "warn":
			wfs.Warn(message)
		case "error":
			wfs.Error(message)
		case "fatal":
			wfs.Fatal(message)
		default:
			wfs.Info(message)
		}
	}
}
