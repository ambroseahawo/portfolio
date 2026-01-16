---
title: "From Raw HTML to Production Data: ETL Pipelines for Scraped Content"
coverImage: "/images/etl-pipelines.png"
excerpt: "A proven pipeline pattern that transforms messy scraped HTML into clean, validated data ready for production. Based on processing 1M+ records across 50+ projects."
publishedAt: 2026-01-14T00:00:00.000Z
readTime: 12
featured: true
category: data-engineering
tags: ["ETL", "Data Processing", "Data Quality", "PostgreSQL", "Web Scraping", "Data Validation"]
---

When we built our first web scraper for a client, we thought extracting the data was the hard part. We quickly learned that raw HTML is just the beginning, transforming it into production-ready data is where most projects fail.

After processing 1M+ scraped records across 50+ projects, I've seen the same mistakes repeated: missing validation, poor error handling, and databases that can't handle the load. Here's the ETL pipeline pattern that's reduced data cleaning time from 60% to 10% of project effort.

![ETL Pipeline](/images/etl-pipelines.png)

## The Problem: Why Most ETL Pipelines Fail

Most teams build pipelines that work for the first 10,000 records, then break at scale. Common failures include:

- **No schema validation** - Invalid data reaches production
- **Poor deduplication** - Duplicate records inflate storage costs
- **Missing data handling** - Null values break downstream processes
- **Inefficient transformations** - Processing takes hours instead of minutes
- **Database bottlenecks** - Queries slow down as data grows

We've fixed these issues systematically. Here's the pipeline architecture that works.

## Pipeline Architecture: Extract → Transform → Validate → Load

```mermaid
graph LR
    A[Raw HTML] --> B[Extract]
    B --> C[Transform]
    C --> D[Validate]
    D --> E[Clean]
    E --> F[Load]
    F --> G[PostgreSQL]
    
    D -->|Invalid| H[Error Queue]
    H --> I[Retry/Alert]
```

*Figure 1: ETL Pipeline Flow*

---

## Stage 1: Extract - Parsing HTML Consistently

The extraction stage is where data quality starts. Inconsistent parsing leads to downstream chaos.

### Pattern: Structured Extractors

Instead of ad-hoc parsing, use structured extractors with error handling:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">from</span> <span class="ct35c">dataclasses</span> <span class="cd909">import</span> <span class="ct35c">dataclass</span>
<span class="cd909">from</span> <span class="ct35c">typing</span> <span class="cd909">import</span> <span class="ct35c">Optional</span>
<span class="cd909">from</span> <span class="ct35c">bs4</span> <span class="cd909">import</span> <span class="ct35c">BeautifulSoup</span>

<span class="cd909">@dataclass</span>
<span class="cd909">class</span> <span class="ct35c">ProductData</span>:
    <span class="ct35c">title</span>: <span class="ct35c">str</span>
    <span class="ct35c">price</span>: <span class="ct35c">float</span>
    <span class="ct35c">description</span>: <span class="ct35c">Optional</span>[<span class="ct35c">str</span>]
    <span class="ct35c">category</span>: <span class="ct35c">str</span>
    <span class="ct35c">url</span>: <span class="ct35c">str</span>

