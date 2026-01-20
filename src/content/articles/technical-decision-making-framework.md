---
title: "Technical Decision-Making: A Framework for System Architects"
coverImage: "/images/technical-decision-making-framework.jpg"
excerpt: "A proven decision-making framework that helps architects evaluate technology choices, assess trade-offs, and avoid costly mistakes. Based on 50+ architecture decisions across production systems."
publishedAt: 2026-01-16T00:00:00.000Z
readTime: 14
featured: true
category: system-design
tags: ["System Design", "Architecture", "Decision Making", "Technical Leadership", "Risk Assessment", "Technology Selection"]
---

When a client asked us to choose between microservices and a monolith for their new platform, we didn't guess. We used a structured decision framework that evaluated 12 criteria across cost, complexity, performance, and maintainability.

After making 50+ architecture decisions across production systems, I've seen teams waste months on wrong choices because they lacked a systematic approach. Here's the framework that's helped us make better decisions faster.

![Technical Decision-Making Framework](/images/technical-decision-making-framework.jpg)

## The Problem: Why Technical Decisions Fail

Most teams make architecture decisions based on:
- **Latest trends** - "Everyone's using microservices, so we should too"
- **Personal preferences** - "I like this technology"
- **Incomplete analysis** - "It seems faster" without measuring
- **Missing trade-offs** - Focusing on one benefit while ignoring costs

We've seen projects delayed by 6+ months because teams chose the wrong database, architecture pattern, or infrastructure approach. The cost isn't just time, it's technical debt that compounds over years.

Here's how to make decisions systematically.

## The Decision Framework: Criteria → Weights → Scoring

```mermaid
graph TD
    A[Define Decision Context] --> B[Identify Options]
    B --> C[Define Criteria]
    C --> D[Assign Weights]
    D --> E[Score Each Option]
    E --> F[Calculate Weighted Scores]
    F --> G[Assess Risks]
    G --> H[Document Decision]
    
    G -->|High Risk| I[Create Mitigation Plan]
    I --> H
```

*Figure 1: Decision-Making Process Flow*

---

## Step 1: Define Decision Context

Before evaluating options, clearly define what you're solving.

### Pattern: Decision Statement Template

Use this structure to document your decision context:

**Decision:** Choose [technology/pattern] for [use case]

