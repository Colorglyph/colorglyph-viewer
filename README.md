```bash
npm i
npm run start
```

Works (uses `stellar-sdk`)
```bash
curl -s http://localhost:8787/works/9eb925d1fe9970fc0e2e93ad1b4c8c1e92136600f9aac84b89dda44814d188cb.png
```

Broken (uses `colorglyph-sdk`)
```bash
curl -s http://localhost:8787/broken/9eb925d1fe9970fc0e2e93ad1b4c8c1e92136600f9aac84b89dda44814d188cb.png

[TypeError]: XDR Write Error: [object Object] is not a ScVal
```

Works (uses `colorglyph-sdk`)
```bash
cd bun_tests
bun install
bun run index.ts
```