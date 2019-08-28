#!/bin/bash

# Ask the user which app they want to Symlink with
echo Which application would you like to create a symlink for?
options=("drumeo" "pianote" "guitareo")
select opt in "${options[@]}"
do
    case $opt in
        "drumeo")
            echo "Symlinking Vuesora with Drumeo!"
            npm run lib:watch & npm link; cd /app/drumeo/laravel; npm rebuild node-sass; npm link vuesora; npm run watch;
            echo "Watching Drumeo For Changes..."
            ;;
        "pianote")
            echo "Symlinking Vuesora with Pianote!"
            npm run lib:watch & npm link; cd /app/pianote; npm rebuild node-sass; npm link vuesora; npm run watch;
            echo "Watching Pianote For Changes..."
            ;;
        "guitareo")
            echo "Symlinking Vuesora with Guitareo!"
            npm run lib:watch & npm link; cd /app/guitareo; npm rebuild node-sass; npm link vuesora; npm run watch;
            ;;
        *)
          echo "Invalid option $REPLY"
          break
          ;;
    esac
done

