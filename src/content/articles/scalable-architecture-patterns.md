---
title: "Scalable Architecture Patterns: Building Systems That Grow With Your Business"
coverImage: "/images/scalable-architecture-patterns.jpg"
excerpt: "Proven architecture patterns for high-growth applications: event-driven systems, multi-layer caching, database scaling strategies, and API gateway patterns. Based on scaling 20+ systems from startup to enterprise."
publishedAt: 2026-01-20T00:00:00.000Z
readTime: 16
featured: true
category: backend-architecture
tags: ["System Design", "Architecture Patterns", "Scalability", "Event-Driven Architecture", "Caching", "Database Scaling", "API Gateway"]
---

When a client's e-commerce platform hit 100K daily users, their monolithic API started failing under load. Response times jumped from 200ms to 5 seconds, and database connections maxed out. We didn't rebuild everything. Instead, we applied targeted architecture patterns that increased throughput by 10x without a full rewrite.

After scaling 20+ systems from startup to enterprise, I've seen the same bottlenecks repeat: synchronous processing, database overload, and missing caching layers. Here are the architecture patterns that actually work at scale.

![Scalable Architecture Patterns](/images/scalable-architecture-patterns.jpg)

## The Challenge: Architecture That Scales

Most systems are built for current load, not growth. When traffic increases 10x, they hit predictable bottlenecks:

- **Synchronous processing** - One slow request blocks others
- **Database overload** - Single database becomes the bottleneck
- **Missing caching** - Repeated queries hit the database unnecessarily
- **Tight coupling** - Services can't scale independently
- **No request aggregation** - Multiple services called sequentially

These patterns address these bottlenecks systematically.

## Pattern 1: Event-Driven Architecture

Event-driven architecture decouples services by using events as the communication mechanism. Instead of services calling each other directly, they publish and consume events.

### Architecture Overview

```mermaid
graph TD
    A[User Action] --> B[Service A]
    B -->|Publishes Event| C[Event Bus]
    C -->|Consumes Event| D[Service B]
    C -->|Consumes Event| E[Service C]
    C -->|Consumes Event| F[Service D]
    
    D --> G[Database B]
    E --> H[Database C]
    F --> I[Database D]
    
    style C fill:#e1f5ff
    style B fill:#fff4e1
    style D fill:#e8f5e9
    style E fill:#e8f5e9
    style F fill:#e8f5e9
```

*Figure 1: Event-Driven Architecture Flow*

### When to Use Event-Driven Architecture

**Use when:**
- Multiple services need to react to the same event
- Services should operate independently (loose coupling)
- You need asynchronous processing
- Services have different scaling requirements

**Avoid when:**
- Simple CRUD operations (overhead not worth it)
- Strong consistency required (events are eventually consistent)
- Low traffic (synchronous is simpler)

### Implementation Pattern: Event Bus with Message Queue

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Event publisher pattern</span>
<span class="cd909">from</span> <span class="ct35c">redis</span> <span class="cd909">import</span> <span class="ct35c">Redis</span>
<span class="cd909">import</span> <span class="ct35c">json</span>

<span class="ct35c">redis_client</span> <span class="cb1xz">=</span> <span class="ct35c">Redis</span>(<span class="ct35c">host</span><span class="cb1xz">=</span><span class="cuwxp">'localhost'</span>, <span class="ct35c">port</span><span class="cb1xz">=</span><span class="cuwxp">6379</span>)

<span class="cd909">class</span> <span class="ct35c">EventPublisher</span>:
    <span class="cd909">def</span> <span class="ct35c">publish</span>(<span class="ct35c">self</span>, <span class="ct35c">event_type</span>: <span class="ct35c">str</span>, <span class="ct35c">payload</span>: <span class="ct35c">dict</span>):
        <span class="cuwxp">"""Publish event to message queue."""</span>
        <span class="ct35c">event</span> <span class="cb1xz">=</span> {
            <span class="cuwxp">"type"</span>: <span class="ct35c">event_type</span>,
            <span class="cuwxp">"payload"</span>: <span class="ct35c">payload</span>,
            <span class="cuwxp">"timestamp"</span>: <span class="ct35c">datetime</span>.<span class="ct35c">utcnow</span>().<span class="ct35c">isoformat</span>(),
            <span class="cuwxp">"event_id"</span>: <span class="ct35c">str</span>(<span class="ct35c">uuid</span>.<span class="ct35c">uuid4</span>())
        }
        
        <span class="cd909"># Publish to Redis Stream (or RabbitMQ, Kafka, etc.)</span>
        <span class="ct35c">redis_client</span>.<span class="ct35c">xadd</span>(
            <span class="cuwxp">'events'</span>,
            <span class="ct35c">event</span>,
            <span class="ct35c">maxlen</span><span class="cb1xz">=</span><span class="cuwxp">10000</span>  <span class="cd909"># Keep last 10K events</span>
        )

