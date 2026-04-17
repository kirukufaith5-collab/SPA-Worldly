// Selecting DOM elements
const dictionaryForm = document.getElementById('dictionary-form');
const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');
const wordTitle = document.getElementById('word-title');
const phoneticText = document.getElementById('phonetic-text');
const audioPlayer = document.getElementById('audio-player');

// 1. Handling user input and events
//Remember that adding Event listener  you must add two paramters one is event and second is callback function
dictionaryForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const word = searchInput.value.trim();
    if (word) {
        fetchWordData(word);
    }
});

// 2. Fetching data from the API
async function fetchWordData(word) {
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    try {
        // Clear previous results and show loading state
        resultContainer.innerHTML = '<h2>Searching...</h2>';
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();
        displayData(data[0]); // Pass the first entry of the result array
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: red;">${error.message}. Please try another word.</p>`;
    }
}

// 3. Parsing and displaying the fetched data
function displayData(data) {
    // Reset container structure
    resultContainer.innerHTML = `
        <h2 id="word-title">${data.word}</h2>
        <p id="phonetic-text">${data.phonetic || ''}</p>
        <audio id="audio-player" controls></audio>
        <div id="definitions"></div>
    `;

    const definitionsDiv = document.getElementById('definitions');
    const audioPlayer = document.getElementById('audio-player');

    // Handle Audio
    const audioSrc = data.phonetics.find(p => p.audio)?.audio;
    if (audioSrc) {
        audioPlayer.src = audioSrc;
        audioPlayer.style.display = 'block';
    } else {
        audioPlayer.style.display = 'none';
    }

    // Parse Meanings, Definitions, and Synonyms
    data.meanings.forEach(meaning => {
        const partOfSpeech = `<h3>${meaning.partOfSpeech}</h3>`;
        let definitionList = '<ul>';
        
        meaning.definitions.forEach(def => {
            definitionList += `<li>${def.definition}</li>`;
        });
        
        definitionList += '</ul>';

        // Add synonyms if they exist
        let synonyms = '';
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            synonyms = `<p><strong>Synonyms:</strong> ${meaning.synonyms.slice(0, 5).join(', ')}</p>`;
        }

        definitionsDiv.innerHTML += `${partOfSpeech}${definitionList}${synonyms}`;
    });
}