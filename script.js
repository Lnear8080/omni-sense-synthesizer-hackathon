document.addEventListener('DOMContentLoaded', () => {
    initializeHeader();
    initializeAnimations();
    initializeDemo();
    initializeScrollEffects();
});

function initializeHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pain-point, .capability-card, .output-panel, .highlight, .connect-link').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initializeDemo() {
    const textarea = document.getElementById('knowledge-input');
    const synthesizeBtn = document.getElementById('synthesize-btn');
    const outputPanels = {
        entities: document.getElementById('entities-content'),
        relationships: document.getElementById('relationships-content'),
        summary: document.getElementById('summary-content'),
        sources: document.getElementById('sources-content')
    };

    synthesizeBtn.addEventListener('click', () => {
        const input = textarea.value.trim();
        if (!input) {
            alert('Please enter some text to synthesize!');
            return;
        }

        startSynthesis(input, outputPanels, synthesizeBtn);
    });
}

function startSynthesis(input, outputPanels, button) {
    button.classList.add('loading');
    button.disabled = true;
    
    Object.values(outputPanels).forEach(panel => {
        panel.style.opacity = '0';
        panel.innerHTML = '<div class="loading-placeholder"><div class="loading-dots"><span></span><span></span><span></span></div><p>Analyzing knowledge...</p></div>';
    });

    setTimeout(() => {
        const results = generateSynthesisResults(input);
        
        Object.entries(outputPanels).forEach(([key, panel], index) => {
            setTimeout(() => {
                panel.innerHTML = results[key];
                panel.style.opacity = '1';
            }, index * 200);
        });

        button.classList.remove('loading');
        button.disabled = false;
    }, 2000);
}

function generateSynthesisResults(input) {
    const entities = extractEntities(input);
    const relationships = generateRelationships(entities);
    const summary = generateSummary(input, entities);
    const sources = generateSources(input);
    
    return {
        entities: formatEntities(entities),
        relationships: formatRelationships(relationships),
        summary: formatSummary(summary),
        sources: formatSources(sources)
    };
}

function extractEntities(input) {
    const entities = [];
    const commonEntities = [
        'AI', 'machine learning', 'data', 'analysis', 'technology', 'business',
        'customer', 'product', 'service', 'development', 'research', 'innovation'
    ];
    
    commonEntities.forEach(entity => {
        if (input.toLowerCase().includes(entity.toLowerCase())) {
            entities.push({
                name: entity,
                frequency: (input.toLowerCase().match(new RegExp(entity.toLowerCase(), 'g')) || []).length,
                type: getEntityType(entity)
            });
        }
    });
    
    if (entities.length === 0) {
        entities.push(
            { name: 'Information', frequency: 3, type: 'concept' },
            { name: 'Knowledge', frequency: 2, type: 'concept' },
            { name: 'Data', frequency: 1, type: 'concept' }
        );
    }
    
    return entities.slice(0, 8);
}

function getEntityType(entity) {
    const types = {
        'AI': 'technology',
        'machine learning': 'technology',
        'data': 'concept',
        'analysis': 'process',
        'technology': 'concept',
        'business': 'domain',
        'customer': 'stakeholder',
        'product': 'artifact',
        'service': 'artifact',
        'development': 'process',
        'research': 'process',
        'innovation': 'concept'
    };
    return types[entity] || 'concept';
}

function generateRelationships(entities) {
    const relationships = [];
    
    for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
            if (Math.random() > 0.5) {
                relationships.push({
                    source: entities[i].name,
                    target: entities[j].name,
                    type: ['supports', 'enables', 'requires', 'improves'][Math.floor(Math.random() * 4)],
                    strength: Math.floor(Math.random() * 3) + 1
                });
            }
        }
    }
    
    return relationships.slice(0, 6);
}

function generateSummary(input, entities) {
    const wordCount = input.split(/\s+/).length;
    const keyTopics = entities.slice(0, 3).map(e => e.name).join(', ');
    
    return {
        mainTopic: keyTopics || 'Information Analysis',
        keyInsights: [
            `Content contains ${wordCount} words with ${entities.length} key concepts`,
            'Multiple interconnected themes identified',
            'Potential for knowledge graph expansion',
            'Contextual relationships discovered'
        ],
        recommendations: [
            'Consider expanding on identified entities',
            'Explore relationships between key concepts',
            'Validate insights with additional data sources'
        ]
    };
}

function generateSources(input) {
    const sources = [];
    const lines = input.split('\n').filter(line => line.trim());
    
    lines.forEach((line, index) => {
        if (line.trim() && Math.random() > 0.7) {
            sources.push({
                id: `source-${index + 1}`,
                content: line.substring(0, 100) + (line.length > 100 ? '...' : ''),
                relevance: Math.floor(Math.random() * 100) + 50,
                type: line.includes('http') ? 'web' : 'document'
            });
        }
    });
    
    return sources.slice(0, 5);
}

function formatEntities(entities) {
    if (entities.length === 0) {
        return '<p class="no-data">No entities detected</p>';
    }
    
    const entityTags = entities.map(entity => {
        const typeClass = `entity-type-${entity.type}`;
        return `
            <span class="entity-tag ${typeClass}" data-frequency="${entity.frequency}">
                <span class="entity-name">${entity.name}</span>
                <span class="entity-freq">${entity.frequency}</span>
            </span>
        `;
    }).join('');
    
    return `
        <div class="entities-container">
            <div class="entity-tags">
                ${entityTags}
            </div>
            <div class="entity-stats">
                <p>Found ${entities.length} key entities across ${entities.reduce((sum, e) => sum + e.frequency, 0)} mentions</p>
            </div>
        </div>
    `;
}

