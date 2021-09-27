# axle-h.github.io

[ax-h.com](http://ax-h.com)

Requires ruby, node & bundler.
Follow the [GitHub Pages documentation](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll).

### Mac
Everything can be installed from [Homebrew](https://brew.sh/).
```bash
# Install node
brew install node@14
brew link node@14
npm install -g npm --force
brew install ruby
```

### Ubuntu
The packaged node is a nightmare, I would recommend [NodeSource](https://github.com/nodesource/distributions/blob/master/README.md).
```bash
# Install ruby
sudo apt install build-essential ruby-full
```

Then on all platforms:

```bash
# Install bundler
gem install bundler

# Run npm install and bundle install
./build.sh install
```

Then in two separate terminals run webpack and jekyl (in that order!) with:

```bash
./build.sh watch
```

```bash
./build.sh serve
```

## TODO

I am aware that the CSS library I've used to build this site [is dead](https://github.com/Dogfalo/materialize/issues/6438)
and has some open CVE's. I'm not using any features affected but ergh.
Maybe I will port it all to Bootstrap 5 for fun when that comes out I don't know.
