console.log('background ok');

chrome.runtime.onMessage.addListener(message); // listener for message
window.definition = "test"; // defines 'global' variable for selected image
window.word = "test"
def_txt = ''
var test_txt
function message(request, sender, response) { //activates if message is selected word
    if (request.id === 'selected_word') {
        console.log(request);
        window.word = request.text;
    }
    if (request.id === 'dictionary_raw_info') { // activates if message is raw dictionary info
        console.log(request.text);
        raw_txt = request.text;
 
        def_txt = ''
        word_txt = ''
        audio_url = ''

        audio_idx = raw_txt.search('audio":"//'); // creates audio url string
        var aud_ct = audio_idx + 10; // searches for a keyword that defines where the audio url begins
        while (aud_ct < raw_txt.length) { // iterates until the end of the url is reached
            audio_url += raw_txt[aud_ct];
            aud_ct += 1;
            if (raw_txt[aud_ct] == '"'){
                break
            }
        }
        console.log(audio_url);
        audio_url = 'https://' + audio_url;
        var p = 0;
        while (p < raw_txt.length) { // grabs the word from raw text
        
            word_txt += raw_txt[p];
            p += 1;
            if (raw_txt[p] == ',') {
                break
            }
        }
        

        var regex1 = /{"definition"/gi, result, indices = [];
        while ( (result = regex1.exec(raw_txt)) ) { //grabs the indices where definitions start
            indices.push(result.index);
        }
        
        var regex2 = /","synonyms/gi, result2, indix = [];
        while ( (result2 = regex2.exec(raw_txt)) ) {
            indix.push(result2.index); // grabs the indices where definitions begin
        }

        let def_idxn = (indices.length); 
        let def_idxnn = indix.length;

        var difference = [];
    
        counter2 = 0;
        x=0;
        y=0;

        while (counter2 < def_idxn) {   //extracts the definitions from the raw text
            x = indices[counter2];
            y = indix[counter2];
                while (x < y) {
                    def_txt += raw_txt[x];
                    x += 1;
                    if (x == y) {
                        def_txt += '."';
                        def_txt += "<br><br>"; // adds line breaks when definitions end and begin
                    }
                }
            counter2 += 1;
            
        }

        k = 0 // code below fixes formatting on definitions and on the defined word
        test_txt = def_txt.replace('{"definition"', "Definition");
        while (k < def_idxn) {
            if (k != 0) { // removes brackets from definition
                test_txt = test_txt.replace('{"definition"', "\n Definition");
            }
            k += 1
            test_txt = test_txt.replace('{"definition"', "Definition");
        }
        word_txt = word_txt.replace('[{"word":',"Word : ");

        
        final_definitions = { // packages parsed text into an object and sends it to worktest for print
            text : test_txt,
            id : 'def_ready',
            word: word_txt,
            audio: audio_url
        }
        chrome.runtime.sendMessage(final_definitions);
        
    }
}

