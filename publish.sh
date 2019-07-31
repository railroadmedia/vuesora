#!/bin/bash

npm run lib:build;
git add --all
git commit -am "New build";

if git diff-index --quiet HEAD --; then
    npm run patch;
    PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')

    echo 'Creating Tag and Commit for Vuesora Version: ' $PACKAGE_VERSION

    git tag $PACKAGE_VERSION;
    git add --all
    git commit -am $PACKAGE_VERSION;
    git push --tags;
    git push;
else
    echo 'Local git directory is not clean! Commit your files and try again.'
fi

