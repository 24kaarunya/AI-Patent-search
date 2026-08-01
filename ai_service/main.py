from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from embeddings import embedding_generator
from vector_index import vector_index
from llm_copilot import generate_claim_explanation

app = FastAPI(title="Patent AI Service", description="FastAPI Sentence Transformer & FAISS vector search")

class AnalyzeRequest(BaseModel):
    title: str
    description: str
    domain: str

class PatentRequest(BaseModel):
    id: str
    patentNumber: str
    title: str
    abstract: str
    description: str
    claims: list[str]
    inventors: list[str] = []
    assignee: str = ""
    filingDate: str = ""
    publicationDate: str = ""
    classification: str = ""
    ipcCode: str = ""
    status: str = ""
    source: str = ""
    sourceUrl: str = ""
    features: list[str] = []
    components: list[str] = []
    functions: list[str] = []

class SearchRequest(BaseModel):
    title: str
    description: str
    domain: str
    components: list[str] = []
    functions: list[str] = []
    keywords: list[str] = []
    patents: list[PatentRequest]

class CompareRequest(BaseModel):
    invention: dict
    matched_patents: list

class ExplainRequest(BaseModel):
    invention: dict
    patent: dict

@app.get("/")
def read_root():
    return {"status": "running", "service": "Patent AI Core"}

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    # Dynamic keyword & concept parsing logic
    combined = f"{req.title} {req.description}".lower()
    
    # Default fallback values
    components = ["Processor Module", "Communication Bus", "Telemetry Radio"]
    functions = ["Monitor state", "Broadcast alerts", "Process logic"]
    
    # Simple semantic domain mapping
    if "helmet" in combined or "rider" in combined or "fatigue" in combined:
        components = ["Sensors", "Microcontroller", "Mobile Application", "Haptic Actuator", "BLE Transceiver"]
        functions = ["Detect fatigue", "Generate alerts", "Monitor rider", "Transmit location data", "Measure vitals"]
    elif "cardiac" in combined or "ekg" in combined or "heart" in combined:
        components = ["Electrodes", "Microprocessor", "Cloud Server", "Mobile Application", "Temperature Sensor"]
        functions = ["Collect ECG waveforms", "Detect arrhythmia", "Alert medical staff", "Filter noise", "Measure temperature"]
    elif "blockchain" in combined or "smart contract" in combined:
        components = ["NFC Tag", "Blockchain Network", "Smart Contract", "Mobile Scanner App"]
        functions = ["Verify authenticity", "Track transit", "Execute smart contracts", "Detect tampering", "Record logs"]
    elif "drone" in combined or "uav" in combined:
        components = ["LiDAR", "Radar", "Flight Controller", "Telemetry Module", "Rotors"]
        functions = ["Avoid obstacles", "Re-route path", "Navigate airspace", "Execute deliveries", "Process telemetry"]
    
    # Extract long keywords as custom tokens
    words = [w.strip(".,;:!?()\"'") for w in req.description.split() if len(w) > 5]
    keywords = list(set([w for w in words if w.lower() not in ["system", "device", "invention", "application", "provides", "features"]]))[:5]
    if not keywords:
        keywords = ["innovative", "adaptive", "telemetry"]
        
    concepts = [f"{kw.capitalize()} optimization" for kw in keywords]
    
    return {
        "domain": req.domain,
        "components": components,
        "functions": functions,
        "concepts": concepts,
        "keywords": keywords,
        "summary": f"The proposed invention, \"{req.title}\", operates in the field of {req.domain}. System integrates components such as {', '.join(components[:3])}, functioning to {', '.join(functions[:3])}."
    }