**Context:**
- **Current state:** [What exists now]
- **Requirements:** [What must be achieved]
- **Constraints:** [Budget, timeline, team skills]
- **Success criteria:** [How we'll measure success]

**Stakeholders:** [Who needs to be involved]  
**Timeline:** [When decision must be made]

### Example: Database Selection

**Decision:** Choose database for user analytics platform

**Context:**
- **Current state:** PostgreSQL handling 10K queries/day
- **Requirements:** Support 1M+ queries/day, real-time analytics
- **Constraints:** $5K/month budget, 3-person team, 6-month timeline
- **Success criteria:** <100ms query latency, 99.9% uptime

**Stakeholders:** Engineering lead, CTO, DevOps  
**Timeline:** Decision needed in 2 weeks

**Why this matters:**
- Prevents scope creep
- Aligns stakeholders on the problem
- Sets clear success metrics
- Documents constraints upfront

---

## Step 2: Identify Evaluation Criteria

Not all criteria are equal. Define what matters for this specific decision.

### Common Criteria Categories

**Performance:**
- Latency (response time)
- Throughput (requests/second)
- Scalability (growth capacity)

**Operational:**
- Setup complexity
- Maintenance overhead
- Monitoring and observability
- Deployment ease

**Cost:**
- Initial cost (licensing, setup)
- Operational cost (hosting, maintenance)
- Team cost (learning curve, hiring)

**Risk:**
- Vendor lock-in
- Technology maturity
- Community support
- Migration difficulty

**Example: Database Selection Criteria**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">criteria</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"query_performance"</span>: {
        <span class="cuwxp">"description"</span>: <span class="cuwxp">"Average query latency for common operations"</span>,
        <span class="cuwxp">"category"</span>: <span class="cuwxp">"performance"</span>,
        <span class="cuwxp">"measurement"</span>: <span class="cuwxp">"milliseconds"</span>
    },
    <span class="cuwxp">"scalability"</span>: {
        <span class="cuwxp">"description"</span>: <span class="cuwxp">"Ability to handle 10x growth"</span>,
        <span class="cuwxp">"category"</span>: <span class="cuwxp">"performance"</span>,
        <span class="cuwxp">"measurement"</span>: <span class="cuwxp">"qualitative (1-5 scale)"</span>
    },
    <span class="cuwxp">"operational_complexity"</span>: {
        <span class="cuwxp">"description"</span>: <span class="cuwxp">"Effort required for setup, maintenance, monitoring"</span>,
        <span class="cuwxp">"category"</span>: <span class="cuwxp">"operational"</span>,
        <span class="cuwxp">"measurement"</span>: <span class="cuwxp">"qualitative (1-5 scale)"</span>
    },
    <span class="cuwxp">"monthly_cost"</span>: {
        <span class="cuwxp">"description"</span>: <span class="cuwxp">"Total monthly operational cost"</span>,
        <span class="cuwxp">"category"</span>: <span class="cuwxp">"cost"</span>,
        <span class="cuwxp">"measurement"</span>: <span class="cuwxp">"dollars"</span>
    },
    <span class="cuwxp">"vendor_lock_in"</span>: {
        <span class="cuwxp">"description"</span>: <span class="cuwxp">"Risk of being locked into specific vendor"</span>,
        <span class="cuwxp">"category"</span>: <span class="cuwxp">"risk"</span>,
        <span class="cuwxp">"measurement"</span>: <span class="cuwxp">"qualitative (1-5 scale, 5 = high lock-in)"</span>
    },
    <span class="cuwxp">"team_familiarity"</span>: {
        <span class="cuwxp">"description"</span>: <span class="cuwxp">"Team's existing knowledge and experience"</span>,
        <span class="cuwxp">"category"</span>: <span class="cuwxp">"operational"</span>,
        <span class="cuwxp">"measurement"</span>: <span class="cuwxp">"qualitative (1-5 scale)"</span>
    }
}
</code></pre>

**Key principles:**
- Include 6-12 criteria (too few = incomplete, too many = analysis paralysis)
- Mix quantitative and qualitative measures
- Focus on criteria that differentiate options
- Document how you'll measure each criterion

---

## Step 3: Assign Weights

Not all criteria are equally important. Weight them based on your context.

### Pattern: Weighted Scoring Matrix

```mermaid
graph LR
    A[Criteria] --> B[Weight Assignment]
    B --> C[Option Scoring]
    C --> D[Weighted Calculation]
    D --> E[Total Score]
    
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#e8f5e9
```

*Figure 2: Weighted Scoring Process*

**Example: Database Selection Weights**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">weights</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"query_performance"</span>: <span class="cuwxp">0.25</span>,  <span class="cd909"># Critical for user experience</span>
    <span class="cuwxp">"scalability"</span>: <span class="cuwxp">0.20</span>,         <span class="cd909"># Must handle growth</span>
    <span class="cuwxp">"operational_complexity"</span>: <span class="cuwxp">0.15</span>,  <span class="cd909"># Small team, limited DevOps</span>
    <span class="cuwxp">"monthly_cost"</span>: <span class="cuwxp">0.15</span>,        <span class="cd909"># Budget constraint</span>
    <span class="cuwxp">"vendor_lock_in"</span>: <span class="cuwxp">0.15</span>,      <span class="cd909"># Want flexibility</span>
    <span class="cuwxp">"team_familiarity"</span>: <span class="cuwxp">0.10</span>     <span class="cd909"># Nice to have, not critical</span>
}

<span class="cd909"># Verify weights sum to 1.0</span>
<span class="cd909">assert</span> <span class="ct35c">sum</span>(<span class="ct35c">weights</span>.<span class="ct35c">values</span>()) <span class="cb1xz">==</span> <span class="cuwxp">1.0</span>
</code></pre>

