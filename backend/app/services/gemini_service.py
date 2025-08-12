import google.generativeai as genai
import re
import json
from typing import AsyncGenerator, List, Dict, Any
from ..models import StreamingChunk
from ..config import settings

class GeminiService:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
    def _build_conversation_history(self, conversation_history: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Build conversation history for Gemini API"""
        history = []
        for msg in conversation_history:
            if msg['role'] == 'user':
                history.append({'role': 'user', 'parts': [msg['content']]})
            elif msg['role'] == 'assistant':
                history.append({'role': 'model', 'parts': [msg['content']]})
        return history

    def _detect_code_blocks(self, text: str) -> List[Dict[str, Any]]:
        """Detect code blocks in the response"""
        code_blocks = []
        pattern = r'```(\w+)?\n(.*?)```'
        matches = re.finditer(pattern, text, re.DOTALL)
        
        for match in matches:
            language = match.group(1) or 'text'
            code = match.group(2).strip()
            code_blocks.append({
                'language': language,
                'code': code,
                'filename': f"{language}_{len(code_blocks) + 1}.{self._get_file_extension(language)}"
            })
        
        return code_blocks

    def _get_file_extension(self, language: str) -> str:
        """Get file extension for a programming language"""
        extensions = {
            'javascript': 'js',
            'typescript': 'ts',
            'jsx': 'jsx',
            'tsx': 'tsx',
            'python': 'py',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'csharp': 'cs',
            'php': 'php',
            'ruby': 'rb',
            'go': 'go',
            'rust': 'rs',
            'swift': 'swift',
            'kotlin': 'kt',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yml',
            'yml': 'yml',
            'markdown': 'md',
            'md': 'md',
            'sql': 'sql',
            'bash': 'sh',
            'shell': 'sh',
            'sh': 'sh',
        }
        return extensions.get(language.lower(), 'txt')

    async def stream_response(self, message: str, conversation_history: List[Dict[str, str]]) -> AsyncGenerator[StreamingChunk, None]:
        """Stream response from Gemini with code detection"""
        try:
            # Build conversation history
            history = self._build_conversation_history(conversation_history)
            
            # Create chat session
            chat = self.model.start_chat(history=history)
            
            # Stream the response
            response = chat.send_message(message, stream=True)
            
            accumulated_content = ""
            code_blocks = []
            
            # Handle the streaming response properly
            for chunk in response:
                if hasattr(chunk, 'text') and chunk.text:
                    accumulated_content += chunk.text
                    
                    # Send content chunk
                    yield StreamingChunk(
                        type="content",
                        data=chunk.text
                    )
                    
                    # Check for complete code blocks
                    new_code_blocks = self._detect_code_blocks(accumulated_content)
                    
                    # Send new code blocks
                    for code_block in new_code_blocks:
                        if code_block not in code_blocks:
                            code_blocks.append(code_block)
                            yield StreamingChunk(
                                type="code",
                                data=code_block['code'],
                                language=code_block['language'],
                                filename=code_block['filename']
                            )
            
            # Send end signal
            yield StreamingChunk(type="end", data="")
            
        except Exception as e:
            # Send error as content
            error_message = f"Error: {str(e)}"
            yield StreamingChunk(type="content", data=error_message)
            yield StreamingChunk(type="end", data="")
