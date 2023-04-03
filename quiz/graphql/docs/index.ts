import fs from 'fs';
import path from 'path';

export default (name: string) => {
    return fs.readFileSync(path.join(__dirname, `${name}.md`), 'utf8');
}