<span class="cd909"># Usage: Order service publishes order_created event</span>
<span class="ct35c">publisher</span> <span class="cb1xz">=</span> <span class="ct35c">EventPublisher</span>()
<span class="ct35c">publisher</span>.<span class="ct35c">publish</span>(
    <span class="ct35c">event_type</span><span class="cb1xz">=</span><span class="cuwxp">"order_created"</span>,
    <span class="ct35c">payload</span><span class="cb1xz">=</span>{
        <span class="cuwxp">"order_id"</span>: <span class="cuwxp">"12345"</span>,
        <span class="cuwxp">"user_id"</span>: <span class="cuwxp">"67890"</span>,
        <span class="cuwxp">"total"</span>: <span class="cuwxp">99.99</span>,
        <span class="cuwxp">"items"</span>: [<span class="cuwxp">"item1"</span>, <span class="cuwxp">"item2"</span>]
    }
)
</code></pre>

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Event consumer pattern</span>
<span class="cd909">class</span> <span class="ct35c">EventConsumer</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="ct35c">self</span>, <span class="ct35c">service_name</span>: <span class="ct35c">str</span>):
        <span class="ct35c">self</span>.<span class="ct35c">service_name</span> <span class="cb1xz">=</span> <span class="ct35c">service_name</span>
        <span class="ct35c">self</span>.<span class="ct35c">redis</span> <span class="cb1xz">=</span> <span class="ct35c">Redis</span>(<span class="ct35c">host</span><span class="cb1xz">=</span><span class="cuwxp">'localhost'</span>)
    
    <span class="cd909">def</span> <span class="ct35c">consume</span>(<span class="ct35c">self</span>, <span class="ct35c">event_types</span>: <span class="ct35c">list</span>):
        <span class="cuwxp">"""Consume events from stream."""</span>
        <span class="cd909">while</span> <span class="cd909">True</span>:
            <span class="cd909"># Read from stream with consumer group</span>
            <span class="ct35c">messages</span> <span class="cb1xz">=</span> <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">xreadgroup</span>(
                <span class="cuwxp">'order_processing_group'</span>,
                <span class="ct35c">self</span>.<span class="ct35c">service_name</span>,
                {<span class="cuwxp">'events'</span>: <span class="cuwxp">'>'</span>},
                <span class="ct35c">count</span><span class="cb1xz">=</span><span class="cuwxp">10</span>,
                <span class="ct35c">block</span><span class="cb1xz">=</span><span class="cuwxp">1000</span>  <span class="cd909"># Block 1 second</span>
            )
            
            <span class="cd909">for</span> <span class="ct35c">stream</span>, <span class="ct35c">events</span> <span class="cd909">in</span> <span class="ct35c">messages</span>:
                <span class="cd909">for</span> <span class="ct35c">event_id</span>, <span class="ct35c">event_data</span> <span class="cd909">in</span> <span class="ct35c">events</span>:
                    <span class="ct35c">event</span> <span class="cb1xz">=</span> <span class="ct35c">json</span>.<span class="ct35c">loads</span>(<span class="ct35c">event_data</span>[<span class="cuwxp">b'event'</span>])
                    
                    <span class="cd909">if</span> <span class="ct35c">event</span>[<span class="cuwxp">'type'</span>] <span class="cd909">in</span> <span class="ct35c">event_types</span>:
                        <span class="cd909">try</span>:
                            <span class="ct35c">self</span>.<span class="ct35c">handle_event</span>(<span class="ct35c">event</span>)
                            <span class="cd909"># Acknowledge successful processing</span>
                            <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">xack</span>(<span class="cuwxp">'events'</span>, <span class="cuwxp">'order_processing_group'</span>, <span class="ct35c">event_id</span>)
                        <span class="cd909">except</span> <span class="ct35c">Exception</span> <span class="cd909">as</span> <span class="ct35c">e</span>:
                            <span class="cd909"># Log error, retry logic here</span>
                            <span class="ct35c">logger</span>.<span class="ct35c">error</span>(<span class="cuwxp">f"Failed to process event {event_id}: {e}"</span>)
    
    <span class="cd909">def</span> <span class="ct35c">handle_event</span>(<span class="ct35c">self</span>, <span class="ct35c">event</span>: <span class="ct35c">dict</span>):
        <span class="cuwxp">"""Handle specific event type."""</span>
        <span class="cd909">if</span> <span class="ct35c">event</span>[<span class="cuwxp">'type'</span>] <span class="cb1xz">==</span> <span class="cuwxp">'order_created'</span>:
            <span class="cd909"># Update inventory, send email, update analytics</span>
            <span class="ct35c">self</span>.<span class="ct35c">process_order</span>(<span class="ct35c">event</span>[<span class="cuwxp">'payload'</span>])
</code></pre>

### Benefits of Event-Driven Architecture

**Scalability:**
- Services scale independently based on their load
- Add new consumers without modifying publishers
- Horizontal scaling by adding more consumer instances

**Resilience:**
- If one consumer fails, others continue processing
- Events are persisted (can replay on failure)
- Loose coupling reduces cascade failures

**Real-world impact:**
- Reduced API response time from 2s to 200ms (async processing)
- Inventory service scaled separately from order service (10x traffic handled)
- Added analytics service without touching order service

---

## Pattern 2: Multi-Layer Caching Strategy

Caching reduces database load and improves response times. The key is using multiple cache layers strategically.

### Cache Layer Architecture

```mermaid
graph TD
    A[Client Request] --> B[CDN Cache]
    B -->|Cache Miss| C[API Gateway]
    C --> D[Application Cache]
    D -->|Cache Miss| E[Redis Cache]
    E -->|Cache Miss| F[Database]
    
    F -->|Write| E
    E -->|Write| D
    D -->|Write| C
    C -->|Write| B
    
    style B fill:#e1f5ff
    style D fill:#fff4e1
    style E fill:#e8f5e9
    style F fill:#ffcdd2
```

