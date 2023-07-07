# Contributing

## Development

```sh
npm i
npm start # start dev server
npm run build # create production build
npm test # run test suite (runs against last production build)
npm run update-hacks # update local copies of hacks
```

### Adding new Bitsy templates

Bitsy templates are stored in [`./src/template/`](./src/template). To add a new one:

1. Open Bitsy editor
2. Create a new game to ensure gamedata/settings are default
3. Export a game as html
4. Replace key sections of html with Borksy template tags
   - `<!-- HEADER -->` -> metadata comments
   - `<title>` -> `{{TITLE}}`
   - `<script type="text/bitsyGameData" id="exportedGameData">` -> `{{{GAMEDATA}}}`
   - `<style>` -> `{{{CSS}}}`
   - below font data -> borksy hacks + additional js
   - `<!-- GAME CANVAS -->` -> `{{{MARKUP}}}`
   - HD
     - include "HD" in header metadata
     - `textboxInfo.top`/`left`/`bottom` -> `*2`
     - `var scale = 4;` -> `var scale = 2;`
     - `var tilesize = 8;` -> `var tilesize = 16;`
5. Place game file in template folder with name `Bitsy.<version>.txt`

## Release

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automatically bump version, update changelog, and publish releases to both GitHub and itch.io based on commit messages.
