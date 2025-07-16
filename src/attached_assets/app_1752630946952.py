import os
import json
import google.generativeai as genai
from deep_translator import GoogleTranslator
import gradio as gr
from dotenv import load_dotenv
import re

# Language code mapping
LANG_MAP = {
    'Hindi': 'hi',
    'Telugu': 'te',
    'English': 'en'
}

def get_translator(lang_code):
    """Get the appropriate language code for translation."""
    return LANG_MAP.get(lang_code, 'en')

def translate_text(text, target_lang, is_user_message=False, max_retries=3):
    """
    Unified translation function that handles both single messages and chat history.
    
    Args:
        text: The text to translate
        target_lang: Target language ("Hindi", "Telugu", or "English")
        is_user_message: Whether this is a user message (for prefix handling)
        max_retries: Number of retry attempts for failed translations
        
    Returns:
        Translated text with appropriate language prefix
    """
    try:
        # Clean the input text
        if not text or not text.strip() or target_lang in ["English", "en"]:
            return text.strip()
            
        # Skip translation if the text is too short or already has a language prefix
        if len(text.strip()) < 2 or any(prefix in text for prefix in ["[हिंदी]", "[తెలుగు]"]):
            return text.strip()
        
        # Clean the text by removing any existing language prefixes
        clean_text = text.replace("[हिंदी]", "").replace("[తెలుగు]", "").strip()
        
        # Get the appropriate language code and prefix
        lang_code = get_translator(target_lang)
        prefix = ""
        
        if target_lang == "Hindi":
            prefix = "[हिंदी] "
        elif target_lang == "Telugu":
            prefix = "[తెలుగు] "
            
        if lang_code == 'en':
            return clean_text
            
        # Split text into chunks for translation if needed
        chunks = split_into_chunks(clean_text, max_chunk_size=15000)
        if not chunks:
            return clean_text
            
        translated_chunks = []
        
        for chunk in chunks:
            if not chunk.strip():
                continue
                
            for attempt in range(max_retries):
                try:
                    # Add a small delay between chunks to avoid rate limiting
                    if attempt > 0:
                        import time
                        time.sleep(1)
                        
                    # Translate using deep-translator
                    translated = GoogleTranslator(source='auto', target=lang_code).translate(chunk)
                    if translated and translated != chunk:  # Only append if translation succeeded
                        translated_chunks.append(translated)
                        break
                    elif attempt == max_retries - 1:  # If all retries failed
                        translated_chunks.append(chunk)  # Add original chunk if translation fails
                except Exception as e:
                    print(f"Translation error: {str(e)}")
                    if attempt == max_retries - 1:  # If all retries failed
                        translated_chunks.append(chunk)  # Add original chunk if translation fails
        
        # Join chunks and clean up the result
        result = ' '.join(translated_chunks).strip()
        
        # Add prefix if not already present and not empty
        if result and not result.startswith(prefix.strip()):
            return f"{prefix}{result}"
        return result
        
    except Exception as e:
        print(f"Unexpected error in translate_text: {e}")
        return text.strip() if text else ""

def split_into_chunks(text, max_chunk_size=15000):  # Increased chunk size for googletrans
    """Split text into chunks of maximum size, trying to break at sentence boundaries."""
    if not text:
        return []
        
    # Try to split at sentence boundaries first
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        # If a single sentence is too long, we need to split it
        if len(sentence) > max_chunk_size:
            # Split by words if the sentence is too long
            words = sentence.split(' ')
            temp_chunk = []
            temp_length = 0
            
            for word in words:
                if temp_length + len(word) + 1 > max_chunk_size and temp_chunk:
                    chunks.append(' '.join(temp_chunk))
                    temp_chunk = [word]
                    temp_length = len(word)
                else:
                    temp_chunk.append(word)
                    temp_length += len(word) + 1
            
            if temp_chunk:
                if current_chunk and (current_length + len(' '.join(temp_chunk)) + 1) <= max_chunk_size:
                    current_chunk.extend(temp_chunk)
                    current_length += len(' '.join(temp_chunk)) + 1
                else:
                    if current_chunk:
                        chunks.append(' '.join(current_chunk))
                    current_chunk = temp_chunk
                    current_length = len(' '.join(temp_chunk))
        else:
            if current_chunk and (current_length + len(sentence) + 1) > max_chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = [sentence]
                current_length = len(sentence)
            else:
                current_chunk.append(sentence)
                current_length += len(sentence) + 1
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

