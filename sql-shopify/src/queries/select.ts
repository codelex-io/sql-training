export const selectCount = (table: string): string => {
  return `select count(*) as c from ${table}`;
};

export const selectRowById = (id: number, table: string): string => {
  return `SELECT * FROM ${table} WHERE id = ${id}`;
};

export const selectCategoryByTitle = (title: string): string => {
  return `SELECT * FROM categories WHERE title = '${title}'`;
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `select a.title as app_title, c.id as category_id, c.title as category_title from apps_categories ac join categories c on c.id = ac.category_id join apps a on a.id = ac.app_id where a.id = ${appId}`;
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  return `SELECT count(*) as c FROM (SELECT DISTINCT ${columnName} FROM ${tableName})`
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  return `SELECT * FROM reviews WHERE app_id = ${appId} AND author = '${author}';`
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  return `SELECT ${columnName} FROM ${tableName};`
};

