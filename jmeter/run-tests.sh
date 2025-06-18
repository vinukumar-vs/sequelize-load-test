#!/bin/bash

# Set base paths
# Define available test plans
GET_TEST_PLAN="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/Get-sequelize-vs-raw.jmx"
POST_TEST_PLAN="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/Post-sequelize-vs-raw.jmx"

# Select which test plan to use (default: GET)
JMETER_TEST_PLAN="${1:-$GET_TEST_PLAN}"
REPORT_BASE="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/report"

# Create datetime folder
DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT_DIR="$REPORT_BASE/$DATETIME"
mkdir -p "$REPORT_DIR"

# Generate Summary for test plan
# Extract the base name of the test plan (without path and extension)
TEST_PLAN_BASENAME=$(basename "$JMETER_TEST_PLAN" .jmx)
RESULTS_FILE="$REPORT_DIR/results_${TEST_PLAN_BASENAME}.jtl"

jmeter -n -t "$JMETER_TEST_PLAN" -l "$RESULTS_FILE"

# Generate HTML report in the same output folder
jmeter -g "$REPORT_DIR/results_${TEST_PLAN_BASENAME}.jtl" -o "$REPORT_DIR/html-report"