@app.post("/search")
def search(req: SearchRequest):
    if not req.patents:
        return {"patents": []}
        
    # Generate query text and embedding vector
    query_text = f"{req.title} {req.description} {' '.join(req.components)} {' '.join(req.functions)}"
    query_vec = embedding_generator.get_embedding(query_text)
    
    # Generate embeddings for each patent in the request
    patents_list = []
    patent_vectors = []
    for pat in req.patents:
        pat_dict = pat.model_dump()
        patents_list.append(pat_dict)
        
        pat_text = f"{pat.title} {pat.abstract} {' '.join(pat.components)} {' '.join(pat.functions)}"
        pat_vec = embedding_generator.get_embedding(pat_text)
        patent_vectors.append(pat_vec)
        
    # Build FAISS index dynamically
    vector_index.build_index(patents_list, patent_vectors)
    
    # Execute Vector index search
    search_hits = vector_index.search(query_vec, top_k=5)
    
    # Calculate Jaccard text overlap and IOU feature overlaps
    results = []
    for patent_id, cos_score in search_hits:
        patent = vector_index.patent_data[patent_id]
        
        # Calculate component similarity (Intersection over Union)
        inv_comps = set([c.lower() for c in req.components])
        pat_comps = set([c.lower() for c in patent.get("components", [])])
        comp_score = 0
        if inv_comps or pat_comps:
            comp_score = int(len(inv_comps.intersection(pat_comps)) / max(len(inv_comps.union(pat_comps)), 1) * 100)
            
        # Calculate function similarity (IOU)
        inv_funcs = set([f.lower() for f in req.functions])
        pat_funcs = set([f.lower() for f in patent.get("functions", [])])
        func_score = 0
        if inv_funcs or pat_funcs:
            func_score = int(len(inv_funcs.intersection(pat_funcs)) / max(len(inv_funcs.union(pat_funcs)), 1) * 100)
            
        # Calculate text term similarity
        vector_pct = int(max(cos_score, 0.0) * 100)
        overall_score = int(vector_pct * 0.5 + comp_score * 0.25 + func_score * 0.25)
        
        # Ensure correct formatting for detail breakdown bars
        patent["similarity"] = {
            "overallScore": min(overall_score, 99),
            "vectorScore": vector_pct,
            "textScore": int((vector_pct + comp_score) / 2),
            "componentScore": comp_score,
            "functionScore": func_score
        }
        results.append(patent)
        
    return {"patents": results}

@app.post("/compare")
def compare(req: CompareRequest):
    inv = req.invention
    matched = req.matched_patents
    
    if not matched:
        return {
            "noveltyScore": 100,
            "noveltyLevel": "High",
            "reasoning": "No matching patents found above threshold similarity index. Highly distinctive design.",
            "overlappingFeatures": [],
            "distinctiveFeatures": inv.get("components", [])
        }
        
    top = matched[0]
    top_score = top.get("similarity", {}).get("overallScore", 15)
    novelty_score = max(100 - top_score, 5)
    
    inv_comps = set([c.lower() for c in inv.get("components", [])])
    pat_comps = set([c.lower() for c in top.get("components", [])])
    overlapping = list(inv_comps.intersection(pat_comps))
    distinctive = list(inv_comps.difference(pat_comps))
    
    level = "High"
    if top_score > 75:
        level = "Low"
    elif top_score > 40:
        level = "Medium"
        
    reasoning = f"Novelty index is {novelty_score}% ({level} Novelty level)."
    if level == "Low":
        reasoning += f" High claim overlaps detected with patent {top.get('patentNumber')}. Focus claims on distinctive subsystems like: {', '.join(distinctive[:2]) or 'none'}."
    else:
        reasoning += f" Defensible novelty gap established by exclusive parameters: {', '.join(distinctive[:2]) or 'none'}."
        
    return {
        "noveltyScore": novelty_score,
        "noveltyLevel": level,
        "reasoning": reasoning,
        "overlappingFeatures": overlapping,
        "distinctiveFeatures": distinctive
    }

@app.post("/explain")
def explain(req: ExplainRequest):
    explanation = generate_claim_explanation(req.invention, req.patent)
    return {"explanation": explanation}
