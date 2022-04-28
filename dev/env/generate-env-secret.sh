#!/bin/bash

CHARACTER_SET="a-zA-Z0-9\._-+^,"
LENGTH=64

LC_CTYPE=C tr -dc "${CHARACTER_SET}" < /dev/urandom | fold -w ${LENGTH} | head -n 1
echo ""