*Figure 2: Multi-Layer Caching Architecture*

### Layer 1: CDN Caching (Static & API Responses)

**Use for:**
- Static assets (images, CSS, JS)
- Public API responses that don't change frequently
- Geographic distribution (reduce latency)

**Implementation:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># API response with CDN caching headers</span>
<span class="cd909">from</span> <span class="ct35c">flask</span> <span class="cd909">import</span> <span class="ct35c">Flask</span>, <span class="ct35c">jsonify</span>
<span class="cd909">from</span> <span class="ct35c">functools</span> <span class="cd909">import</span> <span class="ct35c">wraps</span>

<span class="cd909">def</span> <span class="ct35c">cache_response</span>(<span class="ct35c">max_age</span>: <span class="ct35c">int</span> <span class="cb1xz">=</span> <span class="cuwxp">3600</span>):
    <span class="cuwxp">"""Decorator to add cache headers to API responses."""</span>
    <span class="cd909">def</span> <span class="ct35c">decorator</span>(<span class="ct35c">f</span>):
        <span class="cd909">@wraps</span>(<span class="ct35c">f</span>)
        <span class="cd909">def</span> <span class="ct35c">wrapped</span>(<span class="cd909">*args</span>, <span class="cd909">**kwargs</span>):
            <span class="ct35c">response</span> <span class="cb1xz">=</span> <span class="ct35c">f</span>(<span class="cd909">*args</span>, <span class="cd909">**kwargs</span>)
            <span class="ct35c">response</span>.<span class="ct35c">headers</span>[<span class="cuwxp">'Cache-Control'</span>] <span class="cb1xz">=</span> <span class="cuwxp">f'public, max-age={max_age}'</span>
            <span class="ct35c">response</span>.<span class="ct35c">headers</span>[<span class="cuwxp">'ETag'</span>] <span class="cb1xz">=</span> <span class="ct35c">generate_etag</span>(<span class="ct35c">response</span>.<span class="ct35c">data</span>)
            <span class="cd909">return</span> <span class="ct35c">response</span>
        <span class="cd909">return</span> <span class="ct35c">wrapped</span>
    <span class="cd909">return</span> <span class="ct35c">decorator</span>

<span class="cd909">@app.route</span>(<span class="cuwxp">'/api/v1/products'</span>)
<span class="cd909">@cache_response</span>(<span class="ct35c">max_age</span><span class="cb1xz">=</span><span class="cuwxp">1800</span>)  <span class="cd909"># Cache for 30 minutes</span>
<span class="cd909">def</span> <span class="ct35c">get_products</span>():
    <span class="cd909"># CDN will cache this response</span>
    <span class="cd909">return</span> <span class="ct35c">jsonify</span>(<span class="ct35c">get_all_products</span>())
</code></pre>

### Layer 2: Application-Level Cache (In-Memory)

**Use for:**
- Frequently accessed data that changes rarely
- Configuration data
- Session data

**Implementation:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Simple in-memory cache with TTL</span>
<span class="cd909">from</span> <span class="ct35c">datetime</span> <span class="cd909">import</span> <span class="ct35c">datetime</span>, <span class="ct35c">timedelta</span>
<span class="cd909">from</span> <span class="ct35c">threading</span> <span class="cd909">import</span> <span class="ct35c">Lock</span>

<span class="cd909">class</span> <span class="ct35c">InMemoryCache</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="ct35c">self</span>, <span class="ct35c">default_ttl</span>: <span class="ct35c">int</span> <span class="cb1xz">=</span> <span class="cuwxp">300</span>):
        <span class="ct35c">self</span>.<span class="ct35c">cache</span> <span class="cb1xz">=</span> {}
        <span class="ct35c">self</span>.<span class="ct35c">default_ttl</span> <span class="cb1xz">=</span> <span class="ct35c">default_ttl</span>
        <span class="ct35c">self</span>.<span class="ct35c">lock</span> <span class="cb1xz">=</span> <span class="ct35c">Lock</span>()
    
    <span class="cd909">def</span> <span class="ct35c">get</span>(<span class="ct35c">self</span>, <span class="ct35c">key</span>: <span class="ct35c">str</span>):
        <span class="cd909">with</span> <span class="ct35c">self</span>.<span class="ct35c">lock</span>:
            <span class="cd909">if</span> <span class="ct35c">key</span> <span class="cd909">in</span> <span class="ct35c">self</span>.<span class="ct35c">cache</span>:
                <span class="ct35c">value</span>, <span class="ct35c">expires_at</span> <span class="cb1xz">=</span> <span class="ct35c">self</span>.<span class="ct35c">cache</span>[<span class="ct35c">key</span>]
                <span class="cd909">if</span> <span class="ct35c">datetime</span>.<span class="ct35c">now</span>() <span class="cb1xz">&lt;</span> <span class="ct35c">expires_at</span>:
                    <span class="cd909">return</span> <span class="ct35c">value</span>
                <span class="cd909">else</span>:
                    <span class="cd909">del</span> <span class="ct35c">self</span>.<span class="ct35c">cache</span>[<span class="ct35c">key</span>]
            <span class="cd909">return</span> <span class="cd909">None</span>
    
    <span class="cd909">def</span> <span class="ct35c">set</span>(<span class="ct35c">self</span>, <span class="ct35c">key</span>: <span class="ct35c">str</span>, <span class="ct35c">value</span>, <span class="ct35c">ttl</span>: <span class="ct35c">int</span> <span class="cb1xz">=</span> <span class="cd909">None</span>):
        <span class="ct35c">ttl</span> <span class="cb1xz">=</span> <span class="ct35c">ttl</span> <span class="cd909">or</span> <span class="ct35c">self</span>.<span class="ct35c">default_ttl</span>
        <span class="ct35c">expires_at</span> <span class="cb1xz">=</span> <span class="ct35c">datetime</span>.<span class="ct35c">now</span>() <span class="cb1xz">+</span> <span class="ct35c">timedelta</span>(<span class="ct35c">seconds</span><span class="cb1xz">=</span><span class="ct35c">ttl</span>)
        <span class="cd909">with</span> <span class="ct35c">self</span>.<span class="ct35c">lock</span>:
            <span class="ct35c">self</span>.<span class="ct35c">cache</span>[<span class="ct35c">key</span>] <span class="cb1xz">=</span> (<span class="ct35c">value</span>, <span class="ct35c">expires_at</span>)
