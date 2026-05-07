import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase(
  { name: 'downloads.db', location: 'default' },
  () => console.log('Database opened successfully'),
  (error) => console.log('DB open error:', error)
);

/**
 * Initialize the downloads table.
 * Returns a Promise that resolves when the table is ready.
 */
export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS downloads (
            id TEXT PRIMARY KEY,
            name TEXT,
            artist TEXT,
            album TEXT,
            filePath TEXT
          );`
        );
      },
      (error) => {
        console.log('DB init error:', error);
        reject(error);
      },
      () => resolve()
    );
  });
};

/**
 * Insert or update a downloaded song.
 */
export const insertDownload = (item: {
  id: string;
  name: string;
  artist: string;
  album: string;
  filePath: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO downloads (id, name, artist, album, filePath) VALUES (?, ?, ?, ?, ?);`,
          [item.id, item.name, item.artist, item.album, item.filePath]
        );
      },
      (error) => {
        console.log('Insert error:', error);
        reject(error);
      },
      () => resolve()
    );
  });
};

/**
 * Get all downloaded songs.
 */
export const getDownloads = (): Promise<
  { id: string; name: string; artist: string; album: string; filePath: string }[]
> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM downloads;`,
          [],
          (_, results) => {
            const items = results.rows.raw();
            resolve(items);
          }
        );
      },
      (error) => reject(error)
    );
  });
};

/**
 * Get a specific download by ID
 */
export const getDownloadById = (
  id: string
): Promise<{ id: string; name: string; artist: string; album: string; filePath: string } | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM downloads WHERE id=?;`,
          [id],
          (_, results) => {
            if (results.rows.length > 0) resolve(results.rows.item(0));
            else resolve(null);
          }
        );
      },
      (error) => reject(error)
    );
  });
};

/**
 * Delete a downloaded song
 */
export const deleteDownload = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`DELETE FROM downloads WHERE id=?;`, [id]);
      },
      (error) => reject(error),
      () => resolve()
    );
  });
};
