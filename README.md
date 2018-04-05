# axle-h.github.io

[ax-h.com](http://ax-h.com)

Requires ruby and node.

Some gems also have dependencies.

```bash
# Install build dependencies, node and ruby
sudo apt install build-essential zlib1g-dev autoconf nodejs npm ruby-full

# Install bundler so that we can get jekyll and dependencies
sudo gem install bundler

# Run npm install and bundle install
./build.sh install
```

Then in two separate terminals I run webpack with:

```bash
./build.sh watch
```

And jekyll with:

```bash
./build.sh serve
```