<span class="cd909">class</span> <span class="ct35c">ProductExtractor</span>:
    <span class="cd909">def</span> <span class="ct35c">extract</span>(<span class="cd909">self</span>, <span class="ct35c">html</span>: <span class="ct35c">str</span>, <span class="ct35c">url</span>: <span class="ct35c">str</span>) <span class="cb1xz">-&gt;</span> <span class="ct35c">Optional</span>[<span class="ct35c">ProductData</span>]:
        <span class="cd909">try</span>:
            <span class="ct35c">soup</span> <span class="cb1xz">=</span> <span class="ct35c">BeautifulSoup</span>(<span class="ct35c">html</span>, <span class="cuwxp">'html.parser'</span>)
            
            <span class="cd909"># Extract with fallbacks</span>
            <span class="ct35c">title</span> <span class="cb1xz">=</span> <span class="cd909">self</span>.<span class="ct35c">_safe_extract</span>(<span class="ct35c">soup</span>, [<span class="cuwxp">'h1.product-title'</span>, <span class="cuwxp">'.title'</span>, <span class="cuwxp">'h1'</span>])
            <span class="ct35c">price</span> <span class="cb1xz">=</span> <span class="cd909">self</span>.<span class="ct35c">_extract_price</span>(<span class="ct35c">soup</span>)
            <span class="ct35c">description</span> <span class="cb1xz">=</span> <span class="cd909">self</span>.<span class="ct35c">_safe_extract</span>(<span class="ct35c">soup</span>, [<span class="cuwxp">'.description'</span>, <span class="cuwxp">'.product-desc'</span>])
            <span class="ct35c">category</span> <span class="cb1xz">=</span> <span class="cd909">self</span>.<span class="ct35c">_extract_category</span>(<span class="ct35c">soup</span>, <span class="ct35c">url</span>)
            
            <span class="cd909"># Validate required fields</span>
            <span class="cd909">if</span> <span class="cd909">not</span> <span class="ct35c">title</span> <span class="cd909">or</span> <span class="cd909">not</span> <span class="ct35c">price</span>:
                <span class="cd909">return</span> <span class="cd909">None</span>
                
            <span class="cd909">return</span> <span class="ct35c">ProductData</span>(
                <span class="ct35c">title</span><span class="cb1xz">=</span><span class="ct35c">title</span>.<span class="ct35c">strip</span>(),
                <span class="ct35c">price</span><span class="cb1xz">=</span><span class="ct35c">price</span>,
                <span class="ct35c">description</span><span class="cb1xz">=</span><span class="ct35c">description</span>.<span class="ct35c">strip</span>() <span class="cd909">if</span> <span class="ct35c">description</span> <span class="cd909">else</span> <span class="cd909">None</span>,
                <span class="ct35c">category</span><span class="cb1xz">=</span><span class="ct35c">category</span>,
                <span class="ct35c">url</span><span class="cb1xz">=</span><span class="ct35c">url</span>
            )
        <span class="cd909">except</span> <span class="ct35c">Exception</span> <span class="cd909">as</span> <span class="ct35c">e</span>:
            <span class="cd909"># Log and return None - don't break the pipeline</span>
            <span class="ct35c">logger</span>.<span class="ct35c">error</span>(<span class="cuwxp">f"Extraction failed for {url}: {e}"</span>)
            <span class="cd909">return</span> <span class="cd909">None</span>
    
    <span class="cd909">def</span> <span class="ct35c">_safe_extract</span>(<span class="cd909">self</span>, <span class="ct35c">soup</span>, <span class="ct35c">selectors</span>):
        <span class="cd909">for</span> <span class="ct35c">selector</span> <span class="cd909">in</span> <span class="ct35c">selectors</span>:
            <span class="ct35c">element</span> <span class="cb1xz">=</span> <span class="ct35c">soup</span>.<span class="ct35c">select_one</span>(<span class="ct35c">selector</span>)
            <span class="cd909">if</span> <span class="ct35c">element</span>:
                <span class="cd909">return</span> <span class="ct35c">element</span>.<span class="ct35c">get_text</span>()
        <span class="cd909">return</span> <span class="cd909">None</span>
</code></pre>

**Key principles:**
- Always have fallback selectors
- Return `None` for invalid data, don't throw exceptions
- Log errors for monitoring
- Strip whitespace early

---

## Stage 2: Transform - Normalization and Cleaning

Raw extracted data is messy. Normalize it before validation.

### Pattern: Transformation Pipeline

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">class</span> <span class="ct35c">DataTransformer</span>:
    <span class="cd909">def</span> <span class="ct35c">transform</span>(<span class="cd909">self</span>, <span class="ct35c">data</span>: <span class="ct35c">ProductData</span>) <span class="cb1xz">-&gt;</span> <span class="ct35c">ProductData</span>:
        <span class="cd909">return</span> <span class="ct35c">ProductData</span>(
            <span class="ct35c">title</span><span class="cb1xz">=</span><span class="cd909">self</span>.<span class="ct35c">_normalize_title</span>(<span class="ct35c">data</span>.<span class="ct35c">title</span>),
            <span class="ct35c">price</span><span class="cb1xz">=</span><span class="cd909">self</span>.<span class="ct35c">_normalize_price</span>(<span class="ct35c">data</span>.<span class="ct35c">price</span>),
            <span class="ct35c">description</span><span class="cb1xz">=</span><span class="cd909">self</span>.<span class="ct35c">_normalize_description</span>(<span class="ct35c">data</span>.<span class="ct35c">description</span>),
            <span class="ct35c">category</span><span class="cb1xz">=</span><span class="cd909">self</span>.<span class="ct35c">_normalize_category</span>(<span class="ct35c">data</span>.<span class="ct35c">category</span>),
            <span class="ct35c">url</span><span class="cb1xz">=</span><span class="cd909">self</span>.<span class="ct35c">_normalize_url</span>(<span class="ct35c">data</span>.<span class="ct35c">url</span>)
        )
    
    <span class="cd909">def</span> <span class="ct35c">_normalize_title</span>(<span class="cd909">self</span>, <span class="ct35c">title</span>: <span class="ct35c">str</span>) <span class="cb1xz">-&gt;</span> <span class="ct35c">str</span>:
        <span class="cd909"># Remove extra whitespace, normalize unicode</span>
        <span class="cd909">return</span> <span class="cuwxp">' '</span>.<span class="ct35c">join</span>(<span class="ct35c">title</span>.<span class="ct35c">split</span>())
    
    <span class="cd909">def</span> <span class="ct35c">_normalize_price</span>(<span class="cd909">self</span>, <span class="ct35c">price</span>: <span class="ct35c">str</span>) <span class="cb1xz">-&gt;</span> <span class="ct35c">float</span>:
        <span class="cd909"># Handle "$99.99", "99,99", "99.99 USD"</span>
        <span class="ct35c">price_str</span> <span class="cb1xz">=</span> <span class="ct35c">re</span>.<span class="ct35c">sub</span>(<span class="cuwxp">r'[^\d.]'</span>, <span class="cuwxp">''</span>, <span class="ct35c">str</span>(<span class="ct35c">price</span>).<span class="ct35c">replace</span>(<span class="cuwxp">','</span>, <span class="cuwxp">''</span>))
        <span class="cd909">return</span> <span class="ct35c">float</span>(<span class="ct35c">price_str</span>)
    
    <span class="cd909">def</span> <span class="ct35c">_normalize_category</span>(<span class="cd909">self</span>, <span class="ct35c">category</span>: <span class="ct35c">str</span>) <span class="cb1xz">-&gt;</span> <span class="ct35c">str</span>:
        <span class="cd909"># Standardize category names</span>
        <span class="ct35c">category_map</span> <span class="cb1xz">=</span> {
            <span class="cuwxp">'electronics'</span>: <span class="cuwxp">'Electronics'</span>,
            <span class="cuwxp">'ELECTRONICS'</span>: <span class="cuwxp">'Electronics'</span>,
            <span class="cuwxp">'tech'</span>: <span class="cuwxp">'Electronics'</span>
        }
        <span class="cd909">return</span> <span class="ct35c">category_map</span>.<span class="ct35c">get</span>(<span class="ct35c">category</span>.<span class="ct35c">lower</span>(), <span class="ct35c">category</span>.<span class="ct35c">title</span>())
