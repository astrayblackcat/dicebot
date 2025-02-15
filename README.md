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
Requirements: node.js, npm, sqlite3, discord API token and client ID, google sheets API key

1. `git clone` and `cd` into the directory.
2. Create `.env` following the schema in `.env.example`. (You may delete or rename .env.example.)
3. `npm run setup`
4. `node .`

