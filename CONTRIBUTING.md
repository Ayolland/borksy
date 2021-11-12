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
   - TODO: list all expected template tags
5. Place game file in template folder with name `Bitsy.<version>.txt`
6. Add import/export to [`index`](./src/template/index.js) in template folder for new file

## Release

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automatically bump version, update changelog, and publish releases based on commit messages.

It will eventually be setup to publish to itch.io automatically, but there are issues preventing this atm. In the meantime, a production build can be made locally, and zipped + uploaded manually.