# Load environment variables from .env file if it exists (for local development)
load_dotenv()

# Initialize Gemini
API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set. "
                    "Please set it in the Hugging Face Space secrets.")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# System prompt for the travel assistant
SYSTEM_PROMPT = """
You are a friendly, expert travel planner specializing in India, with special focus on Andhra Pradesh tourism. 
You help travelers plan amazing trips with personalized, user-friendly answers.
Your capabilities include:
- Suggesting best times to visit
- Giving short highlights
- Building detailed itineraries
- Recommending places to stay, eat, shop
- Advising on budget options, transport, safety
- Answering multiple questions at once if needed
- Sounding like a helpful travel agent, not a robot.

Always adapt the level of detail based on the user's question.
If the question is about Andhra Pradesh, include local details about places, food, festivals, and crafts.
"""

def get_gemini_response(user_input):
    """Get response from Gemini model."""
    try:
        prompt = f"{SYSTEM_PROMPT}\n\nUser's Question: {user_input}"
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error getting response from Gemini: {str(e)}"

def chat_with_gemini(user_input, chat_history=None):
    """Handle chat interaction with Gemini."""
    response = get_gemini_response(user_input)
    
    if chat_history is None:
        chat_history = []
    
    return "", chat_history + [[user_input, response]]

def translate_chat(chat_history, language):
    """
    Translate the chat history to the selected language.
    
    Args:
        chat_history: List of [user_message, bot_message] pairs
        language: Target language ("Hindi", "Telugu", or "English")
        
    Returns:
        List of translated [user_message, bot_message] pairs
    """
    if not chat_history or language in ["English", "en"]:
        return chat_history
    
    translated_history = []
    
    for user_msg, bot_msg in chat_history:
        # Skip translation if messages are empty
        user_msg = str(user_msg) if user_msg is not None else ""
        bot_msg = str(bot_msg) if bot_msg is not None else ""
        
        # Translate user message
        translated_user = translate_text(user_msg, language, is_user_message=True) if user_msg.strip() else ""
        # Translate bot message
        translated_bot = translate_text(bot_msg, language, is_user_message=False) if bot_msg.strip() else ""
        
        translated_history.append([translated_user, translated_bot])
    
    return translated_history

