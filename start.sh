#!/bin/sh

yarn global add @angular/cli

yarn install

ng build

chmod -R 777 /source/*
