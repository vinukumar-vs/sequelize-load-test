#!/bin/bash

GET_TEST_PLAN="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/Get-sequelize-vs-raw.jmx"
POST_TEST_PLAN="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/Post-sequelize-vs-raw.jmx"

JMETER_TEST_PLAN="${1:-$GET_TEST_PLAN}"
REPORT_BASE="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/report"

# Define your parameters for each trial
THREADS=(10 10 10)
RAMPUPS=(1 2 3)
LOOPS=(10 100 1000)

RESULTS_FILES=()
REPORT_DIR=""

for i in 0 1 2; do
    DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
    REPORT_DIR="$REPORT_BASE/$DATETIME"
    mkdir -p "$REPORT_DIR"

    TEST_PLAN_BASENAME=$(basename "$JMETER_TEST_PLAN" .jmx)
    TRIAL_NAME="Users_${THREADS[$i]}_Rampup_${RAMPUPS[$i]}_Loops_${LOOPS[$i]}_Trial$((i+1))"
    TMP_JMX="$REPORT_DIR/tmp_${TEST_PLAN_BASENAME}.jmx"
    RESULTS_FILE="$REPORT_DIR/results_${TEST_PLAN_BASENAME}_${TRIAL_NAME}.jtl"

    # Copy and update Thread Group name in the JMX file
    sed "s/<stringProp name=\"ThreadGroup\.testname\">.*<\/stringProp>/<stringProp name=\"ThreadGroup.testname\">${TRIAL_NAME}<\/stringProp>/" "$JMETER_TEST_PLAN" > "$TMP_JMX"

    jmeter -n -t "$TMP_JMX" -l "$RESULTS_FILE"
    RESULTS_FILES+=("$RESULTS_FILE")
done

# Generate a combined report after all trials
COMBINED_RESULTS="$REPORT_DIR/combined_results.jtl"
cat "${RESULTS_FILES[@]}" > "$COMBINED_RESULTS"
jmeter -g "$COMBINED_RESULTS" -o "$REPORT_DIR/html-report"
