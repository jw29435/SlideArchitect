# Example Text Inputs for SlideArchitect

## Example 1: Simple Introduction

```
Introduction to Artificial Intelligence

Artificial Intelligence (AI) is revolutionizing industries worldwide.
From healthcare to finance, AI systems are automating complex tasks
and providing valuable insights that were previously impossible.

Key Benefits
• Automation of repetitive tasks
• Data-driven decision making
• Improved efficiency and productivity
• Enhanced customer experiences

Applications in Business
Organizations are leveraging AI for:
- Predictive analytics
- Customer service chatbots
- Fraud detection
- Personalized recommendations
```

**Expected Output:**
- 1 Title slide: "Introduction to Artificial Intelligence"
- 1 Content slide: Main paragraph
- 1 Content slide: "Key Benefits" with bullets
- 1 Content slide: "Applications in Business" with list

---

## Example 2: Multi-Section Presentation

```
Digital Transformation Strategy

Section: Current State

Our organization faces challenges in the digital landscape.
Legacy systems, manual processes, and siloed data prevent us
from competing effectively in today's market.

Section: Proposed Solution

Cloud Migration
Moving to cloud infrastructure provides scalability, security,
and reduced costs. AWS and Azure offer enterprise-grade solutions.

Process Automation
Implementing RPA will eliminate manual data entry and reduce errors
by 95%. Expected ROI within 18 months.

Section: Implementation Roadmap

Phase 1: Assessment and planning (Q1-Q2)
Phase 2: Pilot programs (Q3)
Phase 3: Full rollout (Q4-Q1)
Phase 4: Optimization (Ongoing)
```

**Expected Output:**
- 1 Title slide: "Digital Transformation Strategy"
- 1 Section slide: "Current State"
- 1 Content slide: Current state description
- 1 Section slide: "Proposed Solution"
- 1 Two-column slide: "Cloud Migration" and "Process Automation"
- 1 Section slide: "Implementation Roadmap"
- 1 Content slide: Phases list

---

## Example 3: Technical Content

```
API Design Best Practices

RESTful Architecture
REST APIs follow standard HTTP methods (GET, POST, PUT, DELETE)
and use JSON for data exchange. Key principles include:
- Stateless operations
- Resource-based URLs
- Proper status codes
- Versioning strategy

Authentication Methods
OAuth 2.0: Industry-standard authorization framework providing
secure delegated access. Supports multiple grant types.

API Keys: Simple authentication using unique identifiers. Best
for server-to-server communication with rate limiting.

Error Handling
Return meaningful error messages with:
• HTTP status codes (400, 401, 404, 500)
• Error descriptions
• Suggestions for resolution
• Request IDs for tracking

Documentation
Comprehensive API documentation using OpenAPI/Swagger includes:
- Endpoint descriptions
- Request/response examples
- Authentication requirements
- Rate limits and quotas
```

**Expected Output:**
- 1 Title slide: "API Design Best Practices"
- 1 Content slide: "RESTful Architecture"
- 1 Two-column slide: "Authentication Methods" (OAuth vs API Keys)
- 1 Content slide: "Error Handling"
- 1 Content slide: "Documentation"

---

## Example 4: Overflow Testing

```
This is a very long title that exceeds sixty characters and should be truncated

This is a content paragraph that is intentionally very long to test the overflow
handling functionality. The system should detect when content exceeds the maximum
character limit of 800 characters and either split it into multiple columns or
truncate it with an ellipsis. This paragraph continues with additional text to
push past the limit and demonstrate the deterministic layout rules in action.
More content here to ensure we definitely exceed the character count threshold
that has been configured in the overflow handler module. The system enforces
these rules to maintain consistent slide layouts and prevent text from overflowing
off the visible area of the slide. Let's add even more text to make absolutely
sure we trigger the overflow handling logic that was implemented. This should be
enough text now to test the functionality thoroughly and verify that the system
correctly handles long content by applying the configured rules for truncation
and layout adjustment. Additional filler text continues here to pad out the content
even further and stress test the overflow detection and handling mechanisms that
have been put in place to ensure deterministic behavior.
```

**Expected Output:**
- 1 Title slide with truncated title (60 chars + "...")
- 1 Content slide with truncated content (800 chars + "...")
- OR 1 Two-column slide with content split between columns

---

## Example 5: Business Presentation

```
Q4 2023 Business Review

Executive Summary
Strong performance across all divisions with 23% revenue growth.
Successful product launches and market expansion exceeded targets.

Financial Highlights
Revenue: $45.2M (↑23%)
Operating margin: 18.5%
Net profit: $8.3M
Cash reserves: $12.1M

Market Performance
New customer acquisition up 35% with improved retention rates.
Expanded into 3 new geographic markets. Brand awareness increased
significantly through digital marketing campaigns.

Product Innovation
Launched 4 new products including flagship enterprise solution.
Patent applications filed for proprietary technology. Customer
satisfaction scores at all-time high of 4.7/5.0.

Looking Ahead
Focus areas for 2024:
• Scale operations to meet growing demand
• Invest in R&D for next-gen solutions
• Strategic partnerships and acquisitions
• Expand sales team by 40%

Conclusion
Strong foundation for continued growth. Team execution excellent.
Optimistic outlook for 2024 with clear strategic direction.
```

**Expected Output:**
- 1 Title slide: "Q4 2023 Business Review"
- 1 Content slide: "Executive Summary"
- 1 Two-column slide: "Financial Highlights" and "Market Performance"
- 1 Content slide: "Product Innovation"
- 1 Content slide: "Looking Ahead" with bullets
- 1 Content slide: "Conclusion"

---

## Testing Tips

1. **Start Simple**: Begin with Example 1 to verify basic functionality
2. **Test Sections**: Use Example 2 to validate section slide generation
3. **Test Two-Column**: Examples with side-by-side content test column layouts
4. **Test Overflow**: Example 4 validates character limits and truncation
5. **Test Complexity**: Example 5 combines multiple features

## Mock Generation vs OpenAI

**Mock Generation** (no API key):
- Rule-based parsing
- Splits by double newlines
- Detects "Section:" patterns
- Splits long content into columns
- Fast and predictable

**OpenAI Generation** (with API key):
- Intelligent content analysis
- Better section detection
- Optimized layout selection
- Natural content splitting
- Requires API credits

## Validation Checklist

After generation, verify:
- [ ] Correct number of slides created
- [ ] Appropriate layout types selected
- [ ] All placeholders filled with content
- [ ] No overflow beyond slide boundaries
- [ ] Font sizes within acceptable ranges
- [ ] Title length ≤ 60 characters (or truncated)
- [ ] Content length ≤ 800 characters (or split/truncated)
- [ ] Consistent formatting across slides