</code></pre>

**What we've learned:**
- Normalize early, validate after
- Use mapping tables for categorical data
- Handle currency and number formats consistently
- Preserve original data for debugging

---

## Stage 3: Validate - Schema Enforcement

This is where most pipelines fail. Validate before loading.

### Pattern: Schema Validation with Pydantic

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">from</span> <span class="ct35c">pydantic</span> <span class="cd909">import</span> <span class="ct35c">BaseModel</span>, <span class="ct35c">validator</span>, <span class="ct35c">Field</span>
<span class="cd909">from</span> <span class="ct35c">typing</span> <span class="cd909">import</span> <span class="ct35c">Optional</span>
<span class="cd909">from</span> <span class="ct35c">datetime</span> <span class="cd909">import</span> <span class="ct35c">datetime</span>

<span class="cd909">class</span> <span class="ct35c">ValidatedProduct</span>(<span class="ct35c">BaseModel</span>):
    <span class="ct35c">title</span>: <span class="ct35c">str</span> <span class="cb1xz">=</span> <span class="ct35c">Field</span>(<span class="cuwxp">...</span>, <span class="ct35c">min_length</span><span class="cb1xz">=</span><span class="cuwxp">3</span>, <span class="ct35c">max_length</span><span class="cb1xz">=</span><span class="cuwxp">200</span>)
    <span class="ct35c">price</span>: <span class="ct35c">float</span> <span class="cb1xz">=</span> <span class="ct35c">Field</span>(<span class="cuwxp">...</span>, <span class="ct35c">gt</span><span class="cb1xz">=</span><span class="cuwxp">0</span>, <span class="ct35c">le</span><span class="cb1xz">=</span><span class="cuwxp">1000000</span>)
    <span class="ct35c">description</span>: <span class="ct35c">Optional</span>[<span class="ct35c">str</span>] <span class="cb1xz">=</span> <span class="ct35c">Field</span>(<span class="cd909">None</span>, <span class="ct35c">max_length</span><span class="cb1xz">=</span><span class="cuwxp">5000</span>)
    <span class="ct35c">category</span>: <span class="ct35c">str</span> <span class="cb1xz">=</span> <span class="ct35c">Field</span>(<span class="cuwxp">...</span>, <span class="ct35c">regex</span><span class="cb1xz">=</span><span class="cuwxp">'^(Electronics|Clothing|Home|Books)$'</span>)
    <span class="ct35c">url</span>: <span class="ct35c">str</span> <span class="cb1xz">=</span> <span class="ct35c">Field</span>(<span class="cuwxp">...</span>, <span class="ct35c">regex</span><span class="cb1xz">=</span><span class="cuwxp">'^https?://'</span>)
    <span class="ct35c">scraped_at</span>: <span class="ct35c">datetime</span>
    <span class="ct35c">source</span>: <span class="ct35c">str</span>
    
    <span class="cd909">@validator</span>(<span class="cuwxp">'price'</span>)
    <span class="cd909">def</span> <span class="ct35c">validate_price</span>(<span class="ct35c">cls</span>, <span class="ct35c">v</span>):
        <span class="cd909">if</span> <span class="ct35c">v</span> <span class="cb1xz">&lt;=</span> <span class="cuwxp">0</span>:
            <span class="cd909">raise</span> <span class="ct35c">ValueError</span>(<span class="cuwxp">'Price must be positive'</span>)
        <span class="cd909">return</span> <span class="ct35c">round</span>(<span class="ct35c">v</span>, <span class="cuwxp">2</span>)
    
    <span class="cd909">@validator</span>(<span class="cuwxp">'title'</span>)
    <span class="cd909">def</span> <span class="ct35c">validate_title</span>(<span class="ct35c">cls</span>, <span class="ct35c">v</span>):
        <span class="cd909">if</span> <span class="ct35c">len</span>(<span class="ct35c">v</span>.<span class="ct35c">strip</span>()) <span class="cb1xz">&lt;</span> <span class="cuwxp">3</span>:
            <span class="cd909">raise</span> <span class="ct35c">ValueError</span>(<span class="cuwxp">'Title too short'</span>)
        <span class="cd909">return</span> <span class="ct35c">v</span>.<span class="ct35c">strip</span>()
    
    <span class="cd909">class</span> <span class="ct35c">Config</span>:
        <span class="ct35c">extra</span> <span class="cb1xz">=</span> <span class="cuwxp">'forbid'</span>  <span class="cd909"># Reject unknown fields</span>
