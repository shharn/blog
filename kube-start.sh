#!/bin/sh
kubectl create -f ./client/kubernetes/*
echo Client pod & service successfully created
kubectl create -f ./server/kubernetes/*
echo Server/Database pods & services successfully created
kubectl create -f ./ingress.dev.yaml
echo Local Ingress object successfully created
echo If you wanna run app correctly,\nset host 'puppyloper.blog', 'api.puppyloper.blog' to minikube IP Address