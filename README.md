# Desk Shell

Phase 1 Electron desktop shell (`com.abufaizi.deskshell`).

## Develop

```bash
npm install
npm run dev
```

## Verify

```bash
npm run typecheck
npm test
```

## Windows build (Linux host)

Install Wine (including `wine32:i386`), then:

```bash
npm run build:win
```

Artifacts: `dist/desk-shell-0.1.0-setup.exe` and `dist/desk-shell-0.1.0-portable.exe`.

Unsigned builds: on Windows, use **More info → Run anyway** if SmartScreen appears. Copy the exe out of the Cursor Agent Store into Downloads before launching if Windows blocks execution from the store path.
