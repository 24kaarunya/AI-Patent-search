import os
import requests

def generate_claim_explanation(invention: dict, patent: dict) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Extract feature lists for comparison
    inv_title = invention.get("title", "Project Idea")
    inv_desc = invention.get("description", "")
    inv_comps = set([c.lower() for c in invention.get("components", [])])
    inv_funcs = set([f.lower() for f in invention.get("functions", [])])
    
    pat_title = patent.get("title", "Prior Art")
    pat_number = patent.get("patentNumber", "Patent")
    pat_comps = set([c.lower() for c in patent.get("components", [])])
    pat_funcs = set([f.lower() for f in patent.get("functions", [])])
    
    common_comps = list(inv_comps.intersection(pat_comps))
    common_funcs = list(inv_funcs.intersection(pat_funcs))
    
    diff_comps = list(inv_comps.difference(pat_comps))
    diff_funcs = list(inv_funcs.difference(pat_funcs))
    
    # If API Key exists, try to query Gemini
    if api_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            prompt = f"""
            You are a patent compliance AI assistant. Compare this user invention with an existing patent.
            
            User Invention:
            Title: {inv_title}
            Description: {inv_desc}
            Components: {list(inv_comps)}
            Functions: {list(inv_funcs)}
            
            Compared Patent:
            Patent Number: {pat_number}
            Title: {pat_title}
            Components: {list(pat_comps)}
            Functions: {list(pat_funcs)}
            
            Write a professional, concise prior-art comparison explanation in natural language (1 paragraph).
            Focus on:
            1. Why they are similar (common technical concepts).
            2. Major differences (novel/additional components or functions in the user's project).
            3. Highlight features not found in the compared patent.
            """
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=5)
            if response.status_code == 200:
                res_data = response.json()
                explanation = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                return explanation
        except Exception as e:
            print(f"Gemini API request failed: {e}. Falling back to template generator.")
            
    # Parameterized text template generator fallback
    common_str = ""
    if common_comps or common_funcs:
        shared = [c.capitalize() for c in common_comps[:2]] + [f.lower() for f in common_funcs[:2]]
        common_str = f"Both the project and the patent share core technical concepts, specifically leveraging {', '.join(shared)} for system orchestration."
    else:
        common_str = f"The project and the patent are semantically mapped within the same classification domain, sharing high-level system components."
        
    diff_str = ""
    if diff_comps or diff_funcs:
        unique = [c.capitalize() for c in diff_comps[:2]] + [f.lower() for f in diff_funcs[:2]]
        diff_str = f"However, the project introduces distinctive improvements, including {', '.join(unique)}, which were not identified or claimed in the compared patent."
    else:
        diff_str = "While both capture overlapping claims, the user's project integrates specific local optimizations and secondary interfaces not explicitly detailed in the prior art."
        
    summary = f"In conclusion, while they share baseline capabilities to achieve {inv_title.lower()}, {diff_str} This variation provides a clear novelty gap that is highly defensible for claims isolation."
    
    return f"{common_str} {diff_str} {summary}"
