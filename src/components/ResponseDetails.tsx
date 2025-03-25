import { useState } from 'react';

export default function ResponseDetails({ details }: { 
    details: {
        anonymizedPrompt: string;
        raw: string;
        final: string;
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
                            {details.anonymizedPrompt}
                        </div>
                    </div>
                    
                    <div className="step">
                        <h4>LLM Raw Response</h4>
                        <div className="content-block">
                            {details.raw}
                        </div>
                    </div>
                    
                    <div className="step">
                        <h4>After Recontextualization</h4>
                        <div className="content-block">
                            {details.final}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
