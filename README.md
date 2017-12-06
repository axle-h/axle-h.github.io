# axle-h.github.io

[ax-h.com](http://ax-h.com)

Requires ruby and node.

Some gems also have dependencies.

```bash
sudo apt install build-essential zlib1g-dev autoconf
sudo gem install bundler
./build.sh install
```

Then in two seperate terminals I run webpack with:

```bash
./build.sh watch
```

And jekyll with:

```bash
./build.sh serve
```