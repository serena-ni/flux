# flux

flux is an energy-based sliding puzzle inspired by 2048.

## how it works
- slide tiles using arrow keys
- merge equal tiles to grow them
- moves consume energy
- higher-value tiles restore less energy

## instability
- tiles ≥ 128 become unstable
- having 3 or more unstable tiles drains energy
- unstable tiles are harder to manage

## losing
you lose if:
- energy reaches zero
- the grid fills and no merges are possible (overload)

## controls
arrow keys

## preview

![screenshot of game](screenshot.png)