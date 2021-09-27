#!/bin/bash
set -e

install () {
  bundle install --path vendor/bundle
	npm install
}

build () {
  npm run build
	bundle exec jekyll build
}

serve () {
	bundle exec jekyll serve
}

watch () {
  npm run watch
}

clean () {
	rm -rf _site
}

help () {
  echo "Usage: $0 <command>"
  echo "Where <command> is one of:"
  echo "   install, build, serve, watch, clean"
}

if [ -z "$1" ]
then
  help
  exit 1
fi

case "$1" in
  install) install ;;
  build) build ;;
  serve) serve ;;
  watch) watch ;;
  clean) clean ;;
  *) help ;;
esac
