#include "lazy-client.h"
#include <stdlib.h>
#include <string.h>

struct GameList *loadGames(char *data, unsigned size) {
    struct GameList *gameList = malloc(sizeof(struct GameList));
    gameList->gameCount = 0;

    FILE* f = fmemopen((void*)data, size, "r");
    if (!f) return gameList;

    fscanf(f, "%u\n", &(gameList->gameCount));
    gameList->games = malloc(sizeof(struct GameState) * gameList->gameCount);
    for (unsigned i = 0; i < gameList->gameCount; ++i)
    {
        struct GameState game = deserialize(f);
        gameList->games[i] = game;
    }
    return gameList;
}

unsigned getGameCount(struct GameList *gameList) {
    return gameList->gameCount;
}

struct GameState* getGame(struct GameList *gameList, unsigned index) {
    return &(gameList->games[index]);
}

char* getGameName(struct GameState *game) {
    return game->gameName;
}

char* getGameId(struct GameState *game) {
    return game->id;
}


unsigned getPlayerCount(struct GameState *game) {
    return game->playerCount;
}

char* getPlayerName(struct GameState *game, unsigned index) {
    return game->playerName[index];
}

char* getPlayerColor(struct GameState *game, unsigned index) {
    return game->playerColor[index];
}
