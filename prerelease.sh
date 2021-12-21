#!/bin/bash

if git diff-index --quiet HEAD --; then
    # Build the lib and commit the files
    npm run lib:build;
    git add --all
    git commit -am "New pre-release build";

    # Create a new patch version
    npm version prerelease --preid=staging

    git push;

    # Publish the Package
    npm publish --tag staging;
else
    echo 'Local git directory is not clean! Commit your files and try again.'
fi

