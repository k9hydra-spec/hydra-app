#!/bin/bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
cd "/Users/ronisbn/hydra app"
exec npm run dev -- --port 5173
