# Common Commands We Will Be Using


```bash
npm run dev 
# to run the project on your machine

npm install
# installs dependencies (may need this)

npx prettier --write . 
# run every so often. just reformats the code to be more readable 
```

# Please Please Please

Do NOT push directly to the main branch! Make your own feature branch first, then (when very very sure na OK na feature mo) create a pull request and ping Thea.

Try to use conventional commits (https://www.conventionalcommits.org/en/v1.0.0/)



# Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

(NOTE FROM THEA: Skeleton docs here https://www.skeleton.dev/docs)


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab (NOTE FROM THEA: we wont use this one)
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```


