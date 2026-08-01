/**
 * Mock NLP analysis parsing engine.
 * Realistically extracts technical concepts from natural language descriptions.
 */

// Heuristic keyword mappings for demo accuracy when typing realistic prompts
const KNOWLEDGE_DICTIONARY = [
  {
    pattern: /(helmet|rider|fatigue|drowsy|motorcycle|protective headwear|vitals|heart rate)/i,
    domain: "IoT + AI",
    components: ["Sensors", "Microcontroller", "Mobile Application", "Haptic Actuator", "BLE Transceiver"],
    functions: ["Detect fatigue", "Generate alerts", "Monitor rider", "Transmit location data", "Measure vitals"]
  },
  {
    pattern: /(cardiac|ekg|ecg|heart|patient|biosignal|medical|patch|arrhythmia|fibrillation)/i,
    domain: "IoT + Health",
    components: ["Electrodes", "Microprocessor", "Cloud Server", "Mobile Application", "Temperature Sensor"],
    functions: ["Collect ECG waveforms", "Detect arrhythmia", "Alert medical staff", "Filter noise", "Measure temperature"]
  },
  {
    pattern: /(blockchain|smart contract|ledger|nfc|counterfeit|supply chain|transit|tamper)/i,
    domain: "Blockchain",
    components: ["NFC Tag", "Blockchain Network", "Smart Contract", "Mobile Scanner App"],
    functions: ["Verify authenticity", "Track transit", "Execute smart contracts", "Detect tampering", "Record logs"]
  },
  {
    pattern: /(drone|uav|fly|aerial|lidar|radar|collision|flight|package|delivery)/i,
    domain: "Robotics + AI",
    components: ["LiDAR", "Radar", "Flight Controller", "Telemetry Module", "Rotors"],
    functions: ["Avoid obstacles", "Re-route path", "Navigate airspace", "Execute deliveries", "Process telemetry"]
  },
  {
    pattern: /(smart home|voice|assistant|speech|ambient|microphone|speaker|wake word)/i,
    domain: "IoT + NLP",
    components: ["Microphone Array", "Local Processor", "Local Acoustic DB", "IoT Transceiver"],
    functions: ["Transcribe voice", "Parse commands", "Trigger IoT actions", "Filter audio noise", "Preserve privacy"]
  },
  {
    pattern: /(solar|panel|sun|photovoltaic|tracking|actuator|energy|wind)/i,
    domain: "Renewable Energy",
    components: ["Solar Panels", "Motorized Actuators", "Light Sensors", "Wind Gauge", "Control Board"],
    functions: ["Track sun position", "Optimize tilt angle", "Stow panels in wind", "Measure grid output", "Detect cloud blocks"]
  },
  {
    pattern: /(irrigation|agriculture|crop|farm|soil|moisture|water|valve|weather)/i,
    domain: "IoT + Agriculture",
    components: ["Moisture Probes", "Water Valves", "Mesh Router", "Cloud Scheduler", "Rain Sensor"],
    functions: ["Measure soil moisture", "Regulate water flow", "Retrieve weather data", "Optimize water schedules", "Calculate salinity"]
  },
  {
    pattern: /(augmented reality|glasses|ar|gaze|eye|pupil|focus|oled)/i,
    domain: "Wearables + AR",
    components: ["Transparent Displays", "Eye Cameras", "Focal Controller", "IR LEDs", "Processor Core"],
    functions: ["Track gaze direction", "Render dynamic overlays", "Adjust visual focus", "Detect selections", "Overlay data panels"]
  },
  {
    pattern: /(vehicle|collision|car|brake|lidar|radar|ecu|driver)/i,
    domain: "Robotics + AI",
    components: ["Radar", "LiDAR", "Stereo Cameras", "Safety ECU", "Brake Actuator"],
    functions: ["Assess collision risk", "Fuse sensor data", "Trigger emergency braking", "Track obstacles", "Alert driver"]
  },
  {
    pattern: /(network|packet|threat|cyber|quarantine|port|autoencoder|benign)/i,
    domain: "Cybersecurity + AI",
    components: ["Network Monitor", "Autoencoder Core", "ACL Controller", "Gateway CPU", "Syslog Module"],
    functions: ["Monitor network traffic", "Detect anomaly patterns", "Quarantine malicious nodes", "Block packet sources", "Generate logs"]
  }
];