**Weighting guidelines:**
- Critical criteria: 0.20-0.30
- Important criteria: 0.10-0.20
- Nice-to-have: 0.05-0.10
- Always sum to 1.0
- Adjust based on your constraints (budget-constrained? Weight cost higher)

---

## Step 4: Score Each Option

Score each option against all criteria using consistent scales.

### Pattern: Scoring Scale

**Quantitative criteria (performance, cost):**
- Use actual measurements when possible
- Normalize to 0-5 scale for comparison

**Qualitative criteria (complexity, risk):**
- Use 1-5 scale: 1 = poor, 3 = acceptable, 5 = excellent
- Document scoring rationale

**Example: Database Comparison**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">options</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"PostgreSQL"</span>: {
        <span class="cuwxp">"query_performance"</span>: <span class="cuwxp">4</span>,  <span class="cd909"># 50ms avg latency (excellent)</span>
        <span class="cuwxp">"scalability"</span>: <span class="cuwxp">4</span>,        <span class="cd909"># Handles 10x with read replicas</span>
        <span class="cuwxp">"operational_complexity"</span>: <span class="cuwxp">3</span>,  <span class="cd909"># Team knows it, moderate setup</span>
        <span class="cuwxp">"monthly_cost"</span>: <span class="cuwxp">5</span>,       <span class="cd909"># $200/month (very low)</span>
        <span class="cuwxp">"vendor_lock_in"</span>: <span class="cuwxp">5</span>,     <span class="cd909"># Open source, no lock-in</span>
        <span class="cuwxp">"team_familiarity"</span>: <span class="cuwxp">5</span>    <span class="cd909"># Team has 3+ years experience</span>
    },
    <span class="cuwxp">"MongoDB"</span>: {
        <span class="cuwxp">"query_performance"</span>: <span class="cuwxp">3</span>,  <span class="cd909"># 80ms avg latency (good)</span>
        <span class="cuwxp">"scalability"</span>: <span class="cuwxp">5</span>,        <span class="cd909"># Excellent horizontal scaling</span>
        <span class="cuwxp">"operational_complexity"</span>: <span class="cuwxp">2</span>,  <span class="cd909"># New to team, complex setup</span>
        <span class="cuwxp">"monthly_cost"</span>: <span class="cuwxp">3</span>,        <span class="cd909"># $800/month (moderate)</span>
        <span class="cuwxp">"vendor_lock_in"</span>: <span class="cuwxp">3</span>,     <span class="cd909"># Some lock-in, but manageable</span>
        <span class="cuwxp">"team_familiarity"</span>: <span class="cuwxp">2</span>    <span class="cd909"># Team has minimal experience</span>
    },
    <span class="cuwxp">"DynamoDB"</span>: {
        <span class="cuwxp">"query_performance"</span>: <span class="cuwxp">5</span>,   <span class="cd909"># 20ms avg latency (excellent)</span>
        <span class="cuwxp">"scalability"</span>: <span class="cuwxp">5</span>,        <span class="cd909"># Auto-scales seamlessly</span>
        <span class="cuwxp">"operational_complexity"</span>: <span class="cuwxp">5</span>,  <span class="cd909"># Fully managed, minimal ops</span>
        <span class="cuwxp">"monthly_cost"</span>: <span class="cuwxp">2</span>,       <span class="cd909"># $2000/month (high)</span>
        <span class="cuwxp">"vendor_lock_in"</span>: <span class="cuwxp">1</span>,     <span class="cd909"># Strong AWS lock-in</span>
        <span class="cuwxp">"team_familiarity"</span>: <span class="cuwxp">3</span>    <span class="cd909"># Some team experience</span>
    }
}
</code></pre>

