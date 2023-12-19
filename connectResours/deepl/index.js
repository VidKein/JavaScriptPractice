
import * as deepl from 'deepl-node';

const authKey = "f63c02c5-f056-..."; // Replace with your key
const translator = new deepl.Translator(authKey);

(async () => {
    const result = await translator.translateText('Hello, world!', null, 'fr');
    console.log(result.text); // Bonjour, le monde !
})();