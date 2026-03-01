# Install dependencies
install:
    bundle install

# Serve locally with live reload (http://localhost:4000)
serve:
    bundle exec jekyll serve

# Build static site to _site/
build:
    bundle exec jekyll build

# Clean generated site files
clean:
    bundle exec jekyll clean

# Build and open in browser
open: build
    open http://localhost:4000
    bundle exec jekyll serve
