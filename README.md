# vite-node-sourcemap-issue
reproduction of sourcemap / error line number issue using vite-node

## setup
- `pnpm install`

## reproduction steps:
- run `node main.js`
- you should see the error line number is correct
- edit `example.ts`, adding an extra line break at the beginning an save
- you will see the file is reloaded and re-run but the error line number is now incorrect (depending on where you put it)