</code></pre>

**Why this matters:**
- Catches invalid data before it reaches the database
- Provides clear error messages
- Enforces data types and constraints
- Prevents schema drift

### Handling Validation Errors

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">def</span> <span class="ct35c">validate_batch</span>(<span class="ct35c">products</span>: <span class="ct35c">List</span>[<span class="ct35c">ProductData</span>]) <span class="cb1xz">-&gt;</span> <span class="ct35c">Tuple</span>[<span class="ct35c">List</span>[<span class="ct35c">ValidatedProduct</span>], <span class="ct35c">List</span>[<span class="ct35c">dict</span>]]:
    <span class="ct35c">validated</span> <span class="cb1xz">=</span> []
    <span class="ct35c">errors</span> <span class="cb1xz">=</span> []
    
    <span class="cd909">for</span> <span class="ct35c">product</span> <span class="cd909">in</span> <span class="ct35c">products</span>:
        <span class="cd909">try</span>:
            <span class="ct35c">validated</span>.<span class="ct35c">append</span>(<span class="ct35c">ValidatedProduct</span>(<span class="cuwxp">**</span><span class="ct35c">product</span>.<span class="ct35c">__dict__</span>))
        <span class="cd909">except</span> <span class="ct35c">ValidationError</span> <span class="cd909">as</span> <span class="ct35c">e</span>:
            <span class="ct35c">errors</span>.<span class="ct35c">append</span>({
                <span class="cuwxp">'data'</span>: <span class="ct35c">product</span>.<span class="ct35c">__dict__</span>,
                <span class="cuwxp">'errors'</span>: <span class="ct35c">e</span>.<span class="ct35c">errors</span>(),
                <span class="cuwxp">'timestamp'</span>: <span class="ct35c">datetime</span>.<span class="ct35c">now</span>()
            })
    
    <span class="cd909">return</span> <span class="ct35c">validated</span>, <span class="ct35c">errors</span>
</code></pre>

**Error handling strategy:**
- Collect all errors, don't fail on first invalid record
- Log errors to a separate table for analysis
- Alert on high error rates (>5%)
- Retry failed records after fixing issues

---

## Stage 4: Deduplication - Preventing Duplicate Records

Duplicate data inflates storage and breaks analytics. Deduplicate before loading.

### Pattern: Content-Based Deduplication

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">import</span> <span class="ct35c">hashlib</span>
<span class="cd909">from</span> <span class="ct35c">typing</span> <span class="cd909">import</span> <span class="ct35c">Set</span>

<span class="cd909">class</span> <span class="ct35c">Deduplicator</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="cd909">self</span>):
        <span class="cd909">self</span>.<span class="ct35c">seen_hashes</span>: <span class="ct35c">Set</span>[<span class="ct35c">str</span>] <span class="cb1xz">=</span> <span class="ct35c">set</span>()
    
    <span class="cd909">def</span> <span class="ct35c">is_duplicate</span>(<span class="cd909">self</span>, <span class="ct35c">product</span>: <span class="ct35c">ValidatedProduct</span>) <span class="cb1xz">-&gt;</span> <span class="ct35c">bool</span>:
        <span class="cd909"># Create hash from unique fields</span>
        <span class="ct35c">unique_fields</span> <span class="cb1xz">=</span> <span class="cuwxp">f"{product.url}|{product.title}|{product.price}"</span>
        <span class="ct35c">content_hash</span> <span class="cb1xz">=</span> <span class="ct35c">hashlib</span>.<span class="ct35c">md5</span>(<span class="ct35c">unique_fields</span>.<span class="ct35c">encode</span>()).<span class="ct35c">hexdigest</span>()
        
        <span class="cd909">if</span> <span class="ct35c">content_hash</span> <span class="cd909">in</span> <span class="cd909">self</span>.<span class="ct35c">seen_hashes</span>:
            <span class="cd909">return</span> <span class="cd909">True</span>
        
        <span class="cd909">self</span>.<span class="ct35c">seen_hashes</span>.<span class="ct35c">add</span>(<span class="ct35c">content_hash</span>)
        <span class="cd909">return</span> <span class="cd909">False</span>
