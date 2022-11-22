import fs from 'node:fs';

/**
 * @function writeDataAsJsonFile
 * @summary  async function that writes an object as a string in JSON format to a file
 * @example  await writeDataAsJsonFile({
 *   path: 'outputDirectory/',
 *   fileName: 'my-data.json',
 *   data: referenceToDataObject
 * });
 * @param    {Object} obj object with parameters
 * @param    {string} obj.path
 * @param    {string} obj.fileName
 * @param    {Object} obj.data
 * @returns  {boolean} true if file was written successfully
 */
export const writeDataAsJsonFile = async ({ path, fileName, data }) => {
  try {
    if (!fs.existsSync(path)) {
      await fs.mkdirSync(path);
    }
    await fs.writeFileSync(`${path}${fileName}`, JSON.stringify(data, null, 2));

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
};