# Create the Gradio interface
with gr.Blocks(
    theme=gr.themes.Soft(
        primary_hue="pink",
        secondary_hue="orange",
        neutral_hue="slate"
    ),
    css="""
        .gradio-container {
            max-width: 900px !important;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            background: linear-gradient(90deg, #F75768, #FB6957);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 10px !important;
        }
        .gradio-markdown p {
            text-align: center;
            margin-bottom: 20px !important;
            color: #555;
        }
        .examples-container {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }
        .example-box {
            border-left: 4px solid #F75768 !important;
            border-radius: 4px;
            padding: 12px 16px !important;
            margin: 0 !important;
            transition: all 0.2s ease;
            flex: 1;
            min-width: 200px;
            max-width: 100%;
            box-sizing: border-box;
            background: white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .example-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            cursor: pointer;
        }
        .example-text {
            background: linear-gradient(90deg, #F75768, #FB6957);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 !important;
            font-weight: 500;
            font-size: 0.95em;
            line-height: 1.4;
        }
        .example-label {
            color: #666;
            font-size: 1em;
            margin-bottom: 15px !important;
            font-weight: 600;
            width: 100%;
        }
    """
) as demo:
    # Header with full-width logo as heading
    gr.HTML("""
    <div style="display: flex; flex-direction: column; align-items: center; margin: 0 auto 20px; max-width: 100%;">
        <img 
            src="https://huggingface.co/spaces/vidhyaS/Saanchari_AP/resolve/main/logo.png" 
            alt="Saanchari" 
            style="
                height: auto;
                width: 80%;
                max-width: 400px;
                object-fit: contain;
                margin: 0 auto 15px;
            ">
        <p style="text-align: center; color: #555; margin: 0; font-size: 1.1em;">Your expert travel assistant for Andhra Pradesh</p>
    """)
    
    # Function to handle example question clicks
    def submit_question(question, chat_history):
        if chat_history is None:
            chat_history = []
        # Add user question to chat
        chat_history.append((question, None))
        # Get response from Gemini
        response = get_gemini_response(question)
        # Add response to chat
        chat_history[-1] = (question, response)
        return "", chat_history
    
    # Chat title and language selection in one row
    with gr.Row(equal_height=True, variant="compact"):
        gr.Markdown("### Chat with Saanchari")
        
        # Language selection buttons
        with gr.Row(variant="compact"):
            en_btn = gr.Button("EN", size="sm", variant="primary", min_width=50)
            hi_btn = gr.Button("हिंदी", size="sm", min_width=50)
            te_btn = gr.Button("తెలుగు", size="sm", min_width=50)
    
    # Main chat interface
    chatbot = gr.Chatbot(height=400, show_label=False)
    
    # Chat controls row
    with gr.Row():
        # Chat input
        user_input = gr.Textbox(
            label="Ask me anything about travel in Andhra Pradesh",
            placeholder="E.g., Best places to visit in Visakhapatnam?",
            scale=4,
            show_label=False
        )
        submit_btn = gr.Button("Send", variant="primary")
    
    # Example questions
    with gr.Row():
        # Example questions will go here
        pass
    
    # Store the current question and language
    current_question = gr.State("")
    current_language = gr.State("English")
    active_button = gr.State("en")
    
    def set_question(question):
        return question, question
    
    # Example questions with click handlers
    with gr.Row():
        with gr.Column():
            gr.Markdown("### Try asking me about:")
            
            with gr.Row():
                example_questions = [
                    ("Must-visit places in Visakhapatnam", "What are the must-visit places in Visakhapatnam?"),
                    ("3-day trip to Araku Valley", "Plan a 3-day trip to Araku Valley"),
                    ("Best time to visit Tirupati", "What is the best time to visit Tirupati?")
                ]
                
                for btn_text, question in example_questions:
                    with gr.Row():
                        btn = gr.Button(
                            btn_text, 
                            variant="secondary",
                            min_width=200,
                            size="sm"
                        )
                        btn.click(
                            fn=set_question,
                            inputs=[gr.State(question)],
                            outputs=[user_input, current_question]
                        )

    # Add some space
    gr.HTML("<div style='margin-bottom: 20px;'></div>")
    
    # Add custom CSS
    gr.HTML("""
    <style>
        .gradio-button {
            margin: 0 2px !important;
            border-radius: 4px !important;
            min-width: 45px !important;
            padding: 2px 6px !important;
            font-size: 0.8em !important;
        }
        .gradio-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .gradio-row {
            align-items: center;
            gap: 10px;
        }
        .gradio-markdown h3 {
            margin: 0 !important;
            padding: 8px 0;
        }
    </style>
    """)
    
    # Handle chat interactions
    chat_inputs = [user_input, chatbot]
    chat_outputs = [user_input, chatbot]
    
    # This function is now replaced by the unified translate_text function above

    def set_language(selected_lang, current_chat, current_lang_state):
        try:
            # If already in this language, do nothing
            if selected_lang == current_lang_state:
                return current_chat, selected_lang
                
            # If switching to English, show original text
            if selected_lang == "English":
                # Remove language prefixes
                cleaned_chat = []
                for message in current_chat:
                    if isinstance(message, (list, tuple)) and len(message) >= 2:
                        user_msg = str(message[0]).replace("[हिंदी]", "").replace("[తెలుగు]", "").strip()
                        bot_msg = str(message[1]).replace("[हिंदी]", "").replace("[తెలుగు]", "").strip()
                        cleaned_chat.append([user_msg, bot_msg])
                return cleaned_chat, selected_lang
                
            # If switching to another language, translate the chat
            translated_chat = []
            for message in current_chat:
                if isinstance(message, (list, tuple)) and len(message) >= 2:
                    user_msg = str(message[0])
                    bot_msg = str(message[1])
                    
                    # Skip translation if already in target language
                    target_prefix = "[हिंदी]" if selected_lang == "Hindi" else "[తెలుగు]"
                    if target_prefix not in user_msg:
                        user_msg = translate_text(user_msg, selected_lang, is_user_message=True)
                    if target_prefix not in bot_msg:
                        bot_msg = translate_text(bot_msg, selected_lang, is_user_message=False)
                        
                    translated_chat.append([user_msg, bot_msg])
            
            return translated_chat, selected_lang
            
        except Exception as e:
            print(f"Error in set_language: {e}")
            return current_chat, selected_lang

    def chat_with_gemini(user_input, chat_history, current_lang):
        try:
            if not user_input or not user_input.strip():
                return "", chat_history or [], current_lang
                
            # Clean the user input
            user_input = user_input.strip()
            
            # Get response from Gemini
            response = get_gemini_response(user_input)
            
            if chat_history is None:
                chat_history = []
            
            # Add user message and bot response to chat history
            chat_history.append((user_input, response))
            
            # If not in English, translate the response
            if current_lang != "English":
                try:
                    # Translate the response
                    translated_response = translate_text(response, current_lang, is_user_message=False)
                    # Update the last message in chat history with translated response
                    if chat_history:
                        chat_history[-1] = (chat_history[-1][0], translated_response)
                except Exception as e:
                    print(f"Error in translation: {e}")
                    # If translation fails, keep the original response
                    pass
            
            return "", chat_history, current_lang
            
        except Exception as e:
            print(f"Error in chat_with_gemini: {e}")
            return "", chat_history or [], current_lang

    def update_language(selected_lang, current_chat, current_lang_state):
        """Update the language of the chat interface."""
        try:
            # If already in this language, do nothing
            if selected_lang == current_lang_state:
                return current_chat, selected_lang, selected_lang.lower()
                
            # If switching to English, show original text
            if selected_lang == "English":
                # Remove language prefixes
                cleaned_chat = []
                for message in current_chat:
                    if isinstance(message, (list, tuple)) and len(message) >= 2:
                        user_msg = str(message[0]).replace("[हिंदी]", "").replace("[తెలుగు]", "").strip()
                        bot_msg = str(message[1]).replace("[हिंदी]", "").replace("[తెలుగు]", "").strip()
                        cleaned_chat.append([user_msg, bot_msg])
                return cleaned_chat, selected_lang, "en"
                
            # If switching to another language, translate the chat
            translated_chat = []
            for message in current_chat:
                if isinstance(message, (list, tuple)) and len(message) >= 2:
                    user_msg = str(message[0])
                    bot_msg = str(message[1])
                    
                    # Skip translation if already in target language
                    target_prefix = "[हिंदी]" if selected_lang == "Hindi" else "[తెలుగు]"
                    if target_prefix not in user_msg:
                        user_msg = translate_text(user_msg, selected_lang, is_user_message=True)
                    if target_prefix not in bot_msg:
                        bot_msg = translate_text(bot_msg, selected_lang, is_user_message=False)
                        
                    translated_chat.append([user_msg, bot_msg])
            
            return translated_chat, selected_lang, selected_lang.lower()
            
        except Exception as e:
            print(f"Error in update_language: {e}")
            return current_chat, current_lang_state, current_lang_state.lower()

    # Store the active button state
    active_button = gr.State("en")

    # Set up button click handlers
    en_btn.click(
        fn=update_language,
        inputs=[gr.State("English"), chatbot, current_language],
        outputs=[chatbot, current_language, active_button],
        api_name="set_english"
    )

    hi_btn.click(
        fn=update_language,
        inputs=[gr.State("Hindi"), chatbot, current_language],
        outputs=[chatbot, current_language, active_button],
        api_name="set_hindi"
    )

    te_btn.click(
        fn=update_language,
        inputs=[gr.State("Telugu"), chatbot, current_language],
        outputs=[chatbot, current_language, active_button],
        api_name="set_telugu"
    )

    def chat_with_gemini_translate(user_input, chat_history, current_lang):
        if not user_input or not user_input.strip():
            return "", chat_history or [], current_lang
            
        # Clean the user input
        user_input = user_input.strip()
        
        # Use the main chat function for translation
        return chat_with_gemini(user_input, chat_history, current_lang)

    # Set up the chat interface
        # Set up the chat interface
    chat_msg = user_input.submit(
        chat_with_gemini,
        inputs=[user_input, chatbot, current_language],
        outputs=[user_input, chatbot, current_language],
        queue=False,
        api_name="chat_click"
    )
    
    # Also connect the submit button
    submit_btn.click(
        chat_with_gemini,
        inputs=[user_input, chatbot, current_language],
        outputs=[user_input, chatbot, current_language],
        queue=False,
        api_name="chat_click"
    )

# For local testing
if __name__ == "__main__":
    demo.launch(share=True, server_name="0.0.0.0", server_port=7861)
