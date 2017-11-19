#!/bin/bash

BUNDLE=bundle
JEKYLL="$BUNDLE exec jekyll"
NPM=npm

install () {
    $BUNDLE install --path vendor/bundle
	$NPM install
    mkdir -p _sass/materialize _sass/font-awesome assets/fonts
	cp -r node_modules/materialize-css/sass/* _sass/materialize
	cp node_modules/materialize-css/dist/js/materialize.min.js assets/javascript
    cp node_modules/jquery/dist/jquery.min.js assets/javascript
    cp -r node_modules/materialize-css/dist/fonts/roboto/* assets/fonts
    cp -r node_modules/font-awesome/scss/* _sass/font-awesome
    cp -r node_modules/font-awesome/fonts/* assets/fonts
}	

build () {
	$JEKYLL build
}

serve () {
	$JEKYLL serve
}

clean () {
	rm -rf _site
}

purge () {
    clean
	rm -f assets/javascript/materialize.min.js
    rm -f assets/javascript/jquery.min.js
	rm -rf _sass/materialize
    rm -rf _sass/font-awesome
    rm -rf assets/fonts
}

help () {
    echo "Usage: $0 <command>"
    echo "Where <command> is one of:"
    echo "   install, build, serve, clean, purge"
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
    clean) clean ;;
    purge) purge ;;
    *) help ;;
esac