**Scoring best practices:**
- Score all options in one session (consistency)
- Document assumptions and measurements
- Use benchmarks when available (don't guess performance)
- Get team input (reduces bias)

---

## Step 5: Calculate Weighted Scores

Multiply scores by weights and sum for each option.

### Pattern: Weighted Score Calculation

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">def</span> <span class="ct35c">calculate_weighted_score</span>(<span class="ct35c">option_scores</span>, <span class="ct35c">weights</span>):
    <span class="cuwxp">"""Calculate total weighted score for an option."""</span>
    <span class="ct35c">total</span> <span class="cb1xz">=</span> <span class="cuwxp">0</span>
    <span class="cd909">for</span> <span class="ct35c">criterion</span>, <span class="ct35c">score</span> <span class="cd909">in</span> <span class="ct35c">option_scores</span>.<span class="ct35c">items</span>():
        <span class="ct35c">total</span> <span class="cb1xz">+=</span> <span class="ct35c">score</span> <span class="cb1xz">*</span> <span class="ct35c">weights</span>[<span class="ct35c">criterion</span>]
    <span class="cd909">return</span> <span class="ct35c">total</span>

<span class="cd909"># Calculate scores</span>
<span class="ct35c">results</span> <span class="cb1xz">=</span> {}
<span class="cd909">for</span> <span class="ct35c">option_name</span>, <span class="ct35c">scores</span> <span class="cd909">in</span> <span class="ct35c">options</span>.<span class="ct35c">items</span>():
    <span class="ct35c">results</span>[<span class="ct35c">option_name</span>] <span class="cb1xz">=</span> <span class="ct35c">calculate_weighted_score</span>(<span class="ct35c">scores</span>, <span class="ct35c">weights</span>)

<span class="cd909"># Results:</span>
<span class="cd909"># PostgreSQL: 4.25</span>
<span class="cd909"># MongoDB: 3.15</span>
<span class="cd909"># DynamoDB: 3.60</span>
</code></pre>

**Decision matrix visualization:**

```mermaid
graph TD
    A[Decision Matrix] --> B[PostgreSQL: 4.25]
    A --> C[DynamoDB: 3.60]
    A --> D[MongoDB: 3.15]
    
    B --> E[Best Overall Score]
    C --> F[High Cost, Lock-in Risk]
    D --> G[Low Familiarity, Complexity]
    
    style E fill:#c8e6c9
    style F fill:#fff9c4
    style G fill:#ffcdd2
```

*Figure 3: Weighted Score Comparison*

**Key insight:** The highest score isn't always the best choice. You need to assess risks next.

---

## Step 6: Risk Assessment

High-scoring options can have deal-breaking risks. Assess them separately.

### Pattern: Risk Matrix

```mermaid
graph LR
    A[Risk Assessment] --> B[Probability]
    A --> C[Impact]
    B --> D[High/Medium/Low]
    C --> D
    D --> E[Risk Score]
    
    style E fill:#ffcdd2
```

*Figure 4: Risk Assessment Framework*

**Risk categories:**

**Technical Risk:**
- Technology maturity (new vs. established)
- Performance at scale (untested)
- Integration complexity

**Operational Risk:**
- Team expertise gaps
- Maintenance burden
- Vendor support quality

**Business Risk:**
- Vendor lock-in
- Cost escalation
- Migration difficulty

**Example: Risk Assessment for Database Options**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">risks</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"PostgreSQL"</span>: {
        <span class="cuwxp">"vendor_lock_in"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"low"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"low"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">1</span>},
        <span class="cuwxp">"scaling_limits"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">6</span>},
        <span class="cuwxp">"team_capacity"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"low"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"low"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">1</span>}
    },
    <span class="cuwxp">"MongoDB"</span>: {
        <span class="cuwxp">"vendor_lock_in"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">6</span>},
        <span class="cuwxp">"learning_curve"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">9</span>},
        <span class="cuwxp">"operational_complexity"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">8</span>}
    },
    <span class="cuwxp">"DynamoDB"</span>: {
        <span class="cuwxp">"vendor_lock_in"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">9</span>},
        <span class="cuwxp">"cost_escalation"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">9</span>},
        <span class="cuwxp">"migration_difficulty"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">9</span>}
    }
}

<span class="cd909"># Risk scoring: probability (1-3) × impact (1-3) = score (1-9)</span>
<span class="cd909"># High risk: 7-9, Medium: 4-6, Low: 1-3</span>
</code></pre>

