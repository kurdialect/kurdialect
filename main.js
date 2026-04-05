document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const outputContainer = document.getElementById('output');
    const installButton = document.getElementById('installButton');
    let deferredPrompt;

    const renderResults = (resultsArray) => {
        const headingContainer = document.getElementById('search-heading');
        
        if (!resultsArray || resultsArray.length === 0) {
            outputContainer.innerHTML = '<p>No results found.</p>';
            outputContainer.classList.add('visible');
            headingContainer.style.display = 'none';
            return;
        }

        outputContainer.innerHTML = '';
        headingContainer.innerHTML = '';
        let hasResults = false;

        resultsArray.forEach(({ word, results }) => {
            if (results.length === 0) return;
            hasResults = true;
            
            // Create a section for each search term
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('search-section');
            
            // Add heading for this specific word
            const heading = document.createElement('h3');
            heading.textContent = `Results for "${word}"`;
            sectionDiv.appendChild(heading);

            results.forEach(row => {
                const resultDiv = document.createElement('div');
                resultDiv.classList.add('search-result');
                const sorani = row.sorani || row[0] || '';
                const badini = row.badini || row[1] || '';
                const hawrami = row.hawrami || row[2] || '';
                const image = row.image || row[3] || '';

                const resultTextDiv = document.createElement('div');
                resultTextDiv.classList.add('result-text');
                let resultHTML = `
                    <p><strong style="color: #c05510;">سۆرانی</strong>: ${sorani}</p>
                    <p><strong style="color: #2e6095;">هەورامی</strong>: ${hawrami}</p>
                    <p><strong style="color: #f5c265;">بادینی</strong>: ${badini}</p>
                `;
                resultTextDiv.innerHTML = resultHTML;

                const resultImageDiv = document.createElement('div');
                resultImageDiv.classList.add('result-image');
                resultImageDiv.innerHTML = image ? `<img src="${image}" alt="Image" />` : '';

                resultDiv.appendChild(resultTextDiv);
                resultImageDiv && resultDiv.appendChild(resultImageDiv);
                sectionDiv.appendChild(resultDiv);
            });
            
            outputContainer.appendChild(sectionDiv);
        });
        
        if (!hasResults) {
            outputContainer.innerHTML = '<p>No results found.</p>';
            headingContainer.style.display = 'none';
        } else {
            headingContainer.style.display = 'none'; // Hide the separate heading since each section has its own
        }
        outputContainer.classList.add('visible');
    };

    // Attach handlers that call the new API endpoints. If the server isn't running,
    // the service worker or the static fallback will still allow the app to function offline.
    searchButton.addEventListener('click', async () => {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.trim();
        
        // Easter Egg Trigger: 11-B
        if (searchTerm === '11-B') {
            searchInput.classList.add('spin-animation');
            
            setTimeout(() => {
                searchInput.classList.remove('spin-animation');
                document.body.classList.toggle('easter-egg-mode');
                
                // Clear everything
                searchInput.value = '';
                outputContainer.innerHTML = '';
                outputContainer.classList.remove('visible');
                document.getElementById('search-heading').style.display = 'none';
                outputContainer.style.backgroundColor = '#f0f0f0'; // Reset background if needed
            }, 1000);
            return;
        }
        
        if (searchTerm === '6-7') {
            searchInput.classList.add('tilt-67');
            
            setTimeout(() => {
                searchInput.classList.remove('tilt-67');
            }, 1500);
            
            // Clear input
            searchInput.value = '';
            outputContainer.innerHTML = '';
            outputContainer.classList.remove('visible');
            document.getElementById('search-heading').style.display = 'none';
            return;
        }

        if (!searchTerm) return;

        loadingScreen.style.display = 'flex';
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
            const json = await resp.json();
            renderResults(json);
        } catch (err) {
            console.error('Search failed, trying offline fallback', err);
            try {
                // Embedded data for offline functionality
                const data = [
                    ["سۆرانی", "بادینی", "هەورامی"],
                    ["سڵاو", "سلاڤ", "سڵام"],
                    ["هێنان", "ئینان", "ئاوردەی"],
                    ["شکان", "شکاند", "مەڕدەی"],
                    ["بردن", "بر", "بەڕدەی"],
                    ["خواردن", "خۆر", "واردەی"],
                    ["بەڕیوەبەرایەتی", "ڕێڤەبەریا", "ڕاوەبەرایەتی"],
                    ["بەرگری", "بەرەڤانیا", "پاراستەی"],
                    ["ڕەگەزنامە", "نەژاد نامە", "ڕەگەزنامە"],
                    ["لادان", "لادان", "لاژای"],
                    ["بنەرەت", "بنەچە", "بنبات"],
                    ["نوێكردنەوە", "نوی كردڤە", "تاكەردەكی"],
                    ["ئاگادار كردنەوە", "پێ حەساندن", "هاگاژاركەردەوی"],
                    ["ئاڕاستە", "سەمت", "ئاراستە"],
                    ["كرێ", "كرێ", "كریها"],
                    ["بێجگەلە", "ژبلی", "بیجگەچە"],
                    ["سور", "سور", "سور", "https://upload.wikimedia.org/wikipedia/commons/b/b9/Solid_red.png"],
                    ["زەرد", "زەرد", "زەرد", "https://upload.wikimedia.org/wikipedia/commons/6/6d/Solid_yellow.png"],
                    ["شین", "شین", "کەوە", "https://upload.wikimedia.org/wikipedia/commons/e/e5/Solid_blue.png"],
                    ["سەوز", "کەسک", "سۆز", "https://upload.wikimedia.org/wikipedia/commons/c/c7/Solid_green.png"],
                    ["پرتەقاڵی", "پرتەقاڵی", "پڕتەقاڵی", "https://upload.wikimedia.org/wikipedia/commons/4/40/Dark_orange.PNG"],
                    ["سپی", "سپی", "چەرمە", "https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png"],
                    ["ڕەش", "ڕەش", "سیاو", "https://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png"],
                    ["رەساسی", "ڕەساسی", "رەساسی", "https://upload.wikimedia.org/wikipedia/commons/5/5f/Grey.PNG"],
                    ["قاوەیی", "قەهوایی", "قاوەیی", "https://upload.wikimedia.org/wikipedia/commons/a/a7/Solid_brown.svg"],
                    ["پەمەیی", "پیڤازی", "پەمەیی", "https://upload.wikimedia.org/wikipedia/commons/6/6d/Solid_pink.svg"],
                    ["مۆر", "بەنەفشی/خەمر", "وەنۆشەلی", "https://upload.wikimedia.org/wikipedia/commons/2/24/Solid_purple.svg"],
                    ["سێو", "سێڤ", "ساوی", "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg"],
                    ["پڕتەقاڵ", "پڕتەقاڵ", "پڕتەقاڵ", "https://upload.wikimedia.org/wikipedia/commons/c/cc/Scan_of_an_orange.png"],
                    ["شووتی", "شتی/شمتی", "شووتی", "https://upload.wikimedia.org/wikipedia/commons/2/2f/Watermelone1.png"],
                    ["لالەنگی", "لالەنگی", "لالەنگی", "https://upload.wikimedia.org/wikipedia/commons/5/5d/Clementines_whole%2C_peeled%2C_half_and_sectioned.jpg"],
                    ["گوێزەر", "گێزەر", "گێزەر", "https://upload.wikimedia.org/wikipedia/commons/a/aa/Carrots.svg"],
                    ["هەرمێ", "هرمی", "هەرمێ", "https://upload.wikimedia.org/wikipedia/commons/6/6a/Pears.png"],
                    ["هەنار", "هنار", "هەنار", "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pomegranate.jpg"],
                    ["هەنجیر", "هەژیر", "هەنجیر", "https://upload.wikimedia.org/wikipedia/commons/c/c8/Fig_%28Ficus_carica%29_fruits.jpg"],
                    ["شیلک", "فەراولە", "شلیک", "https://upload.wikimedia.org/wikipedia/commons/8/86/Strawberry_%28transparent_background%29.png"],
                    ["توو", "تی", "تفی", "https://upload.wikimedia.org/wikipedia/commons/1/1e/Morus-alba.jpg"],
                    ["خەیار", "خەیار", "خەیار", "https://upload.wikimedia.org/wikipedia/commons/1/1b/Cucumber_plants.jpg"],
                    ["باینجان", "باجان رەش", "باینجان", "https://upload.wikimedia.org/wikipedia/commons/1/1f/Eggplant_01.jpg"],
                    ["کولەکە", "کولند", "کولەکێ", "https://upload.wikimedia.org/wikipedia/commons/0/09/Zucchini2.png"],
                    ["ترۆزی", "ترۆزی", "ترۆزی", "https://upload.wikimedia.org/wikipedia/commons/2/28/Armenian_cucumbers.jpeg"],
                    ["هەڵووژە", "حلیک", "هەلوچی", "https://pngtree.com/freepng/several-cut-fresh-plums-and-combination_5509197.html"]
                ];
                const words = searchTerm.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
                const resultsArray = words.map(word => ({
                    word,
                    results: data.filter(row => row.some(cell => {
                        if (!cell) return false;
                        const lowerCell = cell.toLowerCase();
                        return lowerCell === word || lowerCell.startsWith(word + ' ') || lowerCell.endsWith(' ' + word) || lowerCell.includes(' ' + word + ' ');
                    }))
                }));
                renderResults(resultsArray);
            } catch (err2) {
                console.error('Offline fallback also failed', err2);
                outputContainer.innerHTML = '<p>No results found (offline).</p>';
            }
        } finally {
            loadingScreen.style.display = 'none';
        }
    });

    document.getElementById('searchInput').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    clearButton.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        outputContainer.innerHTML = '';
        outputContainer.classList.remove('visible');
        document.getElementById('search-heading').style.display = 'none';
    });

    installButton.style.display = 'flex';  

    installButton.addEventListener('click', () => {
        // Check if iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
            // On iOS, show instructions for adding to home screen
            alert('To install this app on iOS:\n\n1. Tap the Share button (square with arrow) in Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right\n\nThe app will appear on your home screen like a native app!');
            return;
        }
        
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
                installButton.style.display = 'none'; 
            });
        }
    });

    window.searchTerm = (term) => {
        document.getElementById('searchInput').value = term;
        searchButton.click();
    };

    window.addEventListener('beforeinstallprompt', (event) => {
        deferredPrompt = event; 
        installButton.style.display = 'flex';  
    });
});
