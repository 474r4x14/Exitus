# Exitus

Originally starting out as just a project to learn ECMA6 by converting and updating a collection of scripts but now plan to continue developing it into a game.

The game will (eventually) be a strategic urban survival game in a procedurally generated city. 

Most changes are being pushed into the develop branch so make sure to look there for the latest workings.

For coding updates you can [visit the dev blog](https://defenestrate.me/category/projects/game-development/exitus/) 

## Transpiling
You can transpile the code to ECMA5 using Google's [Closure Compiler](https://developers.google.com/closure/compiler/) by running the following from the project root:
```
java -jar closure-compiler-v20180506.jar --language_in=ECMASCRIPT_2017 --language_out=ES5_STRICT --module_resolution=NODE --compilation_level ADVANCED_OPTIMIZATIONS --js_output_file=./js/exitus.min.js --js './js/src/**.js'
```