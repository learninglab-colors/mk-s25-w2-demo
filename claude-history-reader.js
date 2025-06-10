#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function truncateContent(content, maxLength = 200) {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
}

function copyConversationsToLog() {
  const claudeDir = path.join(os.homedir(), '.claude', 'projects');
  const logDir = path.join(process.cwd(), '_log');
  
  if (!fs.existsSync(claudeDir)) {
    console.log('Claude projects directory not found at:', claudeDir);
    return;
  }

  // Create _log directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log('Created _log directory');
  }

  const projects = fs.readdirSync(claudeDir);
  let copiedCount = 0;

  projects.forEach(projectName => {
    const projectDir = path.join(claudeDir, projectName);
    const jsonlFiles = fs.readdirSync(projectDir).filter(file => file.endsWith('.jsonl'));
    
    jsonlFiles.forEach(file => {
      const sourcePath = path.join(projectDir, file);
      const destPath = path.join(logDir, file);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        copiedCount++;
      } catch (error) {
        console.log(`Error copying ${file}:`, error.message);
      }
    });
  });

  console.log(`Copied ${copiedCount} conversation files to _log directory`);
}

function readClaudeHistory() {
  const claudeDir = path.join(os.homedir(), '.claude', 'projects');
  
  if (!fs.existsSync(claudeDir)) {
    console.log('Claude projects directory not found at:', claudeDir);
    return;
  }

  const projects = fs.readdirSync(claudeDir);
  
  if (projects.length === 0) {
    console.log('No Claude projects found');
    return;
  }

  console.log('# Claude Code Conversation History\n');
  
  projects.forEach(projectName => {
    const projectDir = path.join(claudeDir, projectName);
    const jsonlFiles = fs.readdirSync(projectDir).filter(file => file.endsWith('.jsonl'));
    
    if (jsonlFiles.length === 0) return;
    
    console.log(`## Project: ${projectName}\n`);
    
    jsonlFiles.forEach(file => {
      const filePath = path.join(projectDir, file);
      const conversationId = path.basename(file, '.jsonl');
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.trim().split('\n');
        
        if (lines.length === 0) return;
        
        console.log(`### Conversation: ${conversationId}`);
        
        const messages = [];
        lines.forEach(line => {
          try {
            const entry = JSON.parse(line);
            if (entry.type === 'message') {
              messages.push({
                role: entry.role,
                content: entry.content,
                timestamp: entry.timestamp
              });
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        });
        
        if (messages.length > 0) {
          const firstMessage = messages[0];
          const lastMessage = messages[messages.length - 1];
          
          console.log(`- **Started:** ${formatTimestamp(firstMessage.timestamp)}`);
          console.log(`- **Last activity:** ${formatTimestamp(lastMessage.timestamp)}`);
          console.log(`- **Messages:** ${messages.length}`);
          
          // Show first user message as preview
          const firstUserMessage = messages.find(m => m.role === 'user');
          if (firstUserMessage) {
            const preview = truncateContent(firstUserMessage.content.replace(/\n/g, ' '));
            console.log(`- **Preview:** ${preview}`);
          }
          
          console.log('');
        }
        
      } catch (error) {
        console.log(`Error reading ${file}:`, error.message);
      }
    });
  });
}

function readSpecificConversation(conversationId) {
  const claudeDir = path.join(os.homedir(), '.claude', 'projects');
  
  // Search for the conversation file across all projects
  const projects = fs.readdirSync(claudeDir);
  
  for (const projectName of projects) {
    const projectDir = path.join(claudeDir, projectName);
    const conversationFile = path.join(projectDir, `${conversationId}.jsonl`);
    
    if (fs.existsSync(conversationFile)) {
      console.log(`# Conversation Details: ${conversationId}\n`);
      console.log(`**Project:** ${projectName}\n`);
      
      const content = fs.readFileSync(conversationFile, 'utf8');
      const lines = content.trim().split('\n');
      
      lines.forEach((line, index) => {
        try {
          const entry = JSON.parse(line);
          if (entry.type === 'message') {
            console.log(`## Message ${index + 1} - ${entry.role}`);
            console.log(`**Time:** ${formatTimestamp(entry.timestamp)}\n`);
            console.log(entry.content);
            console.log('\n---\n');
          }
        } catch (e) {
          console.log(`Error parsing line ${index + 1}:`, e.message);
        }
      });
      
      return;
    }
  }
  
  console.log(`Conversation ${conversationId} not found`);
}

// Command line usage
const args = process.argv.slice(2);

if (args.length === 0) {
  readClaudeHistory();
} else if (args[0] === '--copy') {
  copyConversationsToLog();
} else if (args[0] === '--conversation' && args[1]) {
  readSpecificConversation(args[1]);
} else {
  console.log('Usage:');
  console.log('  node claude-history-reader.js                    # List all conversations');
  console.log('  node claude-history-reader.js --copy             # Copy conversations to _log directory');
  console.log('  node claude-history-reader.js --conversation ID  # Show specific conversation');
}