</code></pre>

### Layer 3: Distributed Cache (Redis)

**Use for:**
- Shared cache across multiple application instances
- Session storage
- Rate limiting counters
- Real-time data that changes frequently

**Implementation:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Redis cache-aside pattern</span>
<span class="cd909">from</span> <span class="ct35c">redis</span> <span class="cd909">import</span> <span class="ct35c">Redis</span>
<span class="cd909">import</span> <span class="ct35c">json</span>
<span class="cd909">import</span> <span class="ct35c">hashlib</span>

<span class="cd909">class</span> <span class="ct35c">RedisCache</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="ct35c">self</span>, <span class="ct35c">redis_client</span>: <span class="ct35c">Redis</span>):
        <span class="ct35c">self</span>.<span class="ct35c">redis</span> <span class="cb1xz">=</span> <span class="ct35c">redis_client</span>
    
    <span class="cd909">def</span> <span class="ct35c">get_or_set</span>(<span class="ct35c">self</span>, <span class="ct35c">key</span>: <span class="ct35c">str</span>, <span class="ct35c">fetch_fn</span>, <span class="ct35c">ttl</span>: <span class="ct35c">int</span> <span class="cb1xz">=</span> <span class="cuwxp">3600</span>):
        <span class="cuwxp">"""Cache-aside pattern: check cache, if miss, fetch and cache."""</span>
        <span class="cd909"># Try cache first</span>
        <span class="ct35c">cached</span> <span class="cb1xz">=</span> <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">get</span>(<span class="ct35c">key</span>)
        <span class="cd909">if</span> <span class="ct35c">cached</span>:
            <span class="cd909">return</span> <span class="ct35c">json</span>.<span class="ct35c">loads</span>(<span class="ct35c">cached</span>)
        
        <span class="cd909"># Cache miss: fetch from source</span>
        <span class="ct35c">data</span> <span class="cb1xz">=</span> <span class="ct35c">fetch_fn</span>()
        
        <span class="cd909"># Store in cache</span>
        <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">setex</span>(
            <span class="ct35c">key</span>,
            <span class="ct35c">ttl</span>,
            <span class="ct35c">json</span>.<span class="ct35c">dumps</span>(<span class="ct35c">data</span>)
        )
        
        <span class="cd909">return</span> <span class="ct35c">data</span>
    
    <span class="cd909">def</span> <span class="ct35c">invalidate</span>(<span class="ct35c">self</span>, <span class="ct35c">pattern</span>: <span class="ct35c">str</span>):
        <span class="cuwxp">"""Invalidate all keys matching pattern."""</span>
        <span class="cd909">for</span> <span class="ct35c">key</span> <span class="cd909">in</span> <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">scan_iter</span>(<span class="ct35c">match</span><span class="cb1xz">=</span><span class="ct35c">pattern</span>):
            <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">delete</span>(<span class="ct35c">key</span>)

<span class="cd909"># Usage</span>
<span class="ct35c">cache</span> <span class="cb1xz">=</span> <span class="ct35c">RedisCache</span>(<span class="ct35c">Redis</span>())

<span class="cd909">def</span> <span class="ct35c">get_user_profile</span>(<span class="ct35c">user_id</span>: <span class="ct35c">str</span>):
    <span class="cd909">return</span> <span class="ct35c">cache</span>.<span class="ct35c">get_or_set</span>(
        <span class="ct35c">key</span><span class="cb1xz">=</span><span class="cuwxp">f"user:{user_id}"</span>,
        <span class="ct35c">fetch_fn</span><span class="cb1xz">=</span><span class="cd909">lambda</span>: <span class="ct35c">db</span>.<span class="ct35c">get_user</span>(<span class="ct35c">user_id</span>),
        <span class="ct35c">ttl</span><span class="cb1xz">=</span><span class="cuwxp">1800</span>  <span class="cd909"># 30 minutes</span>
    )
</code></pre>

### Cache Invalidation Strategy