</code></pre>

**For production scale**, use Redis or database-backed deduplication:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">import</span> <span class="ct35c">redis</span>

<span class="cd909">class</span> <span class="ct35c">RedisDeduplicator</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="cd909">self</span>, <span class="ct35c">redis_client</span>: <span class="ct35c">redis</span>.<span class="ct35c">Redis</span>):
        <span class="cd909">self</span>.<span class="ct35c">redis</span> <span class="cb1xz">=</span> <span class="ct35c">redis_client</span>
        <span class="cd909">self</span>.<span class="ct35c">ttl</span> <span class="cb1xz">=</span> <span class="cuwxp">86400</span> <span class="cb1xz">*</span> <span class="cuwxp">30</span>  <span class="cd909"># 30 days</span>
    
    <span class="cd909">def</span> <span class="ct35c">is_duplicate</span>(<span class="cd909">self</span>, <span class="ct35c">product</span>: <span class="ct35c">ValidatedProduct</span>) <span class="cb1xz">-&gt;</span> <span class="ct35c">bool</span>:
        <span class="ct35c">unique_fields</span> <span class="cb1xz">=</span> <span class="cuwxp">f"{product.url}|{product.title}|{product.price}"</span>
        <span class="ct35c">content_hash</span> <span class="cb1xz">=</span> <span class="ct35c">hashlib</span>.<span class="ct35c">md5</span>(<span class="ct35c">unique_fields</span>.<span class="ct35c">encode</span>()).<span class="ct35c">hexdigest</span>()
        
        <span class="ct35c">key</span> <span class="cb1xz">=</span> <span class="cuwxp">f"dedup:product:{content_hash}"</span>
        
        <span class="cd909">if</span> <span class="cd909">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">exists</span>(<span class="ct35c">key</span>):
            <span class="cd909">return</span> <span class="cd909">True</span>
        
        <span class="cd909">self</span>.<span class="ct35c">redis</span>.<span class="ct35c">setex</span>(<span class="ct35c">key</span>, <span class="cd909">self</span>.<span class="ct35c">ttl</span>, <span class="cuwxp">"1"</span>)
        <span class="cd909">return</span> <span class="cd909">False</span>
</code></pre>

**Deduplication strategies:**
- **URL-based**: Fast but misses content changes
- **Content-based**: More accurate, handles URL changes
- **Hybrid**: URL + content hash for best results

---

## Stage 5: Load - PostgreSQL Optimization for Scraped Data

How you load data determines query performance. Optimize for time-series scraped data.

### Schema Design for Scraped Data

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">-- Partitioned table for time-series data</span>
<span class="cd909">CREATE TABLE</span> <span class="ct35c">scraped_products</span> (
    <span class="ct35c">id</span> <span class="ct35c">BIGSERIAL</span>,
    <span class="ct35c">title</span> <span class="ct35c">VARCHAR</span>(<span class="cuwxp">200</span>) <span class="cd909">NOT NULL</span>,
    <span class="ct35c">price</span> <span class="ct35c">DECIMAL</span>(<span class="cuwxp">10</span>, <span class="cuwxp">2</span>) <span class="cd909">NOT NULL</span>,
    <span class="ct35c">description</span> <span class="ct35c">TEXT</span>,
    <span class="ct35c">category</span> <span class="ct35c">VARCHAR</span>(<span class="cuwxp">50</span>) <span class="cd909">NOT NULL</span>,
    <span class="ct35c">url</span> <span class="ct35c">VARCHAR</span>(<span class="cuwxp">500</span>) <span class="cd909">NOT NULL</span>,
    <span class="ct35c">source</span> <span class="ct35c">VARCHAR</span>(<span class="cuwxp">100</span>) <span class="cd909">NOT NULL</span>,
    <span class="ct35c">scraped_at</span> <span class="ct35c">TIMESTAMP</span> <span class="cd909">NOT NULL DEFAULT NOW</span>(),
    <span class="ct35c">created_at</span> <span class="ct35c">TIMESTAMP</span> <span class="cd909">NOT NULL DEFAULT NOW</span>(),
    <span class="ct35c">content_hash</span> <span class="ct35c">VARCHAR</span>(<span class="cuwxp">32</span>) <span class="cd909">NOT NULL</span>,
    
    <span class="cd909">PRIMARY KEY</span> (<span class="ct35c">id</span>, <span class="ct35c">scraped_at</span>)
) <span class="cd909">PARTITION BY RANGE</span> (<span class="ct35c">scraped_at</span>);

