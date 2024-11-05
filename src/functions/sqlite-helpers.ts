import Database from "better-sqlite3";

const db = new Database('sheets.db', { fileMustExist: true })

export const setActive = (user_id: string, character_name: string) => {
  const checkExists = db.prepare(`SELECT user_id, character_name
                                  FROM sheets
                                  WHERE user_id = ?
                                  AND character_name = ?`)

  const deactivate = db.prepare(`UPDATE sheets 
                                 SET active = NULL 
                                 WHERE user_id = ?`);
  const activate = db.prepare(`UPDATE sheets
                               SET active = true
                               WHERE character_name = ?`);

  if (checkExists.get(user_id, character_name)) {
    deactivate.run(user_id);
    activate.run(character_name);
  } 
  else {
    const error = new Error(`No character found.`);
    (error as any).code = "MissingChar";
    throw error;
  }
}

export const getNames = (user_id: string): string[] => {
  const names: string[] = [];
  const search = db.prepare(`SELECT character_name
                           FROM sheets
                           WHERE user_id = ?`);
  const searchFunc = (id: string) => {return search.all(id)};
  const searchResults = searchFunc(user_id) as {character_name: string}[]; // SQLite gives us an array of objects with a single key-value pair.
  searchResults.forEach(obj => names.push(Object.values(obj)[0])) // Convert that array of key-value pairs into an array of strings

  return names;
}