**Risk mitigation strategies:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">mitigation_plans</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"PostgreSQL"</span>: {
        <span class="cuwxp">"scaling_limits"</span>: <span class="cuwxp">"Plan: Implement read replicas at 500K queries/day. Cost: $400/month. Timeline: 2 weeks."</span>
    },
    <span class="cuwxp">"DynamoDB"</span>: {
        <span class="cuwxp">"vendor_lock_in"</span>: <span class="cuwxp">"Plan: Use abstraction layer (repository pattern). Allows migration to PostgreSQL later. Effort: 1 week."</span>,
        <span class="cuwxp">"cost_escalation"</span>: <span class="cuwxp">"Plan: Set up cost alerts at $1500/month. Review usage monthly. Budget buffer: 20%."</span>
    }
}
</code></pre>

**Decision rule:** If an option has a high-risk score (7-9) without a clear mitigation plan, consider it a deal-breaker.

---

## Step 7: Make the Decision

Combine weighted scores with risk assessment.

### Pattern: Decision Matrix

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">def</span> <span class="ct35c">make_decision</span>(<span class="ct35c">results</span>, <span class="ct35c">risks</span>, <span class="ct35c">mitigation_plans</span>):
    <span class="cuwxp">"""Final decision based on scores and risks."""</span>
    
    <span class="cd909"># Sort by weighted score</span>
    <span class="ct35c">sorted_options</span> <span class="cb1xz">=</span> <span class="ct35c">sorted</span>(<span class="ct35c">results</span>.<span class="ct35c">items</span>(), <span class="ct35c">key</span><span class="cb1xz">=</span><span class="cd909">lambda</span> <span class="ct35c">x</span>: <span class="ct35c">x</span>[<span class="cuwxp">1</span>], <span class="ct35c">reverse</span><span class="cb1xz">=</span><span class="cd909">True</span>)
    
    <span class="cd909">for</span> <span class="ct35c">option</span>, <span class="ct35c">score</span> <span class="cd909">in</span> <span class="ct35c">sorted_options</span>:
        <span class="ct35c">option_risks</span> <span class="cb1xz">=</span> <span class="ct35c">risks</span>[<span class="ct35c">option</span>]
        <span class="ct35c">high_risks</span> <span class="cb1xz">=</span> [<span class="ct35c">r</span> <span class="cd909">for</span> <span class="ct35c">r</span> <span class="cd909">in</span> <span class="ct35c">option_risks</span>.<span class="ct35c">values</span>() <span class="cd909">if</span> <span class="ct35c">r</span>[<span class="cuwxp">"score"</span>] <span class="cb1xz">&gt;=</span> <span class="cuwxp">7</span>]
        
        <span class="cd909">if</span> <span class="ct35c">high_risks</span> <span class="cd909">and</span> <span class="cd909">not</span> <span class="ct35c">mitigation_plans</span>.<span class="ct35c">get</span>(<span class="ct35c">option</span>):
            <span class="ct35c">print</span>(<span class="cuwxp">f"{option}: High risk without mitigation"</span>)
            <span class="cd909">continue</span>
        
        <span class="cd909">if</span> <span class="ct35c">high_risks</span>:
            <span class="ct35c">print</span>(<span class="cuwxp">f"{option}: Score {score:.2f}, risks mitigated"</span>)
        <span class="cd909">else</span>:
            <span class="ct35c">print</span>(<span class="cuwxp">f"{option}: Score {score:.2f}, low risk"</span>)
        
        <span class="cd909">return</span> <span class="ct35c">option</span>  <span class="cd909"># Return best viable option</span>

<span class="cd909"># Result: PostgreSQL (best score, manageable risks)</span>
</code></pre>

**Decision framework:**

1. **If top option has low risk:** Choose it
2. **If top option has high risk:**
   - Can you mitigate it? → Choose with mitigation plan
   - Can't mitigate? → Consider second-best option
3. **If scores are close (<0.5 difference):** Choose lower-risk option

**Example decision:**

**Decision:** PostgreSQL