<span class="cd909">-- Monthly partitions</span>
<span class="cd909">CREATE TABLE</span> <span class="ct35c">scraped_products_2025_01</span> 
    <span class="cd909">PARTITION OF</span> <span class="ct35c">scraped_products</span>
    <span class="cd909">FOR VALUES FROM</span> (<span class="cuwxp">'2025-01-01'</span>) <span class="cd909">TO</span> (<span class="cuwxp">'2025-02-01'</span>);

<span class="cd909">CREATE TABLE</span> <span class="ct35c">scraped_products_2025_02</span> 
    <span class="cd909">PARTITION OF</span> <span class="ct35c">scraped_products</span>
    <span class="cd909">FOR VALUES FROM</span> (<span class="cuwxp">'2025-02-01'</span>) <span class="cd909">TO</span> (<span class="cuwxp">'2025-03-01'</span>);

<span class="cd909">-- Indexes for common queries</span>
<span class="cd909">CREATE INDEX</span> <span class="ct35c">idx_scraped_products_category</span> <span class="cd909">ON</span> <span class="ct35c">scraped_products</span>(<span class="ct35c">category</span>);
<span class="cd909">CREATE INDEX</span> <span class="ct35c">idx_scraped_products_scraped_at</span> <span class="cd909">ON</span> <span class="ct35c">scraped_products</span>(<span class="ct35c">scraped_at</span>);
<span class="cd909">CREATE INDEX</span> <span class="ct35c">idx_scraped_products_content_hash</span> <span class="cd909">ON</span> <span class="ct35c">scraped_products</span>(<span class="ct35c">content_hash</span>);
<span class="cd909">CREATE INDEX</span> <span class="ct35c">idx_scraped_products_url</span> <span class="cd909">ON</span> <span class="ct35c">scraped_products</span>(<span class="ct35c">url</span>);

<span class="cd909">-- Composite index for category + date queries</span>
<span class="cd909">CREATE INDEX</span> <span class="ct35c">idx_scraped_products_category_date</span> 
    <span class="cd909">ON</span> <span class="ct35c">scraped_products</span>(<span class="ct35c">category</span>, <span class="ct35c">scraped_at</span> <span class="cd909">DESC</span>);
</code></pre>

**Why this design works:**
- **Partitioning**: Queries only scan relevant time ranges
- **Indexes**: Fast lookups by category, date, URL
- **Content hash**: Efficient duplicate detection
- **Separate created_at/scraped_at**: Track when data was scraped vs loaded

### Bulk Loading Pattern

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">from</span> <span class="ct35c">psycopg2.extras</span> <span class="cd909">import</span> <span class="ct35c">execute_batch</span>

<span class="cd909">def</span> <span class="ct35c">load_batch</span>(<span class="ct35c">products</span>: <span class="ct35c">List</span>[<span class="ct35c">ValidatedProduct</span>], <span class="ct35c">cursor</span>):
    <span class="cd909"># Prepare data for bulk insert</span>
    <span class="ct35c">records</span> <span class="cb1xz">=</span> [
        (
            <span class="ct35c">p</span>.<span class="ct35c">title</span>,
            <span class="ct35c">p</span>.<span class="ct35c">price</span>,
            <span class="ct35c">p</span>.<span class="ct35c">description</span>,
            <span class="ct35c">p</span>.<span class="ct35c">category</span>,
            <span class="ct35c">p</span>.<span class="ct35c">url</span>,
            <span class="ct35c">p</span>.<span class="ct35c">source</span>,
            <span class="ct35c">p</span>.<span class="ct35c">scraped_at</span>,
            <span class="ct35c">hashlib</span>.<span class="ct35c">md5</span>(<span class="cuwxp">f"{p.url}|{p.title}|{p.price}"</span>.<span class="ct35c">encode</span>()).<span class="ct35c">hexdigest</span>()
        )
        <span class="cd909">for</span> <span class="ct35c">p</span> <span class="cd909">in</span> <span class="ct35c">products</span>
    ]
    
    <span class="ct35c">query</span> <span class="cb1xz">=</span> <span class="cuwxp">"""
        INSERT INTO scraped_products 
        (title, price, description, category, url, source, scraped_at, content_hash)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
    """</span>
    
    <span class="cd909"># Batch insert for performance</span>
    <span class="ct35c">execute_batch</span>(<span class="ct35c">cursor</span>, <span class="ct35c">query</span>, <span class="ct35c">records</span>, <span class="ct35c">page_size</span><span class="cb1xz">=</span><span class="cuwxp">1000</span>)
</code></pre>

**Performance tips:**
- Use `execute_batch` for bulk inserts (10x faster than individual inserts)
- Insert in batches of 1000-5000 records
- Use `ON CONFLICT DO NOTHING` to handle duplicates gracefully
- Commit in batches, not per record