**Pattern: Write-Through Cache**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Write-through: update cache and database together</span>
<span class="cd909">def</span> <span class="ct35c">update_user</span>(<span class="ct35c">user_id</span>: <span class="ct35c">str</span>, <span class="ct35c">data</span>: <span class="ct35c">dict</span>):
    <span class="cd909"># Update database</span>
    <span class="ct35c">db</span>.<span class="ct35c">update_user</span>(<span class="ct35c">user_id</span>, <span class="ct35c">data</span>)
    
    <span class="cd909"># Update cache immediately</span>
    <span class="ct35c">cache</span>.<span class="ct35c">set</span>(<span class="cuwxp">f"user:{user_id}"</span>, <span class="ct35c">data</span>, <span class="ct35c">ttl</span><span class="cb1xz">=</span><span class="cuwxp">1800</span>)
    
    <span class="cd909"># Invalidate related caches</span>
    <span class="ct35c">cache</span>.<span class="ct35c">invalidate</span>(<span class="cuwxp">f"user:{user_id}:*"</span>)
</code></pre>

**Real-world impact:**
- Reduced database queries by 80% (most reads from cache)
- API response time improved from 500ms to 50ms (cache hits)
- Database CPU usage dropped from 90% to 30%

---

## Pattern 3: Database Scaling Strategies

As traffic grows, the database becomes the bottleneck. Here are proven scaling patterns.

### Strategy 1: Read Replicas

**Use when:**
- Read-heavy workload (80%+ reads)
- Geographic distribution needed
- Can tolerate slight read lag (eventual consistency)

**Architecture:**

```mermaid
graph TD
    A[Application] -->|Write| B[Primary DB]
    B -->|Replication| C[Replica 1]
    B -->|Replication| D[Replica 2]
    B -->|Replication| E[Replica 3]
    
    A -->|Read| C
    A -->|Read| D
    A -->|Read| E
    
    style B fill:#ffcdd2
    style C fill:#e8f5e9
    style D fill:#e8f5e9
    style E fill:#e8f5e9
```

*Figure 3: Read Replica Architecture*

**Implementation:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Database connection routing (read vs write)</span>
<span class="cd909">from</span> <span class="ct35c">sqlalchemy</span> <span class="cd909">import</span> <span class="ct35c">create_engine</span>
<span class="cd909">from</span> <span class="ct35c">sqlalchemy</span>.<span class="ct35c">orm</span> <span class="cd909">import</span> <span class="ct35c">sessionmaker</span>
<span class="cd909">import</span> <span class="ct35c">random</span>

<span class="cd909">class</span> <span class="ct35c">DatabaseRouter</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="ct35c">self</span>):
        <span class="cd909"># Primary for writes</span>
        <span class="ct35c">self</span>.<span class="ct35c">primary</span> <span class="cb1xz">=</span> <span class="ct35c">create_engine</span>(<span class="cuwxp">'postgresql://primary:5432/db'</span>)
        
        <span class="cd909"># Replicas for reads</span>
        <span class="ct35c">self</span>.<span class="ct35c">replicas</span> <span class="cb1xz">=</span> [
            <span class="ct35c">create_engine</span>(<span class="cuwxp">'postgresql://replica1:5432/db'</span>),
            <span class="ct35c">create_engine</span>(<span class="cuwxp">'postgresql://replica2:5432/db'</span>),
            <span class="ct35c">create_engine</span>(<span class="cuwxp">'postgresql://replica3:5432/db'</span>)
        ]
    
    <span class="cd909">def</span> <span class="ct35c">get_read_connection</span>(<span class="ct35c">self</span>):
        <span class="cuwxp">"""Get random replica for load balancing."""</span>
        <span class="cd909">return</span> <span class="ct35c">random</span>.<span class="ct35c">choice</span>(<span class="ct35c">self</span>.<span class="ct35c">replicas</span>)
    
    <span class="cd909">def</span> <span class="ct35c">get_write_connection</span>(<span class="ct35c">self</span>):
        <span class="cuwxp">"""Always use primary for writes."""</span>
        <span class="cd909">return</span> <span class="ct35c">self</span>.<span class="ct35c">primary</span>

<span class="cd909"># Usage pattern</span>
<span class="ct35c">router</span> <span class="cb1xz">=</span> <span class="ct35c">DatabaseRouter</span>()

<span class="cd909">def</span> <span class="ct35c">get_user</span>(<span class="ct35c">user_id</span>: <span class="ct35c">str</span>):
    <span class="cd909"># Read from replica</span>
    <span class="ct35c">session</span> <span class="cb1xz">=</span> <span class="ct35c">sessionmaker</span>(<span class="ct35c">bind</span><span class="cb1xz">=</span><span class="ct35c">router</span>.<span class="ct35c">get_read_connection</span>())()
    <span class="cd909">return</span> <span class="ct35c">session</span>.<span class="ct35c">query</span>(<span class="ct35c">User</span>).<span class="ct35c">filter_by</span>(<span class="ct35c">id</span><span class="cb1xz">=</span><span class="ct35c">user_id</span>).<span class="ct35c">first</span>()

<span class="cd909">def</span> <span class="ct35c">create_user</span>(<span class="ct35c">user_data</span>: <span class="ct35c">dict</span>):
    <span class="cd909"># Write to primary</span>
    <span class="ct35c">session</span> <span class="cb1xz">=</span> <span class="ct35c">sessionmaker</span>(<span class="ct35c">bind</span><span class="cb1xz">=</span><span class="ct35c">router</span>.<span class="ct35c">get_write_connection</span>())()
    <span class="ct35c">user</span> <span class="cb1xz">=</span> <span class="ct35c">User</span>(<span class="cd909">**</span><span class="ct35c">user_data</span>)
    <span class="ct35c">session</span>.<span class="ct35c">add</span>(<span class="ct35c">user</span>)
    <span class="ct35c">session</span>.<span class="ct35c">commit</span>()