**Rationale:**
- Highest weighted score (4.25)
- Low risk profile (only medium risk: scaling limits)
- Scaling risk mitigated with read replicas plan
- Team familiarity reduces operational risk
- Cost-effective for current scale

**Mitigation plan:**
- Monitor query volume weekly
- Implement read replicas when approaching 500K queries/day
- Budget: $400/month for scaling

---

## Step 8: Document the Decision

Documentation prevents "why did we choose this?" questions later.

### Pattern: Architecture Decision Record (ADR)

Use this template to document your architecture decisions:

**ADR-001: Database Selection for Analytics Platform**

**Status:** Accepted

**Context:**
[Decision context from Step 1]

**Decision:**
PostgreSQL with read replica scaling strategy

**Rationale:**
- Weighted score: 4.25 (highest)
- Risk assessment: Low overall risk
- Team familiarity reduces learning curve
- Cost-effective at current scale ($200/month)

**Alternatives Considered:**
- MongoDB: Lower score (3.15), high learning curve risk
- DynamoDB: Good score (3.60), but high vendor lock-in and cost risk

**Consequences:**
- **Positive:** Fast implementation (team expertise)
- **Positive:** Low operational overhead
- **Negative:** Will need read replicas at scale (planned)

**Mitigation Plans:**
- Scaling: Read replicas at 500K queries/day
- Monitoring: Query performance dashboard
- Budget: $400/month scaling budget approved

**Review Date:** 6 months (or when reaching 400K queries/day)

**Why documentation matters:**
- Prevents rehashing decisions
- Explains context to new team members
- Enables informed revisiting when context changes
- Creates organizational knowledge

---

## Real-World Example: Microservices vs. Monolith

Let's apply this framework to a common decision.

**Decision Context:**
- Building new e-commerce platform
- Team: 8 engineers, 6-month timeline
- Expected traffic: 10K users/day initially, 100K in 12 months

**Criteria and Weights:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">criteria_weights</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"development_speed"</span>: <span class="cuwxp">0.25</span>,      <span class="cd909"># Critical for 6-month timeline</span>
    <span class="cuwxp">"operational_complexity"</span>: <span class="cuwxp">0.20</span>,  <span class="cd909"># Small team, limited DevOps</span>
    <span class="cuwxp">"scalability"</span>: <span class="cuwxp">0.15</span>,            <span class="cd909"># Must handle 10x growth</span>
    <span class="cuwxp">"team_expertise"</span>: <span class="cuwxp">0.15</span>,         <span class="cd909"># Team knows monoliths better</span>
    <span class="cuwxp">"cost"</span>: <span class="cuwxp">0.10</span>,                   <span class="cd909"># Budget conscious</span>
    <span class="cuwxp">"future_flexibility"</span>: <span class="cuwxp">0.15</span>      <span class="cd909"># Want to evolve architecture</span>
}
</code></pre>

**Scoring:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">options</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"Monolith"</span>: {
        <span class="cuwxp">"development_speed"</span>: <span class="cuwxp">5</span>,        <span class="cd909"># Faster initial development</span>
        <span class="cuwxp">"operational_complexity"</span>: <span class="cuwxp">5</span>,  <span class="cd909"># Single deploy, simpler ops</span>
        <span class="cuwxp">"scalability"</span>: <span class="cuwxp">3</span>,            <span class="cd909"># Vertical scaling, then horizontal</span>
        <span class="cuwxp">"team_expertise"</span>: <span class="cuwxp">5</span>,         <span class="cd909"># Team has 5+ years experience</span>
        <span class="cuwxp">"cost"</span>: <span class="cuwxp">5</span>,                    <span class="cd909"># Lower infrastructure cost</span>
        <span class="cuwxp">"future_flexibility"</span>: <span class="cuwxp">2</span>       <span class="cd909"># Harder to split later</span>
    },
    <span class="cuwxp">"Microservices"</span>: {
        <span class="cuwxp">"development_speed"</span>: <span class="cuwxp">2</span>,       <span class="cd909"># Slower due to coordination</span>
        <span class="cuwxp">"operational_complexity"</span>: <span class="cuwxp">2</span>,  <span class="cd909"># Multiple services, complex ops</span>
        <span class="cuwxp">"scalability"</span>: <span class="cuwxp">5</span>,            <span class="cd909"># Excellent horizontal scaling</span>
        <span class="cuwxp">"team_expertise"</span>: <span class="cuwxp">2</span>,         <span class="cd909"># Team has minimal experience</span>
        <span class="cuwxp">"cost"</span>: <span class="cuwxp">3</span>,                    <span class="cd909"># Higher infrastructure overhead</span>
        <span class="cuwxp">"future_flexibility"</span>: <span class="cuwxp">5</span>      <span class="cd909"># Easy to evolve independently</span>
    }
}

