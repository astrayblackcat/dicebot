## Discord Dicebot
This is a simple Discord bot for personal use, based on discord.js, and pulls data from Google Sheets.
It's mostly built for tabletop games played over Discord and as a result it's rather specific in use-case.

#### Commands
- `/sheet [name] [sheet-id]` - Takes one string argument, a sheet ID from Google Sheets for a Fabula Ultima character sheet, and stores it in sheets.db.
- `/roll [dice-notation]` - Takes a string argument, in the form of dice notation. Can include any stats for a character sheet registered in `/sheet` in the form of shorthand, i.e, `WLP` or `MIG`.
  - `kh1 or kl1` are also valid, for representing, for keeping the highest or lowest of a multi-dice roll, as well as single numbers to add bonuses.
  - Consecutive dice notation should be joined with a `+`.
- `/characters` - Lists all of your characters, including which is active.
- `/rename [character]` - Renames a character. Fails if you have a character with that name already.
- `/select [character]` - Selects a different character, determining which is used when you use `/roll` with stats from your sheet.
- `/remove [character]` - Removes a character from your list.

Examples of valid `/roll` arguments: `1d6`, `2d20kh1+2`, `ins+wlp+1`

#### Build & Run
Requirements: node.js, npm, sqlite, discord API token and client ID, google sheets API key

Note that none of the build process is automated (although it really should be).

1. `git clone` and `cd` into the directory.
2. `npm install`
3. Create `config.json` and insert the following:
```
"token": "discord-api-token-here",
"clientId": "discord-client-id-here",
"sheetsApi": "google-sheets-api-key-here"
```
4. Create a sqlite database named `sheets.db` and open it in sqlite
5. Create the table with:
```
CREATE TABLE sheets(
user_id TEXT NOT NULL,
sheet_id TEXT NOT NULL,
character_name TEXT NOT NULL,
active BOOLEAN DEFAULT NULL,
UNIQUE(user_id, character_name),
UNIQUE(user_id, active)
);
```
6. `npx tsc` (or otherwise run tsc)
7. `node dist/deploy-commands.js`
8. `node .`