export const aiService = {
  /**
   * Parse invention description and extract technical specifications
   */
  async analyzeInvention(title, description, selectedDomain) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const combinedText = `${title} ${description}`.toLowerCase();
    
    // Default fallback values
    let domain = selectedDomain || "General Technology";
    let components = ["Core Processing Unit", "Interface Display", "Feedback Indicator"];
    let functions = ["Process inputs", "Coordinate activities", "Display outcomes"];
    let concepts = ["System automation", "Feedback loop", "Integrated circuit layout"];
    let keywords = ["innovative", "adaptive", "integrated"];
    
    // Check keyword pattern matches
    for (const entry of KNOWLEDGE_DICTIONARY) {
      if (entry.pattern.test(combinedText)) {
        domain = entry.domain;
        components = [...entry.components];
        functions = [...entry.functions];
        break;
      }
    }
    
    // Additional heuristics to extract custom words from user description
    const words = description.split(/\s+/).map(w => w.replace(/[^\w]/g, "")).filter(w => w.length > 5);
    
    // Pick unique long words as keywords
    const uniqueWords = Array.from(new Set(words))
      .filter(w => !["system", "device", "invention", "application", "provides", "features"].includes(w.toLowerCase()))
      .slice(0, 5);
      
    if (uniqueWords.length > 0) {
      keywords = uniqueWords;
      concepts = uniqueWords.map(w => `${w.charAt(0).toUpperCase() + w.slice(1)} optimization`);
    }

    return {
      domain,
      components,
      functions,
      concepts,
      keywords,
      summary: `The proposed invention, "${title}", operates primarily in the field of ${domain}. Based on semantic parsing, the system integrates physical components such as ${components.slice(0, 3).join(", ")}, functioning cooperatively to ${functions.slice(0, 3).join(", and ")}.`
    };
  },

  /**
   * Analyze novelty gaps between invention and top matched patents
   */
  analyzeNovelty(invention, matchedPatents) {
    if (!matchedPatents || matchedPatents.length === 0) {
      return {
        noveltyScore: 100,
        noveltyLevel: "High",
        reasoning: "No prior art patents exceeded the threshold similarity index. The invention shows high distinctiveness.",
        overlappingFeatures: [],
        distinctiveFeatures: invention.components || []
      };
    }
    
    // Get highest similarity score
    const topMatch = matchedPatents[0];
    const topScore = topMatch.similarity.overallScore;
    
    // Find overlapping components and functions
    const patentComponents = new Set((topMatch.components || []).map(c => c.toLowerCase()));
    const patentFunctions = new Set((topMatch.functions || []).map(f => f.toLowerCase()));
    
    const overlappingComponents = (invention.components || []).filter(c => patentComponents.has(c.toLowerCase()));
    const overlappingFunctions = (invention.functions || []).filter(f => patentFunctions.has(f.toLowerCase()));
    
    const distinctiveComponents = (invention.components || []).filter(c => !patentComponents.has(c.toLowerCase()));
    const distinctiveFunctions = (invention.functions || []).filter(f => !patentFunctions.has(f.toLowerCase()));
    
    const overlappingFeatures = Array.from(new Set([...overlappingComponents, ...overlappingFunctions]));
    const distinctiveFeatures = Array.from(new Set([...distinctiveComponents, ...distinctiveFunctions]));
    
    let noveltyScore = 100 - topScore;
    // Bounds check
    if (noveltyScore < 0) noveltyScore = 0;
    
    let noveltyLevel = "High";
    if (topScore > 75) {
      noveltyLevel = "Low";
    } else if (topScore > 40) {
      noveltyLevel = "Medium";
    }
    
    let reasoning = "";
    if (noveltyLevel === "Low") {
      reasoning = `Highly similar prior art was identified (specifically ${topMatch.patentNumber}: ${topMatch.title}). The primary functional workflow to "${overlappingFunctions.slice(0, 2).join(" and ")}" and hardware parts like ${overlappingComponents.slice(0, 2).join(", ")} are thoroughly claimed. Claim changes are recommended to bypass this prior art.`;
    } else if (noveltyLevel === "Medium") {
      reasoning = `Moderate overlap detected with patent ${topMatch.patentNumber}. While core components like ${overlappingComponents.join(", ")} are similar, your unique functional processes such as "${distinctiveFunctions.slice(0, 2).join(" and ")}" provide a strong baseline for patent eligibility.`;
    } else {
      reasoning = `Excellent novelty profile. The system exhibits unique functional workflows and component architecture compared to top prior art. Your distinctive features are highly defensible.`;
    }

    return {
      noveltyScore,
      noveltyLevel,
      reasoning,
      overlappingFeatures,
      distinctiveFeatures
    };
  },

  /**
   * AI Chat assistant to brainstorm patent edits or ask questions
   */
  async chatSuggest(invention, messages) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    // Heuristic conversational replies
    if (lastMessage.includes("claims") || lastMessage.includes("write claim") || lastMessage.includes("legal")) {
      return `Based on "${invention.title}", I recommend structuring your independent claim as:
      
"1. An automated system in the domain of ${invention.domain}, comprising:
  - a tracking assembly matching the parameters of [Unique Feature];
  - a local processing engine configured to dynamically execute:
    a) ${invention.functions[0] || "input gathering"}, and
    b) ${invention.functions[1] || "data communication"};
  - wherein said processing engine optimizes resource consumption based on telemetry."`;
    }
    
    if (lastMessage.includes("bypass") || lastMessage.includes("avoid") || lastMessage.includes("similar")) {
      return `To bypass existing patents matching "${invention.domain}", you should emphasize your unique features:
1. Focus on **how** you achieve the process rather than the general output.
2. Formulate claims around the specific hardware constraint (e.g., local offline execution, dry adhesive layers).
3. Draft details specifically addressing the lack of cloud dependency, which differentiates your application from most IoT prior art.`;
    }
    
    if (lastMessage.includes("component") || lastMessage.includes("hardware") || lastMessage.includes("features")) {
      return `Looking at your components (${(invention.components || []).join(", ")}), adding the following micro-circuits or integrations could increase patent distinctiveness:
- Integrated energy-harvesting piezoelectric coils
- Secure hardware enclave encryption for the BLE radio chip
- Variable-frequency sampling algorithm mapping to user battery state.`;
    }
    
    return `Hello! I am your AI Patent Copilot. I've analyzed your invention draft for "${invention.title}". 

You can ask me to:
- "Draft claims" for this invention.
- "Bypass suggestions" to avoid similar patents.
- "Recommend features" to increase the novelty score.
- "Critique my description" for patent drafting standards.`;
  }
};