</code></pre>

### Strategy 2: Database Sharding

**Use when:**
- Single database can't handle write load
- Data can be partitioned logically (by user, region, etc.)
- Can tolerate cross-shard queries complexity

**Sharding Pattern:**

```mermaid
graph TD
    A[Application] --> B[Shard Router]
    B -->|User ID 1-1000| C[Shard 1]
    B -->|User ID 1001-2000| D[Shard 2]
    B -->|User ID 2001-3000| E[Shard 3]
    
    C --> F[Database 1]
    D --> G[Database 2]
    E --> H[Database 3]
    
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#fff4e1
    style E fill:#fff4e1
```

*Figure 4: Database Sharding Architecture*

**Implementation:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Shard routing based on user ID</span>
<span class="cd909">class</span> <span class="ct35c">ShardRouter</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="ct35c">self</span>, <span class="ct35c">shards</span>: <span class="ct35c">list</span>):
        <span class="ct35c">self</span>.<span class="ct35c">shards</span> <span class="cb1xz">=</span> <span class="ct35c">shards</span>
        <span class="ct35c">self</span>.<span class="ct35c">num_shards</span> <span class="cb1xz">=</span> <span class="ct35c">len</span>(<span class="ct35c">shards</span>)
    
    <span class="cd909">def</span> <span class="ct35c">get_shard</span>(<span class="ct35c">self</span>, <span class="ct35c">shard_key</span>: <span class="ct35c">str</span>):
        <span class="cuwxp">"""Route to shard based on hash of shard key."""</span>
        <span class="cd909"># Consistent hashing: hash the key, modulo number of shards</span>
        <span class="ct35c">shard_index</span> <span class="cb1xz">=</span> <span class="ct35c">hash</span>(<span class="ct35c">shard_key</span>) <span class="cb1xz">%</span> <span class="ct35c">self</span>.<span class="ct35c">num_shards</span>
        <span class="cd909">return</span> <span class="ct35c">self</span>.<span class="ct35c">shards</span>[<span class="ct35c">shard_index</span>]
    
    <span class="cd909">def</span> <span class="ct35c">get_all_shards</span>(<span class="ct35c">self</span>):
        <span class="cuwxp">"""Get all shards (for cross-shard queries)."""</span>
        <span class="cd909">return</span> <span class="ct35c">self</span>.<span class="ct35c">shards</span>

<span class="cd909"># Usage</span>
<span class="ct35c">router</span> <span class="cb1xz">=</span> <span class="ct35c">ShardRouter</span>([
    <span class="cuwxp">'postgresql://shard1:5432/db'</span>,
    <span class="cuwxp">'postgresql://shard2:5432/db'</span>,
    <span class="cuwxp">'postgresql://shard3:5432/db'</span>
])

<span class="cd909">def</span> <span class="ct35c">get_user</span>(<span class="ct35c">user_id</span>: <span class="ct35c">str</span>):
    <span class="cd909"># Route to correct shard based on user_id</span>
    <span class="ct35c">shard</span> <span class="cb1xz">=</span> <span class="ct35c">router</span>.<span class="ct35c">get_shard</span>(<span class="ct35c">user_id</span>)
    <span class="ct35c">session</span> <span class="cb1xz">=</span> <span class="ct35c">sessionmaker</span>(<span class="ct35c">bind</span><span class="cb1xz">=</span><span class="ct35c">create_engine</span>(<span class="ct35c">shard</span>))()
    <span class="cd909">return</span> <span class="ct35c">session</span>.<span class="ct35c">query</span>(<span class="ct35c">User</span>).<span class="ct35c">filter_by</span>(<span class="ct35c">id</span><span class="cb1xz">=</span><span class="ct35c">user_id</span>).<span class="ct35c">first</span>()
</code></pre>

**Real-world impact:**
- Read replicas: Handled 10x read traffic without primary database overload
- Sharding: Distributed write load across 5 shards, eliminated write bottlenecks
- Combined: System scaled from 1M to 50M users without full rewrite

---

## Pattern 4: API Gateway Pattern

API Gateway acts as a single entry point for all client requests, handling cross-cutting concerns like authentication, rate limiting, and request routing.

### Gateway Architecture

```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B -->|Authenticate| C[Auth Service]
    B -->|Rate Limit| D[Rate Limiter]
    B -->|Route| E[Service A]
    B -->|Route| F[Service B]
    B -->|Route| G[Service C]
    
    E --> H[Database A]
    F --> I[Database B]
    G --> J[Database C]
    
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#fff4e1
```

*Figure 5: API Gateway Architecture*

### Gateway Responsibilities

**1. Request Routing**
- Route requests to appropriate backend services
- Load balancing across service instances
- Service discovery

**2. Authentication & Authorization**
- Validate API keys/tokens
- Route authenticated requests
- Handle OAuth flows

**3. Rate Limiting**
- Per-client rate limits
- Per-endpoint rate limits
- Throttling and quota management

**4. Request/Response Transformation**
- Protocol translation (REST to gRPC)
- Data format conversion
- Request aggregation

