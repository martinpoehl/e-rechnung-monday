#!/usr/bin/env bash
# Lädt KoSIT-Validator und XRechnung-Konfiguration in den lokalen Cache.
# Der Integrationstest (kosit.integration.test.ts) überspringt sich selbst,
# solange dieser Cache fehlt – einmal ausführen genügt.
set -euo pipefail

CACHE="${KOSIT_CACHE:-$HOME/.cache/kosit-validator}"
JAR="$CACHE/validator.jar"
CONFIG_DIR="$CACHE/xr-config"

VALIDATOR_URL="https://github.com/itplr-kosit/validator/releases/download/v1.6.2/validator-1.6.2-standalone.jar"
CONFIG_URL="https://github.com/itplr-kosit/validator-configuration-xrechnung/releases/download/v2026-01-31/xrechnung-3.0.2-validator-configuration-2026-01-31.zip"

mkdir -p "$CACHE"

if [ ! -f "$JAR" ]; then
  echo "Lade KoSIT-Validator 1.6.2 …"
  curl -sL -o "$JAR" "$VALIDATOR_URL"
fi

if [ ! -f "$CONFIG_DIR/scenarios.xml" ]; then
  echo "Lade XRechnung-Konfiguration 3.0.2 (2026-01-31) …"
  curl -sL -o "$CACHE/config.zip" "$CONFIG_URL"
  mkdir -p "$CONFIG_DIR"
  unzip -qo "$CACHE/config.zip" -d "$CONFIG_DIR"
  rm "$CACHE/config.zip"
fi

echo "KoSIT-Cache bereit: $CACHE"
