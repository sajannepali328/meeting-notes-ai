from django.conf import settings
import json
from google import genai
from google.genai import types


def generate_meeting_summary(raw_text: str) -> dict:
    """
    Calls the Gemini API to analyze raw meeting notes and returns a structured dictionary
    containing overview, decisions, and action items (task, owner, deadline).
    """
    prompt = f"""
    Analyze the following meeting transcript/notes. Extract all key decisions made, 
    and identify all action items along with who is assigned to them (owner) and when they are due (deadline).

    Meeting Notes:
    {raw_text}
    """

    try:

        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "overview": {
                            "type": "STRING",
                            "description": "High-level brief overview of the meeting.",
                        },
                        "decisions": {
                            "type": "ARRAY",
                            "items": {"type": "STRING"},
                            "description": "List of clear decisions made during the meeting.",
                        },
                        "action_items": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "task": {
                                        "type": "STRING",
                                        "description": "The specific task to be completed.",
                                    },
                                    "owner": {
                                        "type": "STRING",
                                        "description": "Person assigned to this task, or Unassigned if unknown.",
                                    },
                                    "deadline": {
                                        "type": "STRING",
                                        "description": "Due date/time mentioned, or Not specified if unknown.",
                                    },
                                },
                                "required": ["task", "owner", "deadline"],
                            },
                            "description": "List of action items extracted from the meeting.",
                        },
                    },
                    "required": ["overview", "decisions", "action_items"],
                },
            ),
        )

        return json.loads(response.text)

    except Exception as e:
        return {
            "overview": "Summary generation failed.",
            "decisions": [],
            "action_items": [],
            "error": str(e),
        }