function formatRelationships(relationships) {
    if (relationships.length === 0) {
        return '<p class="no-data">No relationships detected</p>';
    }
    
    const relationshipItems = relationships.map(rel => {
        const strengthClass = `strength-${rel.strength}`;
        return `
            <div class="relationship-item ${strengthClass}">
                <span class="rel-source">${rel.source}</span>
                <span class="rel-arrow">→</span>
                <span class="rel-type">${rel.type}</span>
                <span class="rel-arrow">→</span>
                <span class="rel-target">${rel.target}</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="relationships-container">
            <div class="relationship-list">
                ${relationshipItems}
            </div>
            <div class="relationship-stats">
                <p>Discovered ${relationships.length} connections between entities</p>
            </div>
        </div>
    `;
}

function formatSummary(summary) {
    return `
        <div class="summary-container">
            <div class="summary-topic">
                <h4>Main Topic</h4>
                <p>${summary.mainTopic}</p>
            </div>
            <div class="summary-insights">
                <h4>Key Insights</h4>
                <ul>
                    ${summary.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>
            <div class="summary-recommendations">
                <h4>Recommendations</h4>
                <ul>
                    ${summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function formatSources(sources) {
    if (sources.length === 0) {
        return '<p class="no-data">No sources identified</p>';
    }
    
    const sourceItems = sources.map(source => {
        const typeIcon = source.type === 'web' ? '<i class="fas fa-globe"></i>' : '<i class="fas fa-file-alt"></i>';
        return `
            <div class="source-item">
                <div class="source-icon">${typeIcon}</div>
                <div class="source-content">
                    <div class="source-text">${source.content}</div>
                    <div class="source-meta">
                        <span class="source-type">${source.type}</span>
                        <span class="source-relevance">${source.relevance}% relevant</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="sources-container">
            <div class="source-list">
                ${sourceItems}
            </div>
        </div>
    `;
}

function initializeScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add CSS for demo components
const demoStyles = `
<style>
.loading-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
}

.loading-dots {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

.loading-dots span {
    width: 8px;
    height: 8px;
    background: var(--accent-primary);
    border-radius: 50%;
    animation: loadingDot 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loadingDot {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

.entities-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.entity-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.entity-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
}

.entity-tag:hover {
    transform: translateY(-2px);
    box-shadow: var(--glow-primary);
}

.entity-type-technology {
    background: rgba(0, 212, 255, 0.2);
    color: var(--accent-primary);
    border: 1px solid rgba(0, 212, 255, 0.3);
}

.entity-type-concept {
    background: rgba(124, 58, 237, 0.2);
    color: var(--accent-secondary);
    border: 1px solid rgba(124, 58, 237, 0.3);
}

.entity-type-process {
    background: rgba(6, 182, 212, 0.2);
    color: var(--accent-tertiary);
    border: 1px solid rgba(6, 182, 212, 0.3);
}

.entity-type-domain {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success);
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.entity-type-stakeholder {
    background: rgba(245, 158, 11, 0.2);
    color: var(--warning);
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.entity-type-artifact {
    background: rgba(239, 68, 68, 0.2);
    color: var(--error);
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.entity-freq {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
}

.relationships-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.relationship-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.relationship-item:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--glow-primary);
}

.rel-source, .rel-target {
    font-weight: 600;
    color: var(--text-primary);
}

.rel-arrow {
    color: var(--accent-primary);
    font-weight: bold;
}

.rel-type {
    color: var(--text-secondary);
    font-size: 0.85rem;
    font-style: italic;
}

.strength-1 { border-left: 3px solid var(--text-muted); }
.strength-2 { border-left: 3px solid var(--warning); }
.strength-3 { border-left: 3px solid var(--accent-primary); }

.summary-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.summary-topic, .summary-insights, .summary-recommendations {
    padding: 16px;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.summary-topic h4, .summary-insights h4, .summary-recommendations h4 {
    color: var(--accent-primary);
    margin-bottom: 12px;
    font-size: 1rem;
}

.summary-topic p {
    color: var(--text-primary);
    font-weight: 500;
}

.summary-insights ul, .summary-recommendations ul {
    list-style: none;
    padding: 0;
}

.summary-insights li, .summary-recommendations li {
    color: var(--text-secondary);
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;
}

.summary-insights li::before {
    content: '•';
    color: var(--accent-primary);
    position: absolute;
    left: 0;
}

.summary-recommendations li::before {
    content: '→';
    color: var(--accent-secondary);
    position: absolute;
    left: 0;
}

.sources-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.source-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.source-item:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--glow-primary);
}

.source-icon {
    color: var(--accent-primary);
    font-size: 1.2rem;
    margin-top: 2px;
}

.source-content {
    flex: 1;
}

.source-text {
    color: var(--text-primary);
    font-size: 0.9rem;
    margin-bottom: 6px;
    line-height: 1.4;
}

.source-meta {
    display: flex;
    gap: 12px;
    font-size: 0.8rem;
}

.source-type {
    color: var(--text-secondary);
    text-transform: uppercase;
    font-weight: 500;
}

.source-relevance {
    color: var(--accent-primary);
    font-weight: 600;
}

.no-data {
    color: var(--text-muted);
    text-align: center;
    font-style: italic;
    padding: 20px;
}

.entity-stats, .relationship-stats {
    padding: 12px;
    background: var(--primary-bg);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.entity-stats p, .relationship-stats p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin: 0;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', demoStyles); 