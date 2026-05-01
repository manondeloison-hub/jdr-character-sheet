#!/bin/bash
# Affiché à Claude avant chaque git commit comme rappel automatique
VERSION=$(grep -o 'build-number">[0-9]*' public/index.html 2>/dev/null | grep -o '[0-9]*$')
LAST_VERSION=$(git log -1 --format="%s" 2>/dev/null | grep -o 'v[0-9]*' | grep -o '[0-9]*$' || echo "?")
echo "=== RAPPEL PRE-COMMIT ==="
echo "Version dans index.html : v${VERSION:-?}"
echo "Version du dernier commit : v${LAST_VERSION}"
if [ -n "$VERSION" ] && [ -n "$LAST_VERSION" ] && [ "$LAST_VERSION" != "?" ] && [ "$VERSION" -le "$LAST_VERSION" ] 2>/dev/null; then
  echo "ATTENTION : la version n'a pas été incrémentée ! Mettre à jour build-number dans index.html avant de committer."
  exit 2
fi
echo "Version OK."
