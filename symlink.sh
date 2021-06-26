#!/bin/bash

# Ask the user which app they want to Symlink with
echo Which application would you like to create a symlink for?
options=("drumeo" "pianote" "guitareo" "singeo")
select opt in "${options[@]}"
do
    case $opt in
        "drumeo")
            echo "Symlinking Vuesora with Drumeo!"
            yarn install; yarn lib:watch & yarn link; cd /app/drumeo/laravel; yarn link vuesora; yarn watch;
            echo "Watching Drumeo For Changes..."
            ;;
        "pianote")
            echo "Symlinking Vuesora with Pianote!"
            yarn install; yarn lib:watch & yarn link; cd /app/pianote; yarn link vuesora; yarn watch;
            echo "Watching Pianote For Changes..."
            ;;
        "guitareo")
            echo "Symlinking Vuesora with Guitareo!"
            yarn install; yarn lib:watch & yarn link; cd /app/guitareo; yarn link vuesora; yarn watch;
            ;;
        "singeo")
            echo "Symlinking Vuesora with Singeo!"
            yarn install; yarn lib:watch & yarn link; cd /app/singeo; yarn link vuesora; yarn watch;
            ;;
        *)
          echo "Invalid option $REPLY"
          break
          ;;
    esac
done