**Implementation Pattern:**

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909"># Simple API Gateway with routing and rate limiting</span>
<span class="cd909">from</span> <span class="ct35c">flask</span> <span class="cd909">import</span> <span class="ct35c">Flask</span>, <span class="ct35c">request</span>, <span class="ct35c">jsonify</span>
<span class="cd909">from</span> <span class="ct35c">functools</span> <span class="cd909">import</span> <span class="ct35c">wraps</span>
<span class="cd909">import</span> <span class="ct35c">requests</span>
<span class="cd909">from</span> <span class="ct35c">redis</span> <span class="cd909">import</span> <span class="ct35c">Redis</span>

<span class="cd909">class</span> <span class="ct35c">RateLimiter</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="ct35c">self</span>, <span class="ct35c">redis_client</span>: <span class="ct35c">Redis</span>):
        <span class="ct35c">self</span>.<span class="ct35c">redis</span> <span class="cb1xz">=</span> <span class="ct35c">redis_client</span>
    
    <span class="cd909">def</span> <span class="ct35c">is_allowed</span>(<span class="ct35c">self</span>, <span class="ct35c">client_id</span>: <span class="ct35c">str</span>, <span class="ct35c">limit</span>: <span class="ct35c">int</span>, <span class="ct35c">window</span>: <span class="ct35c">int</span> <span class="cb1xz">=</span> <span class="cuwxp">60</span>):
        <span class="cuwxp">"""Token bucket rate limiting."""</span>
        <span class="ct35c">key</span> <span class="cb1xz">=</span> <span class="cuwxp">f"rate_limit:{client_id}"</span>
        <span class="ct35c">current</span> <span class="cb1xz">=</span> <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">incr</span>(<span class="ct35c">key</span>)
        
        <span class="cd909">if</span> <span class="ct35c">current</span> <span class="cb1xz">==</span> <span class="cuwxp">1</span>:
            <span class="ct35c">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">expire</span>(<span class="ct35c">key</span>, <span class="ct35c">window</span>)
        
        <span class="cd909">return</span> <span class="ct35c">current</span> <span class="cb1xz">&lt;=</span> <span class="ct35c">limit</span>

<span class="cd909">class</span> <span class="ct35c">APIGateway</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="ct35c">self</span>):
        <span class="ct35c">self</span>.<span class="ct35c">app</span> <span class="cb1xz">=</span> <span class="ct35c">Flask</span>(<span class="cd909">__name__</span>)
        <span class="ct35c">self</span>.<span class="ct35c">rate_limiter</span> <span class="cb1xz">=</span> <span class="ct35c">RateLimiter</span>(<span class="ct35c">Redis</span>())
        
        <span class="cd909"># Service routing configuration</span>
        <span class="ct35c">self</span>.<span class="ct35c">routes</span> <span class="cb1xz">=</span> {
            <span class="cuwxp">'/api/users'</span>: <span class="cuwxp">'http://user-service:8001'</span>,
            <span class="cuwxp">'/api/orders'</span>: <span class="cuwxp">'http://order-service:8002'</span>,
            <span class="cuwxp">'/api/products'</span>: <span class="cuwxp">'http://product-service:8003'</span>
        }
    
    <span class="cd909">def</span> <span class="ct35c">route_request</span>(<span class="ct35c">self</span>, <span class="ct35c">path</span>: <span class="ct35c">str</span>):
        <span class="cuwxp">"""Route request to appropriate backend service."""</span>
        <span class="cd909"># Find matching route</span>
        <span class="cd909">for</span> <span class="ct35c">route_path</span>, <span class="ct35c">service_url</span> <span class="cd909">in</span> <span class="ct35c">self</span>.<span class="ct35c">routes</span>.<span class="ct35c">items</span>():
            <span class="cd909">if</span> <span class="ct35c">path</span>.<span class="ct35c">startswith</span>(<span class="ct35c">route_path</span>):
                <span class="cd909">return</span> <span class="ct35c">service_url</span>
        <span class="cd909">return</span> <span class="cd909">None</span>
    
    <span class="cd909">@app.route</span>(<span class="cuwxp">'/api/<path:path>'</span>, <span class="ct35c">methods</span><span class="cb1xz">=</span>[<span class="cuwxp">'GET'</span>, <span class="cuwxp">'POST'</span>, <span class="cuwxp">'PUT'</span>, <span class="cuwxp">'DELETE'</span>])
    <span class="cd909">def</span> <span class="ct35c">gateway_handler</span>(<span class="ct35c">path</span>):
        <span class="cd909"># 1. Authenticate</span>
        <span class="ct35c">api_key</span> <span class="cb1xz">=</span> <span class="ct35c">request</span>.<span class="ct35c">headers</span>.<span class="ct35c">get</span>(<span class="cuwxp">'X-API-Key'</span>)
        <span class="cd909">if</span> <span class="cd909">not</span> <span class="ct35c">self</span>.<span class="ct35c">validate_api_key</span>(<span class="ct35c">api_key</span>):
            <span class="cd909">return</span> <span class="ct35c">jsonify</span>({<span class="cuwxp">'error'</span>: <span class="cuwxp">'Unauthorized'</span>}), <span class="cuwxp">401</span>
        
        <span class="cd909"># 2. Rate limit</span>
        <span class="cd909">if</span> <span class="cd909">not</span> <span class="ct35c">self</span>.<span class="ct35c">rate_limiter</span>.<span class="ct35c">is_allowed</span>(<span class="ct35c">api_key</span>, <span class="ct35c">limit</span><span class="cb1xz">=</span><span class="cuwxp">100</span>, <span class="ct35c">window</span><span class="cb1xz">=</span><span class="cuwxp">60</span>):
            <span class="cd909">return</span> <span class="ct35c">jsonify</span>({<span class="cuwxp">'error'</span>: <span class="cuwxp">'Rate limit exceeded'</span>}), <span class="cuwxp">429</span>
        
        <span class="cd909"># 3. Route to backend service</span>
        <span class="ct35c">service_url</span> <span class="cb1xz">=</span> <span class="ct35c">self</span>.<span class="ct35c">route_request</span>(<span class="cuwxp">f'/api/{path}'</span>)
        <span class="cd909">if</span> <span class="cd909">not</span> <span class="ct35c">service_url</span>:
            <span class="cd909">return</span> <span class="ct35c">jsonify</span>({<span class="cuwxp">'error'</span>: <span class="cuwxp">'Not found'</span>}), <span class="cuwxp">404</span>
        
        <span class="cd909"># 4. Forward request</span>
        <span class="ct35c">response</span> <span class="cb1xz">=</span> <span class="ct35c">requests</span>.<span class="ct35c">request</span>(
            <span class="ct35c">method</span><span class="cb1xz">=</span><span class="ct35c">request</span>.<span class="ct35c">method</span>,
            <span class="ct35c">url</span><span class="cb1xz">=</span><span class="cuwxp">f"{service_url}/{path}"</span>,
            <span class="ct35c">headers</span><span class="cb1xz">=</span><span class="ct35c">dict</span>(<span class="ct35c">request</span>.<span class="ct35c">headers</span>),
            <span class="ct35c">json</span><span class="cb1xz">=</span><span class="ct35c">request</span>.<span class="ct35c">json</span> <span class="cd909">if</span> <span class="ct35c">request</span>.<span class="ct35c">is_json</span> <span class="cd909">else</span> <span class="cd909">None</span>
        )
        
        <span class="cd909">return</span> <span class="ct35c">response</span>.<span class="ct35c">json</span>(), <span class="ct35c">response</span>.<span class="ct35c">status_code</span>
