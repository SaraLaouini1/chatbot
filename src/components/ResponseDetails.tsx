
import { useState } from 'react';

// Helper function that wraps placeholders (e.g. <placeholder>) in <strong> tags.
function renderBoldPlaceholders(text: string) {
  // This regex splits the string into parts that are placeholders and the rest of the text.
  const parts = text.split(/(<[^>]+>)/g);
  return parts.map((part, index) => {
    // If the part matches the placeholder pattern, wrap it in a <strong> tag.
    if (/<[^>]+>/.test(part)) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
}

export default function ResponseDetails({ details }: { 
    details: {
        anonymizedPrompt: string;
        raw: string;
    }
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="response-details">
            <button 
                onClick={() => setExpanded(!expanded)}
                className="toggle-details"
            >
                {expanded ? '▲ Hide Details' : '▼ Show Processing Details'}
            </button>
            
            {expanded && (
                <div className="processing-steps">
                    <div className="step">
                        <h4>Anonymized Prompt</h4>
                        <div className="content-block">
                            {renderBoldPlaceholders(details.anonymizedPrompt)}
                        </div>
                    </div>
                    
                    <div className="step">
                        <h4>LLM Raw Response</h4>
                        <div className="content-block">
                            {renderBoldPlaceholders(details.raw)}
                        </div>
                    </div>
                    
                </div>
            )}
        </div>
    );
}