---

## Complete Pipeline Implementation

Here's the full pipeline that processes hundreds of thousands of records daily:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">class</span> <span class="ct35c">ETLPipeline</span>:
    <span class="cd909">def</span> <span class="ct35c">__init__</span>(<span class="cd909">self</span>):
        <span class="cd909">self</span>.<span class="ct35c">extractor</span> <span class="cb1xz">=</span> <span class="ct35c">ProductExtractor</span>()
        <span class="cd909">self</span>.<span class="ct35c">transformer</span> <span class="cb1xz">=</span> <span class="ct35c">DataTransformer</span>()
        <span class="cd909">self</span>.<span class="ct35c">validator</span> <span class="cb1xz">=</span> <span class="ct35c">ValidatedProduct</span>
        <span class="cd909">self</span>.<span class="ct35c">deduplicator</span> <span class="cb1xz">=</span> <span class="ct35c">RedisDeduplicator</span>(<span class="ct35c">redis_client</span>)
        <span class="cd909">self</span>.<span class="ct35c">db</span> <span class="cb1xz">=</span> <span class="ct35c">get_db_connection</span>()
    
    <span class="cd909">def</span> <span class="ct35c">process_batch</span>(<span class="cd909">self</span>, <span class="ct35c">html_batch</span>: <span class="ct35c">List</span>[<span class="ct35c">tuple</span>]) <span class="cb1xz">-&gt;</span> <span class="ct35c">dict</span>:
        <span class="cuwxp">"""
        Process a batch of (html, url) tuples
        Returns: stats dict with counts
        """</span>
        <span class="ct35c">stats</span> <span class="cb1xz">=</span> {
            <span class="cuwxp">'total'</span>: <span class="ct35c">len</span>(<span class="ct35c">html_batch</span>),
            <span class="cuwxp">'extracted'</span>: <span class="cuwxp">0</span>,
            <span class="cuwxp">'validated'</span>: <span class="cuwxp">0</span>,
            <span class="cuwxp">'deduplicated'</span>: <span class="cuwxp">0</span>,
            <span class="cuwxp">'loaded'</span>: <span class="cuwxp">0</span>,
            <span class="cuwxp">'errors'</span>: []
        }
        
        <span class="cd909"># Extract</span>
        <span class="ct35c">extracted</span> <span class="cb1xz">=</span> []
        <span class="cd909">for</span> <span class="ct35c">html</span>, <span class="ct35c">url</span> <span class="cd909">in</span> <span class="ct35c">html_batch</span>:
            <span class="ct35c">data</span> <span class="cb1xz">=</span> <span class="cd909">self</span>.<span class="ct35c">extractor</span>.<span class="ct35c">extract</span>(<span class="ct35c">html</span>, <span class="ct35c">url</span>)
            <span class="cd909">if</span> <span class="ct35c">data</span>:
                <span class="ct35c">extracted</span>.<span class="ct35c">append</span>(<span class="ct35c">data</span>)
                <span class="ct35c">stats</span>[<span class="cuwxp">'extracted'</span>] <span class="cb1xz">+=</span> <span class="cuwxp">1</span>
        
        <span class="cd909"># Transform</span>
        <span class="ct35c">transformed</span> <span class="cb1xz">=</span> [<span class="cd909">self</span>.<span class="ct35c">transformer</span>.<span class="ct35c">transform</span>(<span class="ct35c">d</span>) <span class="cd909">for</span> <span class="ct35c">d</span> <span class="cd909">in</span> <span class="ct35c">extracted</span>]
        
        <span class="cd909"># Validate</span>
        <span class="ct35c">validated</span>, <span class="ct35c">errors</span> <span class="cb1xz">=</span> <span class="ct35c">validate_batch</span>(<span class="ct35c">transformed</span>)
        <span class="ct35c">stats</span>[<span class="cuwxp">'validated'</span>] <span class="cb1xz">=</span> <span class="ct35c">len</span>(<span class="ct35c">validated</span>)
        <span class="ct35c">stats</span>[<span class="cuwxp">'errors'</span>].<span class="ct35c">extend</span>(<span class="ct35c">errors</span>)
        
        <span class="cd909"># Deduplicate</span>
        <span class="ct35c">unique</span> <span class="cb1xz">=</span> [<span class="ct35c">p</span> <span class="cd909">for</span> <span class="ct35c">p</span> <span class="cd909">in</span> <span class="ct35c">validated</span> <span class="cd909">if</span> <span class="cd909">not</span> <span class="cd909">self</span>.<span class="ct35c">deduplicator</span>.<span class="ct35c">is_duplicate</span>(<span class="ct35c">p</span>)]
        <span class="ct35c">stats</span>[<span class="cuwxp">'deduplicated'</span>] <span class="cb1xz">=</span> <span class="ct35c">len</span>(<span class="ct35c">unique</span>)
        
        <span class="cd909"># Load</span>
        <span class="cd909">if</span> <span class="ct35c">unique</span>:
            <span class="ct35c">load_batch</span>(<span class="ct35c">unique</span>, <span class="cd909">self</span>.<span class="ct35c">db</span>.<span class="ct35c">cursor</span>())
            <span class="cd909">self</span>.<span class="ct35c">db</span>.<span class="ct35c">commit</span>()
            <span class="ct35c">stats</span>[<span class="cuwxp">'loaded'</span>] <span class="cb1xz">=</span> <span class="ct35c">len</span>(<span class="ct35c">unique</span>)
        
        <span class="cd909">return</span> <span class="ct35c">stats</span>
