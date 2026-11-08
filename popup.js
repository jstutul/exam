
const GEMINI_API_KEY = "AIzaSyAqIMoPN77n-huhBn9APkoRjZ3bJXCu5e4"; // Get this from Google AI Studio
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString(),
    }, (selection) => {
        const selectedText = selection[0].result;
        if (selectedText) {
            fetchAIAnswer(selectedText);
        } else {
            document.getElementById('answer').innerText = "Highlight text first!";
        }
    });
});

async function fetchAIAnswer(questionText) {
    const display = document.getElementById('answer');
    display.innerText = "Analyzing question...";

    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Provide a concise answer for this exam question: ${questionText}` }]
                }]
            })
        });

        const data = await response.json();
        
        // Extracting the text from the Gemini response structure
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            display.innerText = data.candidates[0].content.parts[0].text;
        } else {
            display.innerText = "No answer found. Check your API key.";
        }
    } catch (error) {
        display.innerText = "Error: " + error.message;
    }
}