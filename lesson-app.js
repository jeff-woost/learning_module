// Initialize CodeMirror editor
let editor;
let terminal = [];
let outputWindow = [];
let timerInterval;
let startTime;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror
    const textarea = document.getElementById('code-editor');
    editor = CodeMirror.fromTextArea(textarea, {
        mode: 'python',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        extraKeys: {
            "Ctrl-Enter": function() { runCode(); },
            "Cmd-Enter": function() { runCode(); }
        }
    });

    // Initialize UI
    initializeUI();
    startTimer();
});

function initializeUI() {
    // Run button
    document.getElementById('run-code').addEventListener('click', runCode);
    
    // Reset button
    document.getElementById('reset-code').addEventListener('click', resetCode);
    
    // Copy button
    document.getElementById('copy-code').addEventListener('click', copyCode);
    
    // Clear terminal
    document.getElementById('clear-terminal').addEventListener('click', clearTerminal);
    
    // Restart terminal
    document.getElementById('restart-terminal').addEventListener('click', restartTerminal);
    
    // Clear output
    document.getElementById('clear-output').addEventListener('click', clearOutput);
    
    // Export output
    document.getElementById('export-output').addEventListener('click', exportOutput);
    
    // Settings button
    document.getElementById('settings-btn').addEventListener('click', toggleSettings);
}

// Timer functionality
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

// Code execution
function runCode() {
    const code = editor.getValue();
    
    // Add to terminal
    addToTerminal(`python script.py`, 'input');
    
    // Simulate code execution (in real implementation, this would send to backend)
    simulateExecution(code);
}

function simulateExecution(code) {
    // Clear previous output
    clearOutput();
    
    // Simulate parsing and execution
    const lines = code.split('\n');
    let output = [];
    
    lines.forEach(line => {
        if (line.trim().startsWith('print(')) {
            // Extract print content (simplified)
            const content = line.match(/print\((.*)\)/);
            if (content) {
                let printValue = content[1].replace(/['"]/g, '');
                output.push(printValue);
            }
        }
    });
    
    // Display output
    if (output.length > 0) {
        output.forEach(line => {
            addToOutput(line, 'success');
            addToTerminal(line, 'output');
        });
    } else {
        addToOutput('No output', 'info');
    }
    
    // Add execution complete message
    addToTerminal('Process finished with exit code 0', 'success');
}

// Terminal functions
function addToTerminal(text, type = 'output') {
    const terminalBody = document.getElementById('terminal');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'input') {
        line.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-input">${text}</span>`;
    } else if (type === 'error') {
        line.innerHTML = `<span class="terminal-error">${text}</span>`;
    } else if (type === 'success') {
        line.innerHTML = `<span class="terminal-output" style="color: var(--accent-green)">${text}</span>`;
    } else {
        line.innerHTML = `<span class="terminal-output">${text}</span>`;
    }
    
    // Remove cursor from previous line
    const cursor = terminalBody.querySelector('.terminal-cursor');
    if (cursor) cursor.remove();
    
    terminalBody.appendChild(line);
    
    // Add new line with cursor
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cursor">_</span>`;
    terminalBody.appendChild(newLine);
    
    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function clearTerminal() {
    const terminalBody = document.getElementById('terminal');
    terminalBody.innerHTML = `
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-cursor">_</span>
        </div>
    `;
}

function restartTerminal() {
    clearTerminal();
    addToTerminal('Python terminal restarted', 'success');
}

// Output window functions
function addToOutput(text, type = 'normal') {
    const outputBody = document.getElementById('output-window');
    
    // Remove placeholder if exists
    const placeholder = outputBody.querySelector('.output-placeholder');
    if (placeholder) placeholder.remove();
    
    const line = document.createElement('div');
    line.className = `output-line output-${type}`;
    line.textContent = text;
    
    outputBody.appendChild(line);
    outputBody.scrollTop = outputBody.scrollHeight;
}

function clearOutput() {
    const outputBody = document.getElementById('output-window');
    outputBody.innerHTML = '<div class="output-placeholder">Output will appear here when you run your code...</div>';
}

// Editor functions
function resetCode() {
    editor.setValue('');
    editor.focus();
}

function copyCode() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        // Show feedback
        const btn = document.getElementById('copy-code');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.backgroundColor = 'var(--accent-green)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    });
}

// Export functionality
function exportOutput() {
    const outputBody = document.getElementById('output-window');
    const content = outputBody.textContent;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Settings toggle (placeholder)
function toggleSettings() {
    console.log('Settings clicked');
    // Implement settings modal/panel
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save (placeholder)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        console.log('Save triggered');
    }
    
    // Ctrl/Cmd + R to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        runCode();
    }
});

// Sample lesson content loader (placeholder)
function loadLesson(lessonData) {
    const questionContent = document.querySelector('.question-content');
    questionContent.innerHTML = `
        <h3>${lessonData.title}</h3>
        <p>${lessonData.description}</p>
        <div class="lesson-objectives">
            <h4>Learning Objectives:</h4>
            <ul>
                ${lessonData.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
        </div>
        <div class="lesson-instructions">
            <h4>Instructions:</h4>
            <p>${lessonData.instructions}</p>
        </div>
    `;
    
    // Load starter code if provided
    if (lessonData.starterCode) {
        editor.setValue(lessonData.starterCode);
    }
}

// Example usage
const sampleLesson = {
    title: "Introduction to Variables",
    description: "Learn how to create and use variables in Python.",
    objectives: [
        "Understand what variables are",
        "Learn how to create variables",
        "Practice using different data types"
    ],
    instructions: "Create a variable called 'name' and assign your name to it. Then print it out.",
    starterCode: "# Create your first variable\n# Hint: name = 'Your Name'\n\n"
};

// Load sample lesson after a short delay
setTimeout(() => {
    loadLesson(sampleLesson);
}, 500);