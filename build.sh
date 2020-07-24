#!/bin/bash
set -e

BUNDLE=bundle
JEKYLL="$BUNDLE exec jekyll"
NPM=npm

install () {
  $BUNDLE install --path vendor/bundle
	$NPM install
}

build () {
  $NPM run build
	$JEKYLL build
}

serve () {
	$JEKYLL serve
}

watch () {
  $NPM run watch
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