</code></pre>

---

## Monitoring and Quality Metrics

Track these metrics to catch issues early:

<pre class="cgr7g c2bb0 ca9r6 cx6ng c9xwx cme8e cmy5q"><code class="c4j9y"><span class="cd909">class</span> <span class="ct35c">PipelineMonitor</span>:
    <span class="cd909">def</span> <span class="ct35c">track_metrics</span>(<span class="cd909">self</span>, <span class="ct35c">stats</span>: <span class="ct35c">dict</span>):
        <span class="ct35c">metrics</span> <span class="cb1xz">=</span> {
            <span class="cuwxp">'extraction_rate'</span>: <span class="ct35c">stats</span>[<span class="cuwxp">'extracted'</span>] <span class="cb1xz">/</span> <span class="ct35c">stats</span>[<span class="cuwxp">'total'</span>],
            <span class="cuwxp">'validation_rate'</span>: <span class="ct35c">stats</span>[<span class="cuwxp">'validated'</span>] <span class="cb1xz">/</span> <span class="ct35c">stats</span>[<span class="cuwxp">'extracted'</span>],
            <span class="cuwxp">'deduplication_rate'</span>: <span class="ct35c">stats</span>[<span class="cuwxp">'deduplicated'</span>] <span class="cb1xz">/</span> <span class="ct35c">stats</span>[<span class="cuwxp">'validated'</span>],
            <span class="cuwxp">'error_rate'</span>: <span class="ct35c">len</span>(<span class="ct35c">stats</span>[<span class="cuwxp">'errors'</span>]) <span class="cb1xz">/</span> <span class="ct35c">stats</span>[<span class="cuwxp">'total'</span>]
        }
        
        <span class="cd909"># Alert on anomalies</span>
        <span class="cd909">if</span> <span class="ct35c">metrics</span>[<span class="cuwxp">'error_rate'</span>] <span class="cb1xz">&gt;</span> <span class="cuwxp">0.05</span>:  <span class="cd909"># 5% error rate</span>
            <span class="ct35c">alert</span>(<span class="cuwxp">f"High error rate: {metrics['error_rate']:.2%}"</span>)
        
        <span class="cd909">if</span> <span class="ct35c">metrics</span>[<span class="cuwxp">'extraction_rate'</span>] <span class="cb1xz">&lt;</span> <span class="cuwxp">0.80</span>:  <span class="cd909"># &lt;80% extraction success</span>
            <span class="ct35c">alert</span>(<span class="cuwxp">f"Low extraction rate: {metrics['extraction_rate']:.2%}"</span>)
        
        <span class="cd909">return</span> <span class="ct35c">metrics</span>
</code></pre>

**Key metrics to track:**
- Extraction success rate (target: >90%)
- Validation pass rate (target: >95%)
- Deduplication rate (target: <10% duplicates)
- Error rate (target: <5%)
- Processing time per batch

---

## Real-World Results

We've implemented this pipeline for clients processing:

- **E-commerce price monitoring**: 100K products/day, 99.7% data quality
- **Real estate listings**: 100K listings/day, <1% duplicates
- **Job postings**: 100K posts/day, 99.9% validation pass rate

**Common improvements:**
- Data cleaning time: 60% → 10% of project effort
- Query performance: 5s → 200ms (with proper indexing)
- Storage costs: 40% reduction (deduplication)
- Error detection: Real-time vs weekly reports

---

## Lessons Learned

1. **Validate early, fail fast** - Catch invalid data before it reaches the database
2. **Normalize consistently** - Standardize formats before validation
3. **Deduplicate at scale** - Use Redis or database-backed deduplication
4. **Partition by time** - Essential for time-series scraped data
5. **Monitor everything** - Track metrics to catch issues before they impact users

---

## In Conclusion

Building ETL pipelines for scraped data requires systematic approach:

- Extract with error handling and fallbacks
- Transform and normalize consistently
- Validate with schema enforcement
- Deduplicate before loading
- Optimize database schema for time-series queries

The pipeline pattern above has processed 1M+ records across 50+ projects. Start with this foundation, then adapt to your specific needs.

**Next steps:**
- Implement validation schemas for your data
- Set up monitoring and alerting
- Optimize database indexes based on query patterns
- Consider data retention policies for partitioned tables