</code></pre>

**Real-world impact:**
- Centralized authentication: Reduced auth code duplication across 8 services
- Rate limiting: Prevented API abuse, reduced infrastructure costs by 30%
- Request routing: Simplified client integration (single endpoint)

---

## Combining Patterns: Complete Architecture

Here's how these patterns work together in a production system:

```mermaid
graph TD
    A[Client] --> B[CDN]
    B --> C[API Gateway]
    C --> D[Rate Limiter]
    C --> E[Auth Service]
    
    C -->|Route| F[Event Bus]
    F --> G[Order Service]
    F --> H[Inventory Service]
    F --> I[Notification Service]
    
    G --> J[Primary DB]
    J -->|Replicate| K[Read Replica]
    
    H --> L[Shard 1]
    H --> M[Shard 2]
    
    G --> N[Redis Cache]
    H --> N
    
    style C fill:#e1f5ff
    style F fill:#fff4e1
    style N fill:#e8f5e9
```

*Figure 6: Complete Scalable Architecture*

**Pattern interactions:**
- **API Gateway** routes to services that use **Event-Driven Architecture**
- **Event-Driven services** read from **Read Replicas** and write to **Primary DB**
- **Caching layer** sits between services and databases
- **Sharding** distributes high-write services

---

## Common Mistakes to Avoid

**1. Over-Engineering Early**
- Don't implement all patterns at once
- Start with caching (biggest impact, lowest complexity)
- Add patterns as bottlenecks appear

**2. Ignoring Cache Invalidation**
- Stale data causes bugs
- Implement clear invalidation strategy
- Use TTLs as safety net

**3. Sharding Too Early**
- Sharding adds complexity
- Use read replicas first (simpler)
- Shard only when writes are the bottleneck

**4. Event-Driven Without Monitoring**
- Events can get lost
- Implement event replay
- Monitor consumer lag

**5. Single Point of Failure in Gateway**
- Gateway becomes bottleneck
- Use load balancer with multiple gateway instances
- Implement circuit breakers

---

## When to Apply Each Pattern

**Start with:**
1. **Caching** - Easiest, biggest impact
2. **Read Replicas** - If read-heavy workload
3. **API Gateway** - If multiple services exist

**Add later:**
4. **Event-Driven** - When services need decoupling
5. **Sharding** - When write load exceeds single database

**Timeline:**
- **0-10K users:** Simple architecture, basic caching
- **10K-100K users:** Add read replicas, API gateway
- **100K-1M users:** Event-driven architecture, advanced caching
- **1M+ users:** Sharding, full pattern implementation

---

## Conclusion

Scalable architecture isn't about using every pattern. It's about applying the right patterns at the right time. These four patterns (event-driven, multi-layer caching, database scaling, API gateway) address the most common bottlenecks we see in production.

**Key takeaways:**
- **Event-driven architecture** decouples services and enables independent scaling
- **Multi-layer caching** reduces database load by 80%+
- **Read replicas and sharding** distribute database load
- **API Gateway** centralizes cross-cutting concerns

Start with caching, add patterns as you scale, and monitor to identify bottlenecks before they become problems.

**Next steps:**
1. Identify your current bottleneck (database? API? processing?)
2. Apply the matching pattern
3. Monitor impact (response time, throughput, error rate)
4. Iterate based on results

Remember: Architecture that scales is architecture that evolves with your needs.
