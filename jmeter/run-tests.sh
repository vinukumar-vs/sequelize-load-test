#!/bin/bash

GET_TEST_PLAN="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/Get-sequelize-vs-raw.jmx"
POST_TEST_PLAN="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/Post-sequelize-vs-raw.jmx"

JMETER_TEST_PLAN="${1:-$GET_TEST_PLAN}"
REPORT_BASE="/Users/vinukumar/Documents/projects/experiments/sequelize-load-test/jmeter/report"

DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT_DIR="$REPORT_BASE/$DATETIME"
mkdir -p "$REPORT_DIR"
# Configuration for 3 specific runs
THREADS_LIST=(100 100 100)
RAMPUP_LIST=(10 10 10)
LOOPS_LIST=(1000 5000 10000)
RUNS=1

for idx in "${!THREADS_LIST[@]}"; do
    THREADS="${THREADS_LIST[$idx]}"
    RAMPUP="${RAMPUP_LIST[$idx]}"
    LOOPS="${LOOPS_LIST[$idx]}"

    TEST_PLAN_BASENAME=$(basename "$JMETER_TEST_PLAN" .jmx)
    TRIAL_NAME="Users_${THREADS}_Rampup_${RAMPUP}_Loops_${LOOPS}"
    TMP_JMX="$REPORT_DIR/tmp_${TEST_PLAN_BASENAME}_${TRIAL_NAME}.jmx"
    RESULTS_FILE="$REPORT_DIR/results_${TEST_PLAN_BASENAME}_${TRIAL_NAME}.jtl"

    # Use a more specific sed pattern for loops (ThreadGroup.main_controller.loops)
    sed -e "s|<intProp name=\"ThreadGroup.num_threads\">.*</intProp>|<intProp name=\"ThreadGroup.num_threads\">${THREADS}</intProp>|" \
        -e "s|<intProp name=\"ThreadGroup.ramp_time\">.*</intProp>|<intProp name=\"ThreadGroup.ramp_time\">${RAMPUP}</intProp>|" \
        -e "s|<stringProp name=\"LoopController.loops\">.*</stringProp>|<stringProp name=\"LoopController.loops\">${LOOPS}</stringProp>|" \
        "$JMETER_TEST_PLAN" > "$TMP_JMX"

    for ((i=1; i<=RUNS; i++)); do
        TRIAL_NAME_RUN="${TRIAL_NAME}_Run${i}"
        TMP_JMX_RUN="$REPORT_DIR/tmp_${TEST_PLAN_BASENAME}_${TRIAL_NAME_RUN}.jmx"
        RESULTS_FILE_RUN="$REPORT_DIR/results_${TEST_PLAN_BASENAME}_${TRIAL_NAME_RUN}.jtl"
        HTML_REPORT_DIR="$REPORT_DIR/html-report_${TRIAL_NAME_RUN}"

        # Update thread name for this run
        sed "s/<stringProp name=\"ThreadGroup\.testname\">.*<\/stringProp>/<stringProp name=\"ThreadGroup.testname\">${TRIAL_NAME_RUN}<\/stringProp>/" "$TMP_JMX" > "$TMP_JMX_RUN"

        jmeter -Jjmeter.save.saveservice.timestamp_format=yyyy/MM/dd\ HH:mm:ss.SSS -n -t "$TMP_JMX_RUN" -l "$RESULTS_FILE_RUN"

        # Generate HTML report for this run
        jmeter -Jjmeter.save.saveservice.timestamp_format=yyyy/MM/dd\ HH:mm:ss.SSS -g "$RESULTS_FILE_RUN" -o "$HTML_REPORT_DIR"
    done
done