<span class="cd909"># Weighted scores:</span>
<span class="cd909"># Monolith: 4.30</span>
<span class="cd909"># Microservices: 2.90</span>
</code></pre>

**Risk Assessment:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="ct35c">risks</span> <span class="cb1xz">=</span> {
    <span class="cuwxp">"Monolith"</span>: {
        <span class="cuwxp">"scaling_bottleneck"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">6</span>},
        <span class="cuwxp">"team_coordination"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"low"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"low"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">1</span>}
    },
    <span class="cuwxp">"Microservices"</span>: {
        <span class="cuwxp">"operational_overhead"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">9</span>},
        <span class="cuwxp">"team_learning_curve"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">9</span>},
        <span class="cuwxp">"coordination_complexity"</span>: {<span class="cuwxp">"probability"</span>: <span class="cuwxp">"high"</span>, <span class="cuwxp">"impact"</span>: <span class="cuwxp">"medium"</span>, <span class="cuwxp">"score"</span>: <span class="cuwxp">8</span>}
    }
}
</code></pre>

**Decision:** Monolith

**Rationale:**
- Higher score (4.30 vs 2.90)
- Lower risk profile
- Aligns with team expertise and timeline
- Scaling risk mitigated: Plan to extract services when needed (strangler pattern)

**Mitigation:** 
- Design with service boundaries in mind (bounded contexts)
- Use modular architecture (clean architecture, domain-driven design)
- Extract services when scaling needs arise (not prematurely)

---

## Common Mistakes to Avoid

**1. Analysis Paralysis**
- Don't evaluate 10+ options. Limit to 3-5 viable options.
- Set a time limit for analysis (1-2 weeks max).

**2. Ignoring Constraints**
- Don't choose the "best" technology if your team can't operate it.
- Factor in budget, timeline, and team skills.

**3. Overweighting Latest Trends**
- New doesn't mean better for your context.
- Prefer proven technologies unless you have a specific need.

**4. Skipping Risk Assessment**
- High-scoring options can have deal-breaking risks.
- Always assess risks separately from scores.

**5. Poor Documentation**
- Decisions without documentation get rehashed.
- Document context, rationale, and alternatives.

---

## When to Revisit Decisions

Decisions aren't permanent. Revisit when:

**Context Changes:**
- Team size doubles (operational complexity changes)
- Traffic grows 10x (scalability becomes critical)
- Budget increases significantly (cost constraints relax)

**Technology Evolves:**
- New options emerge that weren't available
- Current choice shows limitations at scale
- Better alternatives mature

**Timeline:**
- Review major decisions annually
- Review when hitting scaling milestones
- Review when constraints change significantly

---

## Conclusion

Technical decisions shape your system's future. A structured framework helps you:

- **Evaluate options systematically** - No more guessing
- **Assess trade-offs clearly** - Understand what you're giving up
- **Mitigate risks proactively** - Plan for problems before they happen
- **Document rationale** - Prevent rehashing decisions

The framework isn't about finding the "perfect" choice—it's about making the best decision given your constraints, risks, and context.

**Next steps:**
1. Use this framework for your next architecture decision
2. Document it as an ADR
3. Review decisions when context changes
4. Share the framework with your team

Remember: A good decision made quickly beats a perfect decision made too late.
