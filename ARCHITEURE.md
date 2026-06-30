# Architecture Overview

## High-Level Structure
The project is currently a single-page browser game with shared state and a central loop. The long-term direction is to split responsibilities into dedicated modules under the src folder.

## Current Responsibilities
- index.html hosts the canvas and UI shell.
- style.css provides the base presentation layer.
- game.js contains the game loop, state, rendering, input, combat, and persistence logic.

## Planned Evolution
- Move gameplay systems into src/core, src/player, src/enemy, src/combat, and src/save.
- Introduce additional modules for UI, audio, particles, and animation.
